
import React, { useState } from "react";
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
import { useLanguage } from "@/features/language";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface AddSubscriberDialogProps {
  open: boolean;
  onClose: () => void;
  onSubscriberAdded: () => void;
}

export function AddSubscriberDialog({ 
  open, 
  onClose, 
  onSubscriberAdded 
}: AddSubscriberDialogProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  
  const getTranslation = () => {
    const translations = {
      lv: {
        title: "Pievienot jaunu abonentu",
        emailLabel: "E-pasta adrese",
        cancel: "Atcelt",
        add: "Pievienot",
        adding: "Pievieno...",
        errorRequired: "E-pasta adrese ir obligāta",
        errorInvalid: "Lūdzu, ievadiet derīgu e-pasta adresi",
        errorExists: "Šī e-pasta adrese jau eksistē",
        errorGeneric: "Kļūda pievienojot abonentu",
        success: "Abonents veiksmīgi pievienots"
      },
      en: {
        title: "Add new subscriber",
        emailLabel: "Email address",
        cancel: "Cancel",
        add: "Add",
        adding: "Adding...",
        errorRequired: "Email address is required",
        errorInvalid: "Please enter a valid email address",
        errorExists: "This email address already exists",
        errorGeneric: "Error adding subscriber",
        success: "Subscriber added successfully"
      },
      et: {
        title: "Lisa uus tellija",
        emailLabel: "E-posti aadress",
        cancel: "Tühista",
        add: "Lisa",
        adding: "Lisamine...",
        errorRequired: "E-posti aadress on kohustuslik",
        errorInvalid: "Palun sisestage kehtiv e-posti aadress",
        errorExists: "See e-posti aadress on juba olemas",
        errorGeneric: "Viga tellija lisamisel",
        success: "Tellija edukalt lisatud"
      },
      lt: {
        title: "Pridėti naują prenumeratorių",
        emailLabel: "El. pašto adresas",
        cancel: "Atšaukti",
        add: "Pridėti",
        adding: "Pridedama...",
        errorRequired: "El. pašto adresas yra privalomas",
        errorInvalid: "Įveskite galiojantį el. pašto adresą",
        errorExists: "Šis el. pašto adresas jau egzistuoja",
        errorGeneric: "Klaida pridedant prenumeratorių",
        success: "Prenumeratorius sėkmingai pridėtas"
      }
    };
    
    return translations[currentLanguage.code as keyof typeof translations] || translations.en;
  };
  
  const t = getTranslation();
  
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        variant: "destructive",
        description: t.errorRequired
      });
      return;
    }
    
    if (!isValidEmail(email)) {
      toast({
        variant: "destructive",
        description: t.errorInvalid
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email })
        .select();
      
      if (error) {
        if (error.code === '23505') { // Unique violation error code
          toast({
            variant: "destructive",
            description: t.errorExists
          });
        } else {
          console.error("Error adding subscriber:", error);
          toast({
            variant: "destructive",
            description: t.errorGeneric
          });
        }
      } else {
        toast({
          description: t.success
        });
        setEmail("");
        onSubscriberAdded();
        onClose();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        variant: "destructive",
        description: t.errorGeneric
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid w-full items-center gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t.emailLabel}
            </label>
            <Input
              id="email"
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isSubmitting}>
                {t.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.adding}
                </>
              ) : (
                t.add
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
