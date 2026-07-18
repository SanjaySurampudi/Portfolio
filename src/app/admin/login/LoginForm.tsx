"use client";

import { useState } from "react";
import { loginAdminAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Terminal, LogIn, AlertCircle } from "lucide-react";
import styles from "../admin.module.css";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAdminAction(null, formData);
      if (res.success) {
        // Redirect to dashboard
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error || "Invalid username or password");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div style={{ color: "var(--accent-primary)", backgroundColor: "var(--border-glow)", padding: "0.75rem", borderRadius: "12px" }}>
            <Terminal size={28} />
          </div>
          <h2 className={styles.authTitle}>Developer Login</h2>
          <p className={styles.authSub}>Access the control panel to update portfolio details.</p>
        </div>

        {error && (
          <div className={`${styles.statusMessage} ${styles.statusError}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">Username</label>
            <input required className="form-input" type="text" id="login-username" name="username" placeholder="admin" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input required className="form-input" type="password" id="login-password" name="password" placeholder="••••••••" />
          </div>

          <button disabled={loading} type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}>
            {loading ? "Authenticating..." : "Log In"} <LogIn size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
