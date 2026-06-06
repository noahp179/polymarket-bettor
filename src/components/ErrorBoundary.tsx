import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Longshots UI error', { error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app dark error-screen">
          <section className="panel">
            <h1>Something went wrong</h1>
            <p>Refresh the page or contact support if this continues.</p>
            <code>{this.state.message}</code>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
