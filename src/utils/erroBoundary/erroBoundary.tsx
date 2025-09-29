// components/ErrorBoundary.tsx
import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // opcional: log em serviço (Sentry, etc.)
    console.error("Render crash:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0f1720",
          color: "#e6f0f4",
          padding: 24
        }}>
          <div style={{ maxWidth: 560, textAlign: "center" }}>
            <h1 style={{ marginBottom: 12 }}>Ops, algo deu errado</h1>
            <p style={{ opacity: .85, marginBottom: 20 }}>
              Tivemos um problema ao exibir esta tela. Tente recarregar a página.
            </p>
            <button onClick={this.handleReload} style={{
              background: "#18AF91",
              color: "#0a2022",
              border: 0, borderRadius: 10, padding: "10px 16px", cursor: "pointer", fontWeight: 600
            }}>
              Recarregar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
