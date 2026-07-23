import { useState } from "react";
import Navbar from "../components/Navbar.jsx";

export default function GitHubIntegration() {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bone bg-graph-subtle">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl border border-gray-200/80 bg-white p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto">
          {/* GitHub Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1B1F23] text-white shadow-md mb-6">
            <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-graphite">
            Connect your GitHub account
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-graphite/60 leading-relaxed max-w-md mx-auto">
            Sync your TaskFlow projects with GitHub repositories to automatically link commits, track pull requests, and manage issues.
          </p>

          {connected ? (
            <div className="mt-8 rounded-2xl bg-emerald-50 border border-emerald-200/80 p-4 text-emerald-800">
              <p className="text-xs font-bold flex items-center justify-center gap-1.5">
                <span>✓</span> GitHub Account Connected (<span className="font-mono">martund</span>)
              </p>
              <button
                onClick={() => setConnected(false)}
                className="mt-3 text-[11px] font-semibold text-emerald-700 hover:underline"
              >
                Disconnect Account
              </button>
            </div>
          ) : (
            <div className="mt-8">
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#1B1F23] px-6 py-3 text-xs font-semibold text-white hover:bg-black transition shadow-sm disabled:opacity-50"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>{connecting ? "Connecting to GitHub..." : "Connect GitHub Account"}</span>
              </button>
            </div>
          )}

          {/* Features preview */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-8 text-left">
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <h4 className="text-xs font-bold text-graphite">Commit Linker</h4>
              <p className="text-[11px] text-graphite/60 mt-1 leading-snug">
                Automatically associate commits with task tickets using `#task-id`.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <h4 className="text-xs font-bold text-graphite">PR Status Sync</h4>
              <p className="text-[11px] text-graphite/60 mt-1 leading-snug">
                Move tasks to 'Done' automatically when pull requests are merged.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <h4 className="text-xs font-bold text-graphite">Issue Importer</h4>
              <p className="text-[11px] text-graphite/60 mt-1 leading-snug">
                Convert GitHub issues into TaskFlow board tasks with one click.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
