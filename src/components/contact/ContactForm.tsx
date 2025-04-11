
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ContactFormProps {
  translations: {
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    successMessage: string;
    errorMessage: string;
  };
}

export const ContactForm: React.FC<ContactFormProps> = ({ translations: t }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    try {
      // Send email using the form data
      // In a real application, this would connect to an API to send the email
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network request
      
      console.log('Sending email to: raivis.ogorodovs@gmail.com');
      console.log('From:', name, email);
      console.log('Message:', message);
      
      toast.success(t.successMessage);
      // Reset form
      form.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">{t.formTitle}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            {t.nameLabel}
          </label>
          <Input 
            id="name" 
            name="name"
            placeholder={t.namePlaceholder} 
            required 
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            {t.emailLabel}
          </label>
          <Input 
            id="email" 
            name="email"
            type="email" 
            placeholder={t.emailPlaceholder} 
            required 
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block mb-2 text-sm font-medium">
            {t.messageLabel}
          </label>
          <Textarea 
            id="message" 
            name="message"
            placeholder={t.messagePlaceholder} 
            rows={5} 
            required 
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-orange-500 hover:bg-orange-600 text-white border-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t.submitButton}
            </span>
          ) : (
            t.submitButton
          )}
        </Button>
      </form>
    </div>
  );
};
