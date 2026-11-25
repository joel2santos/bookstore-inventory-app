import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button, Text } from "../atoms";

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || "An unexpected error occurred.",
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-stone-50 p-6">
          <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <Text variant="h2" className="mt-4">
              Something went wrong
            </Text>
            <Text variant="body" tone="muted" className="mt-1.5">
              {this.state.message}
            </Text>
            <Button
              variant="primary"
              size="md"
              className="mt-5"
              leftIcon={<RotateCcw className="h-4 w-4" />}
              onClick={() => window.location.assign("/")}
            >
              Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
