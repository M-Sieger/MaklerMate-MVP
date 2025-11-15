// 🛡️ ErrorBoundary.jsx – React Error Boundary für graceful error handling
// ✅ Verhindert App-Crash bei Component-Fehlern
// ✅ Zeigt User-friendly Fallback UI
// ✅ Loggt Fehler für Debugging

import PropTypes from 'prop-types';
import React from 'react';

import styles from '../styles/ErrorBoundary.module.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('🚨 ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Optional: Send to error tracking service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorCard}>
            <h2 className={styles.errorTitle}>⚠️ Etwas ist schiefgelaufen</h2>
            <p className={styles.errorMessage}>
              Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.errorDetails}>
                <summary>Fehlerdetails (nur in Entwicklung sichtbar)</summary>
                <pre className={styles.errorStack}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <button className={styles.resetButton} onClick={this.handleReset}>
              🔄 Erneut versuchen
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

export default ErrorBoundary;
