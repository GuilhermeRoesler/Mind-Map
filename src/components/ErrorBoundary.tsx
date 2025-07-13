import React from "react";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Erro capturado pelo ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 24 }}>
                    <h2>😢 Algo deu errado.</h2>
                    <pre style={{ color: "red" }}>{this.state.error?.toString()}</pre>
                </div>
            );
        }

        return this.props.children;
    }
}
