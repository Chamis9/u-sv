
export type Language = {
  code: string;
  name: string;
  flag: string;
};

// Define translations for all content
export type Translations = {
  hero: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    c2cExplanation: string;
    comingSoon: string;
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
  footer: {
    allRightsReserved: string;
    madeWith: string;
    location: string;
    c2cExplanation: string;
  };
};
