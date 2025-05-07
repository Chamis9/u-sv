
/**
 * Format price with currency symbol
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('lv-LV', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

/**
 * Format date to localized string
 */
export const formatDate = (dateString: string, locale: string = 'lv-LV'): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Format time to HH:MM format
 */
export const formatTime = (timeString: string | null): string => {
  if (!timeString) return '';
  
  // If the time already contains colons, extract hours and minutes
  if (timeString.includes(':')) {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  }
  
  return timeString;
};
