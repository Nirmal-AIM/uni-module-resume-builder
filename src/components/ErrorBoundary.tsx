import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
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
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] p-6 text-center">
          <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-200 shadow-xl space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Something went wrong</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              An unexpected runtime error was caught:
            </p>
            {this.state.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700 font-mono text-left overflow-x-auto max-h-32">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/dashboard';
                }}
                className="flex-1 py-2.5 bg-[#051C36] hover:bg-[#0d2d52] text-white font-bold rounded-xl text-xs transition"
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 bg-[#fc4a27] hover:bg-[#e0401f] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
