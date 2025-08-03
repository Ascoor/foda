import { Component, ReactNode } from 'react';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { logError } from '@/lib/logging';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    logError(error.message, errorInfo);
    console.error(error);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{this.state.error.message}</AlertDescription>
        </Alert>
      );
    }
    return this.props.children;
  }
}
