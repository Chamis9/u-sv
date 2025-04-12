
import { useState, useEffect } from "react";

export function useSubscriberCount(initialCount: number = 0) {
  const [subscriberCount, setSubscriberCount] = useState(initialCount);
  
  useEffect(() => {
    const handleSubscriberCountUpdate = (event: CustomEvent) => {
      setSubscriberCount(event.detail.count);
    };

    // Cast the event listener to match CustomEvent type
    const eventListener = ((e: Event) => {
      handleSubscriberCountUpdate(e as CustomEvent);
    }) as EventListener;

    window.addEventListener('subscriberCountUpdated', eventListener);
    
    return () => {
      window.removeEventListener('subscriberCountUpdated', eventListener);
    };
  }, []);
  
  return subscriberCount;
}
