"use client";

import { isSupabaseConfigured } from "@/lib/supabase/config";

const AUTH_KEY = "javivi_admin_auth";
const CRED_EMAIL_KEY = "javivi_admin_cred_email";
const CRED_PASS_KEY = "javivi_admin_cred_pass";
const DEFAULT_EMAIL = "javivi@nails.com";

export function isAdminConfigured() {
  return isSupabaseConfigured();
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "1";
}

export function hasCredentials(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(CRED_EMAIL_KEY) && !!localStorage.getItem(CRED_PASS_KEY);
}

export function getDefaultEmail() {
  return DEFAULT_EMAIL;
}

export function loginDemo(email: string, password: string): boolean {
  if (!email || !password) return false;
  // Enforce the admin email
  if (email.toLowerCase() !== DEFAULT_EMAIL.toLowerCase()) return false;
  // First access: create credentials
  if (!hasCredentials()) {
    localStorage.setItem(CRED_EMAIL_KEY, DEFAULT_EMAIL);
    localStorage.setItem(CRED_PASS_KEY, password);
  } else {
    const storedPass = localStorage.getItem(CRED_PASS_KEY);
    if (password !== storedPass) return false;
  }
  localStorage.setItem(AUTH_KEY, "1");
  localStorage.setItem("javivi_admin_email", DEFAULT_EMAIL);
  return true;
}

// resetCredentials eliminado: el admin se crea una sola vez.
// Para restablecer, se debe borrar manualmente el localStorage del navegador.

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem("javivi_admin_email");
}

export function getAdminEmail(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("javivi_admin_email") || "";
}