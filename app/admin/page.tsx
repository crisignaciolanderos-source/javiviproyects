"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Topbar from "@/components/layout/topbar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { isAdminConfigured, isLoggedIn, loginDemo, getAdminEmail, hasCredentials, getDefaultEmail } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(getDefaultEmail());
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const firstAccess = !hasCredentials();

  useEffect(() => {
    if (isLoggedIn()) router.replace("/admin/dashboard");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (firstAccess && password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (email !== getDefaultEmail() && !isAdminConfigured()) {
      // allow any email in demo? keep default enforced
    }
    setLoading(true);
    try {
      if (isAdminConfigured()) {
        const supabase = createClient();
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        localStorage.setItem("javivi_admin_auth", "1");
        localStorage.setItem("javivi_admin_email", email);
      } else {
        const ok = loginDemo(email, password);
        if (!ok) throw new Error("Credenciales incorrectas.");
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
      <Topbar />
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white border border-line rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold tracking-tight lowercase mb-2">acceso trabajadores</h1>
          <p className="text-muted text-[0.875rem] mb-6">
            Panel de administración de JAVIVI.
            {!isAdminConfigured() && (
              <span className="block mt-2 text-[0.75rem] text-rose">
                {firstAccess
                  ? "Primera vez: crea tu contraseña para javivi@nails.com."
                  : "Ingresa con tu contraseña."}
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
                className="mt-1 w-full border border-line-2 rounded-lg px-3 py-2.5 text-[0.9375rem] focus:outline-none focus:border-ink"
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
            {firstAccess && (
              <div>
                <label className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="mt-1 w-full border border-line-2 rounded-lg px-3 py-2.5 text-[0.9375rem] focus:outline-none focus:border-ink"
                  required
                />
              </div>
            )}
            {error && <p className="text-red text-[0.8125rem]">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-ink text-white font-bold uppercase text-[0.875rem] tracking-[0.04em] px-6 py-3 rounded-lg hover:bg-rose transition disabled:opacity-60"
            >
              {loading ? "Procesando..." : firstAccess ? "Crear contraseña" : "Ingresar"}
            </button>
          </form>
          {/* El admin se crea una sola vez. No hay opción de restablecer. */}
          <p className="mt-6 text-[0.75rem] text-muted">
            <Link href="/" className="hover:underline">← Volver a la tienda</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}