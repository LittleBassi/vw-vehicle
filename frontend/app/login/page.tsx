"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
const router = useRouter();
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data?.error || "Login failed");
      setLoading(false);
      return;
    }
    router.replace("/");
  } catch (err) {
    console.error("Login client error:", err);
    setError("Unexpected error connecting to server");
    setLoading(false);
  }
  };

  return (
  <div style={{ display: "flex", justifyContent: "center", marginTop: "80px" }}>
  <form onSubmit={handleSubmit} style={{ width: 360, padding: 24, borderRadius: 8, boxShadow: "0 0 8px rgba(0,0,0,0.08)", background: "#fff" }}>
  <h2 style={{ marginBottom: 16 }}>Login</h2>
      <label style={{ display: "block", marginBottom: 8 }}>Username</label>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />

      <label style={{ display: "block", marginBottom: 8 }}>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />

      <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
        {loading ? "Entrando..." : "Entrar"}
      </button>

      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
    </form>
  </div>
  );
}