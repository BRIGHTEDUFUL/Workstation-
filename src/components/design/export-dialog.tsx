
'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { CardDetails } from './card-data';
import { toPng, toJpeg, toSvg, toCanvas } from 'html-to-image';
import jsPDF from 'jspdf';
import { Download, Loader2 } from 'lucide-react';
import ExportableCard from './exportable-card';


interface DownloadDialogProps {
  children: React.ReactNode;
  cardDetails: CardDetails;
  onOpenChange: (open: boolean) => void;
  isMobile?: boolean;
}

type Format = 'png' | 'jpg' | 'svg' | 'pdf';
type Quality = 'web' | 'print';

const DownloadDialog = ({
  cardDetails,
  children,
  onOpenChange,
  isMobile = false,
}: DownloadDialogProps) => {
  const [format, setFormat] = useState<Format>('png');
  const [quality, setQuality] = useState<Quality>('print');
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const { toast } = useToast();

  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);

  // State to track if components are rendered
  const [rendered, setRendered] = useState({ front: false, back: false });
  const isReady = rendered.front && rendered.back;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange(open);
    // Reset render status when dialog is closed
    if (!open) {
      setTimeout(() => setRendered({ front: false, back: false }), 200);
      setIsRendering(false);
    } else {
      setIsRendering(true);
    }
  };

  const handleRendered = useCallback((face: 'front' | 'back') => {
    setRendered(prev => {
        const newState = { ...prev, [face]: true };
        if (newState.front && newState.back) {
            setIsRendering(false);
        }
        return newState;
    });
  }, []);
  
  const generateImage = async (node: HTMLElement, dpi: number, format: 'png' | 'jpeg' | 'svg' | 'canvas'): Promise<string | HTMLCanvasElement> => {
    const cardWidthInches = 3.5;
    const cardHeightInches = 2;

    const options = {
        width: cardWidthInches * dpi,
        height: cardHeightInches * dpi,
        style: {
          transform: `scale(${dpi / 96})`,
          transformOrigin: 'top left',
          width: `${cardWidthInches * 96}px`,
          height: `${cardHeightInches * 96}px`,
        },
        fontEmbedCSS: `
            @font-face {
              font-family: 'Inter';
              src: url('/fonts/Inter-Regular.woff2') format('woff2');
              font-weight: 400;
              font-style: normal;
            }
            @font-face {
              font-family: 'Inter';
              src: url('/fonts/Inter-Bold.woff2') format('woff2');
              font-weight: 700;
              font-style: normal;
            }
            @font-face {
                font-family: 'Source Code Pro';
                src: url('/fonts/SourceCodePro-Regular.woff2') format('woff2');
                font-weight: 400;
                font-style: normal;
            }
        `,
        // Fetch images with a credentials flag to handle CORS.
        fetchRequestInit: {
            mode: 'cors' as RequestMode,
            credentials: 'omit' as RequestCredentials,
        },
      };
      
    const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Image generation timed out after 10 seconds')), 10000)
    );

    let imagePromise;
    if (format === 'png') {
        imagePromise = toPng(node, options);
    } else if (format === 'jpeg') {
        imagePromise = toJpeg(node, { ...options, quality: 0.95 });
    } else if (format === 'svg') {
        imagePromise = toSvg(node, options);
    } else { // canvas
        imagePromise = toCanvas(node, options);
    }

    return Promise.race([imagePromise, timeoutPromise]);
  };


  const handleDownload = async () => {
    const frontNode = cardFrontRef.current;
    const backNode = cardBackRef.current;
    
    if (!frontNode || !backNode) {
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'Card elements could not be found. Please try again.',
      });
      return;
    }

    setIsDownloading(true);

    const dpi = quality === 'print' ? 300 : 72;
    const filenameBase = `cardhub-${cardDetails.name.replace(/\s+/g, '-').toLowerCase() || 'card'}`;

    try {
      if (format === 'pdf') {
        const frontCanvas = await generateImage(frontNode, dpi, 'canvas') as HTMLCanvasElement;
        const backCanvas = await generateImage(backNode, dpi, 'canvas') as HTMLCanvasElement;
        
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'in',
          format: [3.5, 2],
        });

        pdf.addImage(frontCanvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, 3.5, 2);
        pdf.addPage();
        pdf.addImage(backCanvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, 3.5, 2);

        pdf.save(`${filenameBase}.pdf`);

      } else {
        const frontImage = await generateImage(frontNode, dpi, format as 'png' | 'jpeg' | 'svg') as string;
        downloadDataUrl(frontImage, `${filenameBase}-front.${format}`);

        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        const backImage = await generateImage(backNode, dpi, format as 'png' | 'jpeg' | 'svg') as string;
        downloadDataUrl(backImage, `${filenameBase}-back.${format}`);
      }

      toast({
        title: 'Download Successful!',
        description: `Your card has been downloaded as ${format.toUpperCase()}.`,
      });

    } catch (error: any) {
      console.error('Download failed:', error);
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: error.message || 'An unexpected error occurred while generating the file. Please check the console for details and try again.',
      });
    } finally {
      setIsDownloading(false);
      handleOpenChange(false);
    }
  };

  const downloadDataUrl = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const dialogContent = (
    <>
      <DialogHeader>
        <DialogTitle>Download Card Design</DialogTitle>
        <DialogDescription>
          Choose the format and quality for your download. Print quality (300 DPI) is recommended for physical cards.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="format" className="text-right">
            Format
          </Label>
          <Select value={format} onValueChange={(v) => setFormat(v as Format)}>
            <SelectTrigger id="format" className="col-span-3">
              <SelectValue placeholder="Select a format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpg">JPG</SelectItem>
              <SelectItem value="svg">SVG</SelectItem>
              <SelectItem value="pdf">PDF (2 Pages)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="quality" className="text-right">
            Quality
          </Label>
          <Select value={quality} onValueChange={(v) => setQuality(v as Quality)}>
            <SelectTrigger id="quality" className="col-span-3">
              <SelectValue placeholder="Select a quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="print">Print (300 DPI)</SelectItem>
              <SelectItem value="web">Web (72 DPI)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleDownload} disabled={isDownloading || isRendering}>
            {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            {isRendering ? 'Preparing...' : (isDownloading ? 'Downloading...' : 'Download')}
        </Button>
      </DialogFooter>
      {/* Off-screen container for rendering exportable cards. This is what gets captured. */}
      {isOpen && (
        <div className="absolute -left-[9999px] top-0 opacity-0 pointer-events-none">
            <ExportableCard cardDetails={cardDetails} face="front" ref={cardFrontRef} onRendered={() => handleRendered('front')} />
            <ExportableCard cardDetails={cardDetails} face="back" ref={cardBackRef} onRendered={() => handleRendered('back')} />
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild onClick={(e) => { e.preventDefault(); handleOpenChange(true); }}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {dialogContent}
            </DialogContent>
        </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};

export default DownloadDialog;
