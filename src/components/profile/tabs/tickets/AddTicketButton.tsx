
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddTicketForm } from "@/components/tickets/AddTicketForm";
import { useLanguage } from "@/features/language";

export const AddTicketButton: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  return (
    <>
      <Button 
        className="mb-4 flex items-center" 
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        {t("Pievienot biļeti", "Add ticket")}
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{t("Pievienot biļeti", "Add ticket")}</DialogTitle>
          </DialogHeader>
          <AddTicketForm onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
