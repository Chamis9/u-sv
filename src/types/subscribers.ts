
// Types for subscriber-related functionality
export interface Subscriber {
  id: number;
  email: string;
  created_at: string;
  language?: string; // Add language field as optional for backwards compatibility
}

export interface SubscriberDeleteResult {
  success: boolean;
  error: Error | null;
}

export interface SubscriberUpdateResult {
  success: boolean;
  error: Error | null;
}

export interface SubscriberFetchResult {
  data: Subscriber[] | null;
  error: Error | null;
}
