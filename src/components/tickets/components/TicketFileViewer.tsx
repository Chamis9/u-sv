
import React, { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/features/language";

interface TicketFileViewerProps {
  filePath: string | null | undefined;
  getTicketFile: (path: string) => Promise<string | null>;
}

export function TicketFileViewer({ filePath, getTicketFile }: TicketFileViewerProps) {
  const { currentLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  if (!filePath) return null;
  
  const handleViewFile = async () => {
    setLoading(true);
    try {
      const url = await getTicketFile(filePath);
      if (url) {
        setFileUrl(url);
        setFileDialogOpen(true);
      }
    } catch (error) {
      console.error('Error getting ticket file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleViewFile}
        disabled={loading}
      >
        <Eye className="h-4 w-4 mr-1" />
        {t('Skatīt failu', 'View file')}
      </Button>
      
      <Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('Biļetes fails', 'Ticket file')}</DialogTitle>
          </DialogHeader>
          <Separator className="my-2" />
          <div className="max-h-[70vh] overflow-auto">
            {fileUrl && (
              fileUrl.toLowerCase().endsWith('.pdf') ? (
                <iframe 
                  src={fileUrl} 
                  className="w-full h-[600px]" 
                  title="Ticket PDF"
                />
              ) : (
                <img 
                  src={fileUrl} 
                  alt="Ticket" 
                  className="w-full h-auto max-h-[600px] object-contain"
                />
              )
            )}
          </div>
          <div className="flex justify-center mt-2">
            <Button onClick={() => window.open(fileUrl || '', '_blank')}>
              {t('Atvērt pilnā izmērā', 'Open full size')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
