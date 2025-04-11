
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/features/language";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactTranslations } from "@/components/contact/types";

const Contact = () => {
  const { currentLanguage } = useLanguage();
  
  const translations: Record<string, ContactTranslations> = {
    lv: {
      title: "Kontaktinformācija",
      subtitle: "Sazinieties ar mums, ja jums ir jautājumi vai nepieciešama palīdzība",
      companyName: "SIA \"Par to tiek domāts\"",
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
      successMessage: "Paldies! Jūsu ziņojums ir nosūtīts. Mēs ar jums sazināsimies tuvākajā laikā.",
      errorMessage: "Kļūda! Neizdevās nosūtīt ziņojumu. Lūdzu, mēģiniet vēlreiz."
    },
    en: {
      title: "Contact Information",
      subtitle: "Get in touch with us if you have any questions or need assistance",
      companyName: "SIA \"Par to tiek domāts\"",
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
      successMessage: "Thank you! Your message has been sent. We will contact you soon.",
      errorMessage: "Error! Failed to send message. Please try again."
    },
    ru: {
      title: "Контактная информация",
      subtitle: "Свяжитесь с нами, если у вас есть вопросы или нужна помощь",
      companyName: "SIA \"Par to tiek domāts\"",
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
      successMessage: "Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.",
      errorMessage: "Ошибка! Не удалось отправить сообщение. Пожалуйста, попробуйте еще раз."
    }
  };

  const t = translations[currentLanguage.code as keyof typeof translations] || translations.en;

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
                <ContactInfo translations={t} />

                {/* Contact Form */}
                <ContactForm translations={t} />
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
