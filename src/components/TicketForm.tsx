
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/components/LanguageSelector";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Ticket } from "lucide-react";

type TicketRequest = {
  name: string;
  email: string;
  quantity: number;
};

export function TicketForm() {
  const [formData, setFormData] = useState<TicketRequest>({
    name: "",
    email: "",
    quantity: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  // Translations for the ticket form based on language
  const ticketTexts = {
    lv: {
      name: "Vārds un uzvārds",
      email: "E-pasta adrese",
      quantity: "Biļešu skaits",
      button: "Pieprasīt biļetes",
      sending: "Sūta...",
      successTitle: "Paldies par pieteikumu!",
      successMessage: "Mēs sazināsimies ar jums, kad biļetes būs pieejamas.",
      errorTitle: "Kļūda!",
      errorMessage: "Neizdevās pieteikties biļetēm. Lūdzu, mēģiniet vēlreiz.",
      dialogTitle: "Biļešu pieprasījums saņemts",
      dialogDescription: "Paldies par jūsu interesi! Mēs sazināsimies ar jums, tiklīdz biļetes būs pieejamas pārdošanā.",
      dialogClose: "Aizvērt"
    },
    en: {
      name: "Full Name",
      email: "Email Address",
      quantity: "Number of Tickets",
      button: "Request Tickets",
      sending: "Sending...",
      successTitle: "Thank you for your request!",
      successMessage: "We will contact you when tickets become available.",
      errorTitle: "Error!",
      errorMessage: "Failed to request tickets. Please try again.",
      dialogTitle: "Ticket Request Received",
      dialogDescription: "Thank you for your interest! We will contact you as soon as tickets are available for purchase.",
      dialogClose: "Close"
    },
    ru: {
      name: "Полное имя",
      email: "Электронная почта",
      quantity: "Количество билетов",
      button: "Запросить билеты",
      sending: "Отправка...",
      successTitle: "Спасибо за запрос!",
      successMessage: "Мы свяжемся с вами, когда билеты станут доступны.",
      errorTitle: "Ошибка!",
      errorMessage: "Не удалось запросить билеты. Пожалуйста, попробуйте еще раз.",
      dialogTitle: "Запрос на билеты получен",
      dialogDescription: "Спасибо за ваш интерес! Мы свяжемся с вами, как только билеты будут доступны для покупки.",
      dialogClose: "Закрыть"
    }
  };

  const texts = ticketTexts[currentLanguage.code];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Save ticket request to Supabase
      const { error } = await supabase
        .from('ticket_requests')
        .insert([{ 
          name: formData.name,
          email: formData.email,
          quantity: formData.quantity,
          request_date: new Date().toISOString()
        }]);
      
      if (error) {
        console.error("Error saving ticket request:", error);
        throw error;
      }
      
      setShowConfirmation(true);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        quantity: 1
      });
      
    } catch (error) {
      console.error("Failed to request tickets:", error);
      toast({
        title: texts.errorTitle,
        description: texts.errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-black/30 p-6 rounded-lg backdrop-blur-sm border border-white/10">
        <div className="flex items-center justify-center mb-2">
          <Ticket className="text-orange-500 mr-2" />
          <h3 className="text-white text-xl font-semibold">{texts.button}</h3>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            {texts.name}
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="h-12 text-base bg-white/10 text-white border-white/20 focus-visible:ring-orange-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            {texts.email}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="h-12 text-base bg-white/10 text-white border-white/20 focus-visible:ring-orange-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-white">
            {texts.quantity}
          </Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            max="10"
            value={formData.quantity}
            onChange={handleInputChange}
            required
            className="h-12 text-base bg-white/10 text-white border-white/20 focus-visible:ring-orange-500"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="bg-orange-500 hover:bg-orange-600 text-white h-12 text-base px-6 mt-2"
        >
          {isLoading ? texts.sending : texts.button}
        </Button>
      </form>
      
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{texts.dialogTitle}</DialogTitle>
            <DialogDescription>
              {texts.dialogDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowConfirmation(false)} className="bg-orange-500 hover:bg-orange-600">
              {texts.dialogClose}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
