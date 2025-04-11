
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/features/language";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const { currentLanguage } = useLanguage();
  
  const translations = {
    lv: {
      title: "Kontaktinformācija",
      subtitle: "Sazinieties ar mums, ja jums ir jautājumi vai nepieciešama palīdzība",
      addressTitle: "Mūsu birojs",
      address: "Rīga, Latvija",
      emailTitle: "E-pasts",
      email: "info@netieku.es",
      phoneTitle: "Tālrunis",
      phone: "+371 20 000 000",
      socialTitle: "Sociālie tīkli",
      formTitle: "Sazināties ar mums",
      nameLabel: "Vārds",
      namePlaceholder: "Jūsu vārds",
      emailLabel: "E-pasts",
      emailPlaceholder: "Jūsu e-pasta adrese",
      messageLabel: "Ziņojums",
      messagePlaceholder: "Jūsu ziņojums...",
      submitButton: "Nosūtīt ziņojumu",
      successMessage: "Paldies! Jūsu ziņojums ir nosūtīts. Mēs ar jums sazināsimies tuvākajā laikā."
    },
    en: {
      title: "Contact Information",
      subtitle: "Get in touch with us if you have any questions or need assistance",
      addressTitle: "Our Office",
      address: "Riga, Latvia",
      emailTitle: "Email",
      email: "info@netieku.es",
      phoneTitle: "Phone",
      phone: "+371 20 000 000",
      socialTitle: "Social Media",
      formTitle: "Contact Us",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "Your email address",
      messageLabel: "Message",
      messagePlaceholder: "Your message...",
      submitButton: "Send Message",
      successMessage: "Thank you! Your message has been sent. We will contact you soon."
    },
    ru: {
      title: "Контактная информация",
      subtitle: "Свяжитесь с нами, если у вас есть вопросы или нужна помощь",
      addressTitle: "Наш офис",
      address: "Рига, Латвия",
      emailTitle: "Эл. почта",
      email: "info@netieku.es",
      phoneTitle: "Телефон",
      phone: "+371 20 000 000",
      socialTitle: "Социальные сети",
      formTitle: "Связаться с нами",
      nameLabel: "Имя",
      namePlaceholder: "Ваше имя",
      emailLabel: "Эл. почта",
      emailPlaceholder: "Ваш адрес эл. почты",
      messageLabel: "Сообщение",
      messagePlaceholder: "Ваше сообщение...",
      submitButton: "Отправить сообщение",
      successMessage: "Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время."
    }
  };

  const t = translations[currentLanguage.code as keyof typeof translations] || translations.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would connect to an API to send the message
    toast.success(t.successMessage);
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  return (
    <>
      <SEO 
        title={`${t.title} | netieku.es`}
        description="Sazinieties ar netieku.es komandu ar jautājumiem par biļešu apmaiņu vai citiem jautājumiem."
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
        <Header />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-orange-500">{t.title}</span>
              </h1>
              <p className="text-xl mb-12 text-gray-300">{t.subtitle}</p>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="text-orange-500" size={24} />
                      <h3 className="text-xl font-semibold">{t.addressTitle}</h3>
                    </div>
                    <p className="pl-9 text-gray-300">{t.address}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="text-orange-500" size={24} />
                      <h3 className="text-xl font-semibold">{t.emailTitle}</h3>
                    </div>
                    <p className="pl-9 text-gray-300">
                      <a href="mailto:info@netieku.es" className="hover:text-orange-400 transition-colors">
                        {t.email}
                      </a>
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="text-orange-500" size={24} />
                      <h3 className="text-xl font-semibold">{t.phoneTitle}</h3>
                    </div>
                    <p className="pl-9 text-gray-300">
                      <a href="tel:+37120000000" className="hover:text-orange-400 transition-colors">
                        {t.phone}
                      </a>
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">{t.socialTitle}</h3>
                    <div className="flex space-x-4 pl-2">
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                         className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                        <Instagram size={20} />
                      </a>
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                         className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                        <Facebook size={20} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-6">{t.formTitle}</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium">
                        {t.nameLabel}
                      </label>
                      <Input 
                        id="name" 
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
                        placeholder={t.messagePlaceholder} 
                        rows={5} 
                        required 
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white border-none"
                    >
                      {t.submitButton}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Contact;
