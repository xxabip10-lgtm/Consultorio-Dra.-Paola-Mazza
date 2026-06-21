"use client";

import { Appointment } from "@/lib/store";
import { Panel } from "./AdminComponents";

export default function TabCitas({
  appointments,
  onChangeStatus
}: {
  appointments: Appointment[];
  onChangeStatus: (id: string, status: Appointment["status"]) => void;
}) {
  return (
    <Panel title="Gestionar citas">
      <div className="grid gap-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="rounded-lg border border-ocean-100 bg-white p-4 dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-clinic-ink dark:text-white">{appointment.patientName}</p>
                <p className="text-sm text-slate-600 dark:text-ocean-50">
                  {appointment.phone} - {appointment.reason}
                </p>
              </div>
              <select
                value={appointment.status}
                onChange={(e) => onChangeStatus(appointment.id, e.target.value as Appointment["status"])}
                className="focus-ring rounded-md border border-slate-200 px-3 py-2 dark:border-white/10 dark:bg-white/10 dark:text-white"
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cerrada">Cerrada</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
