"use client";

import { useState } from "react";
import { setupAdminAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Terminal, ShieldCheck, AlertCircle } from "lucide-react";
import styles from "../admin.module.css";

export default function SetupForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await setupAdminAction(null, formData);
      if (res.success) {
        // Redirect to admin dashboard
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error || "Failed to setup admin account");
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
          <h2 className={styles.authTitle}>Initialize Admin</h2>
          <p className={styles.authSub}>Create your master credentials to manage the portfolio content.</p>
        </div>

        {error && (
          <div className={`${styles.statusMessage} ${styles.statusError}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="setup-username">Username</label>
            <input required className="form-input" type="text" id="setup-username" name="username" placeholder="admin" minLength={3} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="setup-password">Password</label>
            <input required className="form-input" type="password" id="setup-password" name="password" placeholder="••••••••" minLength={6} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="setup-passcode">Setup Passcode</label>
            <input required className="form-input" type="password" id="setup-passcode" name="passcode" placeholder="Check env ADMIN_PASSCODE" />
            <span style={{ fontSize: "0.75rem", color: "var(--fg-muted)" }}>
              Requires the secret passcode defined in your local <code>.env</code> file.
            </span>
          </div>

          <button disabled={loading} type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}>
            {loading ? "Setting up..." : "Complete Setup"} <ShieldCheck size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
