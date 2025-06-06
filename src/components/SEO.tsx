
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/features/language';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export function SEO({
  title,
  description,
  canonicalUrl,
  ogImage = "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14"
}: SEOProps) {
  const { currentLanguage } = useLanguage();
  
  // Default SEO content for each language
  const getSEODefaults = () => {
    const defaults = {
      lv: {
        title: "SellTiX - biļešu apmaiņas platforma",
        description: "Pirmā Baltijas biļešu apmaiņas platforma - droši pērc un pārdod biļetes uz koncertiem, teātri, sporta pasākumiem un citiem notikumiem.",
        canonicalUrl: "https://selltix.eu/lv"
      },
      en: {
        title: "SellTiX - ticket exchange platform",
        description: "The first Baltic ticket exchange platform - safely buy and sell tickets for concerts, theatre, sports events and other events.",
        canonicalUrl: "https://selltix.eu/en"
      },
      ee: {
        title: "SellTiX - piletite vahetusplatvorm",
        description: "Esimene Balti piletite vahetusplatvorm - osta ja müü turvaliselt pileteid kontsertidele, teatrisse, spordiüritustele ja muudele sündmustele.",
        canonicalUrl: "https://selltix.eu/ee"
      },
      lt: {
        title: "SellTiX - bilietų mainų platforma",
        description: "Pirmoji Baltijos bilietų mainų platforma - saugiai pirkite ir parduokite bilietus į koncertus, teatrą, sporto renginius ir kitus renginius.",
        canonicalUrl: "https://selltix.eu/lt"
      }
    };
    
    return defaults[currentLanguage.code as keyof typeof defaults] || defaults.en;
  };

  const defaults = getSEODefaults();
  const finalTitle = title || defaults.title;
  const finalDescription = description || defaults.description;
  const finalCanonicalUrl = canonicalUrl || defaults.canonicalUrl;

  return (
    <Helmet>
      <html lang={currentLanguage.code} />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={finalCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalCanonicalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={currentLanguage.code === 'lv' ? 'lv_LV' : currentLanguage.code === 'en' ? 'en_US' : currentLanguage.code === 'ee' ? 'et_EE' : 'lt_LT'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={finalCanonicalUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Language alternates */}
      <link rel="alternate" hrefLang="lv" href="https://selltix.eu/lv" />
      <link rel="alternate" hrefLang="en" href="https://selltix.eu/en" />
      <link rel="alternate" hrefLang="et" href="https://selltix.eu/ee" />
      <link rel="alternate" hrefLang="lt" href="https://selltix.eu/lt" />
      <link rel="alternate" hrefLang="x-default" href="https://selltix.eu/en" />
    </Helmet>
  );
}
