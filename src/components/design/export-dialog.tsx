
'use client';

import React, { useState, useRef } from 'react';
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
import { Download } from 'lucide-react';
import ExportableCard from './exportable-card';

interface DownloadDialogProps {
  cardDetails: CardDetails;
  children: React.ReactNode;
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
  const { toast } = useToast();

  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange(open);
  };
  
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
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Source+Code+Pro:wght@400;600;700&family=Times+New+Roman&family=Georgia&display=swap');
        `,
      };
      
    const timeoutPromise = new Promise<string>((_, reject) =>
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
    // Keep dialog open during download, but allow user interaction with the rest of the page.
    // setIsOpen(true); 
    // onOpenChange(true);

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

        pdf.addImage(frontCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 3.5, 2);
        pdf.addPage();
        pdf.addImage(backCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 3.5, 2);

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
        description: error.message || 'An unexpected error occurred. Please try again.',
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
        <Button onClick={handleDownload} disabled={isDownloading}>
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? 'Downloading...' : 'Download'}
        </Button>
      </DialogFooter>
      {/* Off-screen container for rendering exportable cards */}
      <div className="absolute -left-[9999px] top-0 opacity-0 pointer-events-none">
          <ExportableCard cardDetails={cardDetails} face="front" ref={cardFrontRef} />
          <ExportableCard cardDetails={cardDetails} face="back" ref={cardBackRef} />
      </div>
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
