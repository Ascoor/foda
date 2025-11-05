  import { Component, type ReactNode, type ErrorInfo } from "react";
  import { Alert, AlertTitle, AlertDescription } from "@/infrastructure/shared/ui/alert";
  import { logError } from "@/infrastructure/shared/lib/logging";

  interface ErrorBoundaryProps {
    children: ReactNode;
  }

  interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
  }

  export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false, error: undefined };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      // Update state so the next render shows the fallback UI
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      // Log to your telemetry
      try {
        logError(error.message, errorInfo);
      } catch {
        // no-op: avoid throwing from error boundary
      }
      // For local dev
      // eslint-disable-next-line no-console
      console.error(error, errorInfo);
    }

    render() {
      const { hasError, error } = this.state;
      if (hasError && error) {
        return (
          <Alert variant="destructive">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        );
      }
      return this.props.children;
    }
  }

  export default ErrorBoundary;
