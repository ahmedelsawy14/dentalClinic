import { Component } from "react";
import ErrorFallback from "./ErrorFallback";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Intentionally silent in production UI; can be wired to telemetry later.
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    const { children, compact = false, fallbackTitle, fallbackDescription, fallback = null } =
      this.props;

    if (this.state.hasError) {
      return (
        fallback || (
          <ErrorFallback
            compact={compact}
            title={fallbackTitle}
            description={fallbackDescription}
            onRetry={this.handleRetry}
          />
        )
      );
    }

    return children;
  }
}

export default ErrorBoundary;
