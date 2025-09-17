
'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { CardDetails } from '@/ai/schema';
import { Download, Loader2 } from 'lucide-react';
import { generateCardImageAction } from '@/ai/flows/generate-card-image';

interface DownloadDialogProps {
  children: React.ReactNode;
  cardDetails: CardDetails;
  onOpenChange: (open: boolean) => void;
  isMobile?: boolean;
}

type Format = 'png'; // Simplified to PNG only for reliability
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange(open);
  };
  
  const handleDownload = async () => {
    setIsDownloading(true);

    const filenameBase = `cardhub-${cardDetails.name.replace(/\s+/g, '-').toLowerCase() || 'card'}`;
    const dpi = quality === 'print' ? 300 : 72;

    try {
      // Generate and download front
      toast({ title: 'Generating front of card...' });
      const frontResult = await generateCardImageAction({ cardDetails, face: 'front', dpi });
      if (frontResult.imageDataUri) {
        downloadDataUrl(frontResult.imageDataUri, `${filenameBase}-front.${format}`);
      } else {
        throw new Error('Failed to generate front image.');
      }

      // Generate and download back
      toast({ title: 'Generating back of card...' });
      const backResult = await generateCardImageAction({ cardDetails, face: 'back', dpi });
       if (backResult.imageDataUri) {
        downloadDataUrl(backResult.imageDataUri, `${filenameBase}-back.${format}`);
      } else {
        throw new Error('Failed to generate back image.');
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
            {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
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
