import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-brand-neonRed/20 bg-brand-cardDark/50 p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="mb-4 rounded-full bg-brand-neonRed/10 p-4 text-brand-neonRed shadow-lg shadow-brand-neonRed/5">
            <AlertTriangle className="h-10 w-10 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-sans text-white mb-2">
            Something went wrong
          </h2>
          <p className="max-w-md text-brand-textMuted text-sm font-sans mb-6">
            {this.state.error?.message || "An unexpected error occurred while rendering the dashboard. Please try refreshing."}
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center space-x-2 rounded-xl bg-brand-primaryBlue px-5 py-2.5 font-medium text-white shadow-lg shadow-brand-primaryBlue/20 transition-all hover:bg-blue-600 hover:scale-105 active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reload Application</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
