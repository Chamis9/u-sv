
export interface Translations {
  hero: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    c2cExplanation?: string;
    subscribeText: string;
    learnMoreBtn: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: {
      title: string;
      description: string;
    }[];
  };
  cookieConsent: {
    message: string;
    learnMore: string;
    accept: string;
    decline: string;
    dialogTitle: string;
    dialogDescription: string;
    whatAreCookies: string;
    whyWeUseCookies: string;
    typesOfCookies: string;
    essentialCookiesTitle: string;
    essentialCookiesDescription: string;
    analyticsCookiesTitle: string;
    analyticsCookiesDescription: string;
    privacyPolicy: string;
    required?: string;
    savePreferences?: string;
    cookieSettings?: string;
    marketingCookies?: string;
    marketingCookiesDescription?: string;
  };
  footer: {
    allRightsReserved: string;
    madeWith: string;
    location: string;
    cookieSettings: string;
    privacyPolicy: string;
  };
  admin?: {
    title?: string;
    defaultUser?: string;
    logout?: string;
    returnToHome?: string;
    logoutSuccess?: string;
    logoutError?: string;
    tabs?: {
      dashboard?: string;
      users?: string;
      subscribers?: string;
      settings?: string;
    };
    auth?: {
      supabaseAuthAvailable?: string;
    };
    settings?: {
      security?: {
        title?: string;
        description?: string;
        comingSoon?: string;
      };
      integrations?: {
        title?: string;
        description?: string;
        comingSoon?: string;
      };
    };
  };
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}
