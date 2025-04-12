
import { Translations } from '../types';

export const enTranslations: Translations = {
  hero: {
    title: "Buy and sell tickets",
    titleHighlight: "simply and securely",
    subtitle: "The first platform for ticket exchange in Latvia",
    subscribeText: "Subscribe to learn about platform launch",
    learnMoreBtn: "Learn more",
  },
  howItWorks: {
    title: "How it works",
    subtitle: "A simple and secure way to sell or purchase event tickets",
    steps: [
      {
        title: "List your ticket",
        description: "List your event ticket on the platform quickly and easily"
      },
      {
        title: "Connect with buyers",
        description: "Use the platform's communication features"
      },
      {
        title: "Secure exchange",
        description: "Simple and secure exchange process"
      },
      {
        title: "Attend the event",
        description: "Event attendance and emotions are guaranteed"
      }
    ]
  },
  cookieConsent: {
    message: "We use cookies on our website. By continuing to use this site, you agree to our cookie policy.",
    learnMore: "Learn more",
    accept: "Accept",
    decline: "Decline",
    dialogTitle: "Cookie Policy",
    dialogDescription: "Information about cookies and their usage on our platform.",
    whatAreCookies: "Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better user experience.",
    whyWeUseCookies: "We use cookies to improve site functionality, analyze user traffic, and personalize your experience.",
    typesOfCookies: "We use the following types of cookies:",
    essentialCookiesTitle: "Essential Cookies",
    essentialCookiesDescription: "These cookies are necessary for the basic functions of the website. They allow you to navigate around the site and use its features.",
    analyticsCookiesTitle: "Analytics Cookies",
    analyticsCookiesDescription: "These cookies help us understand how users interact with the website by collecting and reporting information anonymously.",
    privacyPolicy: "For more information about how we use your data, please see our privacy policy.",
    required: "Required",
    savePreferences: "Save preferences",
    cookieSettings: "Cookie Settings",
    marketingCookies: "Marketing cookies",
    marketingCookiesDescription: "These cookies are used to track users across websites and display relevant advertisements that are relevant and engaging to the individual user."
  },
  footer: {
    allRightsReserved: "All rights reserved.",
    madeWith: "Made with",
    location: "in Latvia",
    cookieSettings: "Cookie Settings",
    privacyPolicy: "Privacy Policy"
  },
  admin: {
    title: "Administrator Panel",
    defaultUser: "Administrator",
    logout: "Logout",
    returnToHome: "Return to Home Page",
    logoutSuccess: "You have been successfully logged out",
    logoutError: "Error during logout process",
    tabs: {
      dashboard: "Dashboard",
      users: "Users",
      subscribers: "Subscribers",
      settings: "Settings"
    },
    auth: {
      supabaseAuthAvailable: "Supabase authentication is available. Please use an admin account to log in."
    },
    settings: {
      security: {
        title: "Security Settings",
        description: "Manage platform security settings",
        comingSoon: "Security settings will be added soon..."
      },
      integrations: {
        title: "Integrations",
        description: "Manage third-party integrations",
        comingSoon: "Integration settings will be added soon..."
      }
    }
  }
};
