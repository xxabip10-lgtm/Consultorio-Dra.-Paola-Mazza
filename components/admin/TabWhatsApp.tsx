"use client";

import { WhatsappRequest } from "@/lib/store";
import { Panel } from "./AdminComponents";

export default function TabWhatsApp({
  requests
}: {
  requests: WhatsappRequest[];
}) {
  return (
    <Panel title="Solicitudes de WhatsApp">
      <div className="grid gap-3">
        {requests.length === 0 && (
          <p className="text-slate-600 dark:text-ocean-50">
            Todavia no hay clicks registrados en los botones de WhatsApp.
          </p>
        )}
        {requests.map((request) => (
          <div
            key={request.id}
            className="rounded-lg border border-ocean-100 bg-white p-4 dark:border-white/10 dark:bg-white/5"
          >
            <p className="font-bold text-clinic-ink dark:text-white">{request.label}</p>
            <p className="text-sm text-slate-500 dark:text-ocean-100">
              {new Date(request.createdAt).toLocaleString("es-UY")}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
