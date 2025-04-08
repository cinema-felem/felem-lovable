
// Global type declarations

// Google Analytics gtag function
interface Window {
  gtag: (
    command: 'event' | 'config' | 'consent' | 'get', 
    action: string, 
    params?: Record<string, any>
  ) => void;
  dataLayer: any[];
}
