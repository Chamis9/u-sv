
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2 } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Subscriber } from "@/hooks/useSubscribers";

interface EditSubscriberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriber: Subscriber | null;
  email: string;
  onEmailChange: (email: string) => void;
  onSave: () => Promise<void>;
  isProcessing: boolean;
}

export function EditSubscriberDialog({
  open,
  onOpenChange,
  subscriber,
  email,
  onEmailChange,
  onSave,
  isProcessing
}: EditSubscriberDialogProps) {
  const { translations } = useLanguage();
  const t = translations.admin?.subscribers || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.editTitle || 'Edit Subscriber'}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <label htmlFor="email" className="text-sm font-medium mb-2 block">
            {t.emailAddress || 'Email Address'}
          </label>
          <Input
            id="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="example@example.com"
            disabled={isProcessing}
          />
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isProcessing}>{t.cancel || 'Cancel'}</Button>
          </DialogClose>
          <Button onClick={onSave} disabled={isProcessing}>
            {isProcessing ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.saving || 'Saving...'}
              </span>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {t.save || 'Save'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
