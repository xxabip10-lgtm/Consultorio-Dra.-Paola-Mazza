"use client";

import { Plus, Save, Trash2 } from "lucide-react";
import { ServiceItem } from "@/lib/store";
import { Panel } from "./AdminComponents";

export default function TabServicios({
  items,
  onChange,
  onSave
}: {
  items: ServiceItem[];
  onChange: (items: ServiceItem[]) => void;
  onSave: () => void;
}) {
  return (
    <Panel title="Editar servicios">
      <div className="grid gap-3">
        {items.map((service) => (
          <div
            key={service.id}
            className="grid gap-3 rounded-lg border border-ocean-100 bg-white p-4 dark:border-white/10 dark:bg-white/5 md:grid-cols-[1fr_auto_auto] md:items-center"
          >
            <input
              value={service.title}
              onChange={(e) =>
                onChange(
                  items.map((item) =>
                    item.id === service.id ? { ...item, title: e.target.value } : item
                  )
                )
              }
              className="focus-ring rounded-md border border-slate-200 px-4 py-3 dark:border-white/10 dark:bg-white/10 dark:text-white"
            />
            <label className="flex items-center gap-2 text-sm font-bold text-clinic-ink dark:text-white">
              <input
                type="checkbox"
                checked={service.active}
                onChange={(e) =>
                  onChange(
                    items.map((item) =>
                      item.id === service.id ? { ...item, active: e.target.checked } : item
                    )
                  )
                }
              />
              Visible
            </label>
            <button
              onClick={() => onChange(items.filter((item) => item.id !== service.id))}
              className="focus-ring rounded-full bg-rose-500 p-3 text-white"
              aria-label="Eliminar servicio"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() =>
              onChange([
                ...items,
                { id: crypto.randomUUID(), title: "Nuevo servicio", active: true, sortOrder: items.length }
              ])
            }
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-ocean-200 px-5 py-3 font-bold text-ocean-900 dark:border-white/10 dark:text-ocean-50"
          >
            <Plus className="h-4 w-4" />
            Agregar servicio
          </button>
          <button
            onClick={onSave}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-ocean-500 px-5 py-3 font-bold text-white transition hover:bg-ocean-600"
          >
            <Save className="h-4 w-4" />
            Guardar servicios
          </button>
        </div>
      </div>
    </Panel>
  );
}
