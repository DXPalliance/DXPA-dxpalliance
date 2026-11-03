import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
  detail: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      message: "",
      detail: "",
    };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const raw = error instanceof Error ? error.message : String(error);
    try {
      const parsed = JSON.parse(raw) as {
        error?: string;
        operationType?: string;
        path?: string;
      };
      if (parsed && parsed.error) {
        return {
          hasError: true,
          message: `Database ${parsed.operationType || "operation"} error on ${
            parsed.path || "collection"
          }`,
          detail: parsed.error,
        };
      }
    } catch {
      // Not a structured Firestore error JSON
    }
    return {
      hasError: true,
      message: "Workspace encountered an unexpected error",
      detail: raw,
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h1 className="text-base font-bold text-slate-900">
                  {this.state.message}
                </h1>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed break-words">
                  {this.state.detail}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                this.setState({ hasError: false, message: "", detail: "" })
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F2749] rounded-lg hover:bg-[#173866] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Return to Workspace
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
