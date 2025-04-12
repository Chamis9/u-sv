
import { useState, useEffect } from "react";

/**
 * Custom hook to track subscriber count, listening for updates via custom events
 * @param initialCount Initial subscriber count
 * @returns Current subscriber count
 */
export function useSubscriberCount(initialCount: number = 0) {
  const [subscriberCount, setSubscriberCount] = useState(initialCount);
  
  useEffect(() => {
    // Handler for subscriber count update events
    const handleSubscriberCountUpdate = (event: CustomEvent) => {
      setSubscriberCount(event.detail.count);
    };

    // Cast the event listener to match CustomEvent type
    const eventListener = ((e: Event) => {
      handleSubscriberCountUpdate(e as CustomEvent);
    }) as EventListener;

    // Set up and clean up event listener
    window.addEventListener('subscriberCountUpdated', eventListener);
    return () => {
      window.removeEventListener('subscriberCountUpdated', eventListener);
    };
  }, []);
  
  return subscriberCount;
}
