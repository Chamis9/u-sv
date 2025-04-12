
import { Subscriber } from '@/types/subscribers';

/**
 * Filter subscribers based on a search term
 */
export function filterSubscribers(subscribers: Subscriber[], searchTerm: string): Subscriber[] {
  if (!searchTerm) return subscribers;
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
  return subscribers.filter(subscriber => 
    subscriber.email?.toLowerCase().includes(lowerCaseSearchTerm)
  );
}

/**
 * Creates a downloadable CSV blob
 */
export function createDownloadableCSV(subscribers: Subscriber[]): { 
  blob: Blob; 
  filename: string;
} {
  const filename = 'newsletter_subscribers.csv';
  const csvHeader = 'ID,Email,Created At\n';
  let csvContent = csvHeader;

  subscribers.forEach((subscriber) => {
    const row = `${subscriber.id},${subscriber.email},${subscriber.created_at}\n`;
    csvContent += row;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  return { blob, filename };
}

/**
 * Download a CSV file in a cross-browser compatible way
 */
export function downloadBlob(blob: Blob, filename: string): void {
  // Create an anchor element
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  // Modern browsers can use the download attribute
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}
