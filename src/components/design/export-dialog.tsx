
'use client'

import React, { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { CardDetails } from './card-data';
import { toCanvas } from 'html-to-image';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';

interface DownloadDialogProps {
  cardFrontRef: React.RefObject<HTMLDivElement>;
  cardBackRef: React.RefObject<HTMLDivElement>;
  cardDetails: CardDetails;
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
  isMobile?: boolean;
}

type Format = 'png' | 'jpg' | 'pdf';
type Quality = 'web' | 'print';

const DownloadDialog = ({
  cardFrontRef,
  cardBackRef,
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange(open);
  };

  const generateImage = async (node: HTMLElement, dpi: number): Promise<string> => {
    const cardWidthInches = 3.5;
    const cardHeightInches = 2;
    const width = cardWidthInches * dpi;
    const height = cardHeightInches * dpi;

    // By passing the node to a filter function, we can screenshot the node.
    const filter = (n: HTMLElement) => {
        if (n.contains && n.contains(node)) {
            return true;
        }
        return n === node;
    }

    // Since we are using a filter, we should use document.body to get the whole page.
    const canvas = await toCanvas(document.body, {
        width,
        height,
        pixelRatio: 1, // We are handling resolution via width/height, so pixelRatio should be 1.
        filter,
        // The following props improve reliability
        skipAutoScale: true,
        cacheBust: true,
        // The canvas background should be transparent.
        backgroundColor: 'rgba(0,0,0,0)',
    });
    
    // We create a new canvas to draw the background color.
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = width;
    finalCanvas.height = height;
    const ctx = finalCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = node.style.backgroundColor || '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(canvas, 0, 0);
    }
    
    if (format === 'png') {
        return finalCanvas.toDataURL('image/png');
    }
    // For JPG, quality is a number between 0 and 1.
    return finalCanvas.toDataURL('image/jpeg', 0.95);
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
    onOpenChange(true); // Keep parent aware of state

    const dpi = quality === 'print' ? 300 : 72;
    const filenameBase = cardDetails.name.replace(/\s+/g, '-').toLowerCase() || 'card';

    try {
      if (format === 'pdf') {
        // Use JPEG for PDF to keep file size reasonable.
        const frontImage = await generateImage(frontNode, dpi);
        const backImage = await generateImage(backNode, dpi);
        
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'in',
          format: [3.5, 2], // Standard business card size
        });

        // Add front image to the first page
        pdf.addImage(frontImage, 'JPEG', 0, 0, 3.5, 2);
        
        // Add a new page for the back
        pdf.addPage();
        pdf.addImage(backImage, 'JPEG', 0, 0, 3.5, 2);

        pdf.save(`${filenameBase}.pdf`);

      } else {
        // Handle PNG and JPG downloads
        const frontImage = await generateImage(frontNode, dpi);
        const backImage = await generateImage(backNode, dpi);

        // Download front and back images sequentially
        downloadDataUrl(frontImage, `${filenameBase}-front.${format}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause to allow the first download to initiate
        downloadDataUrl(backImage, `${filenameBase}-back.${format}`);
      }

      toast({
        title: 'Download Successful!',
        description: `Your card has been downloaded as ${format.toUpperCase()}.`,
      });

    } catch (error) {
      console.error('Download failed:', error);
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'An unexpected error occurred. Please try again.',
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
