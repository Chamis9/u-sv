
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Subscriber } from "@/hooks/useSubscribers";

interface DeleteSubscriberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriber: Subscriber | null;
  onConfirm: () => Promise<void>;
  isProcessing: boolean;
}

export function DeleteSubscriberDialog({
  open,
  onOpenChange,
  subscriber,
  onConfirm,
  isProcessing
}: DeleteSubscriberDialogProps) {
  const { translations } = useLanguage();
  const t = translations.admin?.subscribers || {};

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.confirmDeleteTitle || 'Confirm Deletion'}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.confirmDelete || 'Are you sure you want to delete this subscriber?'} 
            {subscriber && (
              <span className="font-medium block mt-2">
                {subscriber.email}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>
            {t.cancel || 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isProcessing}
            className="bg-red-500 hover:bg-red-600"
          >
            {isProcessing ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.deleting || 'Deleting...'}
              </span>
            ) : (
              t.delete || 'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
