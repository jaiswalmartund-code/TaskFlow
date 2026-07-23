import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        (err?.message === "Network Error"
          ? "Unable to connect to server. Please check backend connection."
          : err?.message) ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-graph bg-graph bg-bone px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-graphite font-mono text-sm text-paper">
            TF
          </span>
          <h1 className="font-display text-2xl font-semibold text-graphite">Welcome back</h1>
          <p className="mt-1 text-sm text-graphite/60">Log in to your projects</p>
        </div>

        <form onSubmit={submit} className="stub-card p-6">
          <label className="text-xs font-medium uppercase tracking-wide text-graphite/50">Email</label>
          <input
            className="field-input mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
          />

          <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-graphite/50">
            Password
          </label>
          <input
            className="field-input mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && <p className="mt-3 text-xs text-coral">{error}</p>}

          <button className="btn-primary mt-5 w-full" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-graphite/60">
          No account?{" "}
          <Link to="/signup" className="font-medium text-moss hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
