import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught an error", error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-red-500">
          حدث خطأ غير متوقع. الرجاء تحديث الصفحة.
        </div>
      );
    }

    return this.props.children;
  }
}
