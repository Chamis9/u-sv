
// Utility functions for formatting values

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('lv-LV', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

// Format date with localization
export const formatDate = (dateString: string, locale: string = 'lv-LV'): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

// Format price to display with proper currency symbol
export const formatPrice = (price: number): string => {
  return formatCurrency(price);
};
