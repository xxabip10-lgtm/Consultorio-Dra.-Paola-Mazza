"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/store";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminPanel from "@/components/admin/AdminPanel";

export default function FlyingDragonsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setAuthenticated(true);
        }
      } else {
        if (window.localStorage.getItem("paola-mazza-admin") === "true") {
          setAuthenticated(true);
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-clinic-sky dark:bg-[#07181f]">
        <p className="text-slate-500 dark:text-ocean-100">Verificando acceso...</p>
      </main>
    );
  }

  if (!authenticated) return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  return <AdminPanel onLogout={() => setAuthenticated(false)} />;
}
