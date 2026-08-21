'use client';

import React from 'react';

export default class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Global Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: 'var(--black)', color: 'white', height: '100vh', overflow: 'auto' }}>
          <h1 style={{ color: 'red' }}>App Crashed</h1>
          <p>Please send this error to the developer:</p>
          <pre style={{ backgroundColor: '#222', padding: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '12px' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <pre style={{ backgroundColor: '#222', padding: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '12px', marginTop: '10px' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '20px', padding: '10px', backgroundColor: 'white', color: 'black' }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
