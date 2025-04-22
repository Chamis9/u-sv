
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/features/language";
import type { User } from "@/types/users";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SendEmailDialogProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

export function SendEmailDialog({ user, open, onClose }: SendEmailDialogProps) {
  const { currentLanguage } = useLanguage();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  const handleSend = async () => {
    if (!subject || !message) {
      toast.error(t("Lūdzu, aizpildiet visus laukus", "Please fill in all fields"));
      return;
    }

    setIsSending(true);
    try {
      console.log(`Sending email to ${user.email} with subject: ${subject}`);
      
      const { error } = await supabase.functions.invoke('send-user-email', {
        body: {
          to: user.email,
          subject,
          message: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">${subject}</h2>
              <div style="white-space: pre-wrap; line-height: 1.5; color: #555;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p style="color: #777; font-size: 12px;">
                Šis e-pasts nosūtīts no Netieku.es administrācijas.
              </p>
            </div>
          `,
          from: "Netieku.es <info@netieku.es>"
        }
      });

      if (error) {
        console.error('Error sending email:', error);
        throw error;
      }

      toast.success(t(
        "E-pasts veiksmīgi nosūtīts lietotājam", 
        "Email successfully sent to the user"
      ));
      
      setSubject("");
      setMessage("");
      onClose();
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error(t(
        `Kļūda sūtot e-pastu: ${error.message || 'Nezināma kļūda'}`,
        `Error sending email: ${error.message || 'Unknown error'}`
      ));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t("Sūtīt e-pastu lietotājam", "Send Email to User")}
          </DialogTitle>
          <DialogDescription>
            {t(
              `Sūtīt e-pastu uz ${user.email}`, 
              `Send email to ${user.email}`
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">
              {t("Tēma", "Subject")}
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("E-pasta tēma", "Email subject")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">
              {t("Ziņojums", "Message")}
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("Jūsu ziņojums...", "Your message...")}
              rows={8}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("Atcelt", "Cancel")}
          </Button>
          <Button onClick={handleSend} disabled={isSending || !subject || !message}>
            {isSending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("Nosūta...", "Sending...")}
              </span>
            ) : (
              t("Nosūtīt", "Send")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
