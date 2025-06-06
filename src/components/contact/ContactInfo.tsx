
import React from "react";
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin } from "lucide-react";
import { useLanguage } from "@/features/language";

interface ContactInfoProps {
  translations: {
    companyName: string;
    addressTitle: string;
    address: string;
    emailTitle: string;
    email: string;
    phoneTitle: string;
    phone: string;
    socialTitle: string;
  };
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ translations: t }) => {
  return (
    <div className="space-y-8 bg-ticket-bg/70 backdrop-blur-sm p-6 rounded-lg border-2 border-ticket-accent shadow-lg">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-ticket-accent">{t.companyName}</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <MapPin className="text-ticket-accent" size={24} />
          <h3 className="text-xl font-semibold text-ticket-text">{t.addressTitle}</h3>
        </div>
        <p className="pl-9 text-ticket-text/80 font-medium">{t.address}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Mail className="text-ticket-accent" size={24} />
          <h3 className="text-xl font-semibold text-ticket-text">{t.emailTitle}</h3>
        </div>
        <p className="pl-9">
          <a href={`mailto:${t.email}`} className="text-ticket-text/80 font-medium hover:text-ticket-accent transition-colors">
            {t.email}
          </a>
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Phone className="text-ticket-accent" size={24} />
          <h3 className="text-xl font-semibold text-ticket-text">{t.phoneTitle}</h3>
        </div>
        <p className="pl-9 text-ticket-text/80 font-medium">
          {t.phone}
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-ticket-text">{t.socialTitle}</h3>
        <div className="flex space-x-4 pl-2">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
             className="p-2 bg-ticket-bg/80 border border-ticket-accent/20 rounded-full hover:bg-ticket-accent/10 transition-colors" 
             aria-label="Instagram">
            <Instagram size={20} className="text-ticket-accent" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
             className="p-2 bg-ticket-bg/80 border border-ticket-accent/20 rounded-full hover:bg-ticket-accent/10 transition-colors"
             aria-label="Facebook">
            <Facebook size={20} className="text-ticket-accent" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
             className="p-2 bg-ticket-bg/80 border border-ticket-accent/20 rounded-full hover:bg-ticket-accent/10 transition-colors"
             aria-label="LinkedIn">
            <Linkedin size={20} className="text-ticket-accent" />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
             className="p-2 bg-ticket-bg/80 border border-ticket-accent/20 rounded-full hover:bg-ticket-accent/10 transition-colors"
             aria-label="TikTok">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-ticket-accent"
            >
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
