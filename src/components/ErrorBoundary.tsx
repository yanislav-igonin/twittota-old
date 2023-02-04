import React, { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error) {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can use your own error logging service here
    console.log({
      error,
      errorInfo,
    });
  }

  public render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button
            onClick={() => {
              return this.setState({
                hasError: false,
              });
            }}
            type="button"
          >
            Try again?
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
