
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
import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';

interface ExportDialogProps {
  cardFrontRef: React.RefObject<HTMLDivElement>;
  cardBackRef: React.RefObject<HTMLDivElement>;
  cardDetails: CardDetails;
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
  isMobile?: boolean;
}

type Format = 'png' | 'jpg' | 'pdf';
type Quality = 'web' | 'print';

const ExportDialog = ({
  cardFrontRef,
  cardBackRef,
  cardDetails,
  children,
  onOpenChange,
  isMobile = false,
}: ExportDialogProps) => {
  const [format, setFormat] = useState<Format>('png');
  const [quality, setQuality] = useState<Quality>('print');
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange(open);
  };

  const generateImage = async (node: HTMLElement, dpi: number, fileType: 'png' | 'jpeg') => {
    const cardWidthInches = 3.5;
    const cardHeightInches = 2;
    const width = cardWidthInches * dpi;
    const height = cardHeightInches * dpi;

    const options = {
        width,
        height,
        style: {
            width: `${width}px`,
            height: `${height}px`,
        },
        pixelRatio: 1, 
    };

    if (fileType === 'png') {
        return toPng(node, options);
    } else {
        return toJpeg(node, { ...options, quality: 0.95 });
    }
  };


  const handleExport = async () => {
    const frontNode = cardFrontRef.current;
    const backNode = cardBackRef.current;

    if (!frontNode || !backNode) {
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'Card elements could not be found. Please try again.',
      });
      return;
    }

    setIsExporting(true);
    onOpenChange(true); 

    const dpi = quality === 'print' ? 300 : 72;
    const filenameBase = cardDetails.name.replace(/\s+/g, '-').toLowerCase();

    try {
      if (format === 'pdf') {
        const frontImage = await generateImage(frontNode, dpi, 'jpeg');
        const backImage = await generateImage(backNode, dpi, 'jpeg');
        
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'in',
          format: [3.5, 2],
        });

        pdf.addImage(frontImage, 'JPEG', 0, 0, 3.5, 2);
        
        pdf.addPage();
        pdf.addImage(backImage, 'JPEG', 0, 0, 3.5, 2);

        pdf.save(`${filenameBase}.pdf`);

      } else {
        const fileType = format === 'png' ? 'png' : 'jpeg';
        const frontImage = await generateImage(frontNode, dpi, fileType);
        const backImage = await generateImage(backNode, dpi, fileType);

        downloadDataUrl(frontImage, `${filenameBase}-front.${format}`);
        await new Promise(resolve => setTimeout(resolve, 500)); 
        downloadDataUrl(backImage, `${filenameBase}-back.${format}`);
      }

      toast({
        title: 'Export Successful!',
        description: `Your card has been exported as ${format.toUpperCase()}.`,
      });

    } catch (error) {
      console.error('Export failed:', error);
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'An unexpected error occurred while generating the file(s).',
      });
    } finally {
      setIsExporting(false);
      handleOpenChange(false);
    }
  };

  const downloadDataUrl = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  };
  
  const dialogContent = (
    <>
      <DialogHeader>
        <DialogTitle>Export Card Design</DialogTitle>
        <DialogDescription>
          Choose the format and quality for your export. Print quality (300 DPI) is recommended for physical cards.
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
        <Button onClick={handleExport} disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DialogFooter>
    </>
  );

  if (isMobile) {
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild onClick={() => handleOpenChange(true)}>
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

export default ExportDialog;
