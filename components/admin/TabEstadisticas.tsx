"use client";

import { supabase } from "@/lib/store";
import { Insight, Panel } from "./AdminComponents";

export default function TabEstadisticas({
  stats
}: {
  stats: {
    approved: number;
    pending: number;
    average: number;
    whatsapp: number;
    appointments: number;
  };
}) {
  return (
    <Panel title="Estadisticas">
      <div className="grid gap-4 md:grid-cols-3">
        <Insight
          title="Base de datos"
          value={supabase ? "Supabase" : "Local"}
          text="Cuando Supabase esta configurado, resenas y cambios se comparten entre usuarios."
        />
        <Insight
          title="Conversion WhatsApp"
          value={stats.whatsapp}
          text="Clicks guardados desde los botones principales del sitio."
        />
        <Insight
          title="Reputacion"
          value={`${stats.average.toFixed(1)}/5`}
          text="Promedio calculado sobre resenas aprobadas."
        />
      </div>
    </Panel>
  );
}
