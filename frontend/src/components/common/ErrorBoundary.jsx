import React from 'react';
import { FiRefreshCw, FiHome } from 'react-icons/fi';
import './ErrorBoundary.css';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Wayfare ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-card">
            <span className="error-boundary-icon" role="img" aria-label="Warning">
              ⚠️
            </span>
            <h2 className="error-boundary-title">Something went wrong</h2>
            <p className="error-boundary-message">
              We encountered an unexpected error while loading this page. Please try refreshing or return home.
            </p>
            {this.state.error?.message && (
              <div className="error-boundary-details">
                {this.state.error.message}
              </div>
            )}
            <div className="error-boundary-actions">
              <button className="btn btn-primary" onClick={this.handleReload}>
                <FiRefreshCw /> Refresh Page
              </button>
              <button className="btn btn-secondary" onClick={this.handleGoHome}>
                <FiHome /> Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
