
import { Component, ErrorInfo, ReactNode } from 'react';
import { Sentry } from '@/integrations/sentry/config';
import { Button } from './ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  eventId: string | null;
}

class SentryErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, eventId: null };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true, eventId: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    Sentry.withScope((scope) => {
      // Convert ErrorInfo to a plain object with string keys
      const extras = {
        componentStack: errorInfo.componentStack || '',
        // Add any other properties from errorInfo if needed
      };
      
      scope.setExtras(extras);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
    console.error("Uncaught error:", error, errorInfo);
  }

  handleFeedbackClick = () => {
    if (this.state.eventId) {
      Sentry.showReportDialog({ eventId: this.state.eventId });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-cinema-dark-blue text-white">
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <p className="text-lg mb-6">We've been notified about this issue and are working to fix it.</p>
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-cinema-gold hover:bg-cinema-gold/90 text-black" 
              onClick={() => window.location.href = '/'}
            >
              Return to Home
            </Button>
            <Button 
              variant="outline" 
              onClick={this.handleFeedbackClick}
            >
              Report Feedback
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SentryErrorBoundary;
