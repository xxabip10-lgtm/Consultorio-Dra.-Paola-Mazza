"use client";

import { FormEvent, useState } from "react";
import { supabase, adminAccessCode } from "@/lib/store";

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const hasSupabaseAuth = !!supabase;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (supabase) {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
      onLogin();
    } else {
      if (code.trim() === adminAccessCode) {
        window.localStorage.setItem("paola-mazza-admin", "true");
        onLogin();
      } else {
        setError("Codigo incorrecto.");
      }
    }
    setLoading(false);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-clinic-sky px-4 dark:bg-[#07181f]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-ocean-100 bg-white p-8 shadow-soft dark:border-white/10 dark:bg-white/5"
      >
        <h1 className="text-3xl font-bold text-clinic-ink dark:text-white">
          Panel privado
        </h1>
        <p className="mt-3 text-slate-600 dark:text-ocean-50">
          {hasSupabaseAuth
            ? "Ingresa con tu correo y contrasena."
            : "Ingresa el codigo privado para editar el contenido."}
        </p>

        {hasSupabaseAuth ? (
          <>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electronico"
              type="email"
              autoComplete="email"
              required
              className="focus-ring mt-6 w-full rounded-md border border-slate-200 px-4 py-3 dark:border-white/10 dark:bg-white/10 dark:text-white"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contrasena"
              type="password"
              autoComplete="current-password"
              required
              className="focus-ring mt-4 w-full rounded-md border border-slate-200 px-4 py-3 dark:border-white/10 dark:bg-white/10 dark:text-white"
            />
          </>
        ) : (
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Codigo privado"
            type="password"
            required
            className="focus-ring mt-6 w-full rounded-md border border-slate-200 px-4 py-3 dark:border-white/10 dark:bg-white/10 dark:text-white"
          />
        )}

        {error && (
          <p className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="focus-ring mt-4 w-full rounded-full bg-ocean-500 px-5 py-3 font-bold text-white shadow-glow transition hover:bg-ocean-600 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
