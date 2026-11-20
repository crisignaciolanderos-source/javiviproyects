"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { isAdminConfigured, isLoggedIn, loginDemo, getDefaultEmail } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // En modo demo, fijar email a javivi@nails.com
  useEffect(() => {
    if (!isAdminConfigured()) {
      setEmail(getDefaultEmail());
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn()) router.replace("/admin/dashboard");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isAdminConfigured()) {
        const supabase = createClient();
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw new Error("Correo o contraseña incorrectos.");
        localStorage.setItem("javivi_admin_auth", "1");
        localStorage.setItem("javivi_admin_email", email);
      } else {
        const ok = loginDemo(email, password);
        if (!ok) throw new Error("Correo o contraseña incorrectos.");
      }
      router.replace("/admin/dashboard");
    } catch (err: any) {
      setError(err?.message || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-[var(--white)] border border-line rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold tracking-tight mb-2">Acceso trabajadores</h1>
          <p className="text-muted text-[0.875rem] mb-6">
            Panel de administración de JAVIVI.
            {!isAdminConfigured() && (
              <span className="block mt-2 text-[0.75rem] text-rose">
                Modo demo: el admin se crea la primera vez que ingresas.
              </span>
            )}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isAdminConfigured()}
                className="mt-1 w-full border border-line-2 rounded-lg px-3 py-2.5 text-[0.9375rem] focus:outline-none focus:border-ink disabled:bg-[var(--gray)] disabled:text-muted"
                required
              />
            </div>
            <div>
              <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-line-2 rounded-lg px-3 py-2.5 text-[0.9375rem] focus:outline-none focus:border-ink"
                required
              />
            </div>
            {error && <p className="text-red text-[0.8125rem]">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2a2a4a] text-white font-bold uppercase text-[0.875rem] tracking-[0.04em] px-6 py-3 rounded-lg hover:bg-rose transition disabled:opacity-60"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
          <p className="mt-6 text-[0.75rem] text-muted">
            <Link href="/" className="hover:underline">← Volver a la tienda</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}