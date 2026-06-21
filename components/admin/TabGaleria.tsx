"use client";

import { Plus, Save, Trash2 } from "lucide-react";
import { GalleryItem } from "@/lib/store";
import { Panel } from "./AdminComponents";

export default function TabGaleria({
  items,
  onChange,
  onSave
}: {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
  onSave: () => void;
}) {
  return (
    <Panel title="Editar galeria">
      <div className="grid gap-3">
        {items.map((image) => (
          <div
            key={image.id}
            className="grid gap-3 rounded-lg border border-ocean-100 bg-white p-4 dark:border-white/10 dark:bg-white/5 lg:grid-cols-[.7fr_1fr_auto_auto] lg:items-center"
          >
            <input
              value={image.title}
              onChange={(e) =>
                onChange(
                  items.map((item) =>
                    item.id === image.id ? { ...item, title: e.target.value } : item
                  )
                )
              }
              className="focus-ring rounded-md border border-slate-200 px-4 py-3 dark:border-white/10 dark:bg-white/10 dark:text-white"
            />
            <input
              value={image.src}
              onChange={(e) =>
                onChange(
                  items.map((item) =>
                    item.id === image.id ? { ...item, src: e.target.value } : item
                  )
                )
              }
              className="focus-ring rounded-md border border-slate-200 px-4 py-3 dark:border-white/10 dark:bg-white/10 dark:text-white"
            />
            <label className="flex items-center gap-2 text-sm font-bold text-clinic-ink dark:text-white">
              <input
                type="checkbox"
                checked={image.active}
                onChange={(e) =>
                  onChange(
                    items.map((item) =>
                      item.id === image.id ? { ...item, active: e.target.checked } : item
                    )
                  )
                }
              />
              Visible
            </label>
            <button
              onClick={() => onChange(items.filter((item) => item.id !== image.id))}
              className="focus-ring rounded-full bg-rose-500 p-3 text-white"
              aria-label="Eliminar imagen"
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
                {
                  id: crypto.randomUUID(),
                  title: "Nueva imagen",
                  src: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1400&q=85",
                  active: true,
                  sortOrder: items.length
                }
              ])
            }
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-ocean-200 px-5 py-3 font-bold text-ocean-900 dark:border-white/10 dark:text-ocean-50"
          >
            <Plus className="h-4 w-4" />
            Agregar imagen
          </button>
          <button
            onClick={onSave}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-ocean-500 px-5 py-3 font-bold text-white transition hover:bg-ocean-600"
          >
            <Save className="h-4 w-4" />
            Guardar galeria
          </button>
        </div>
      </div>
    </Panel>
  );
}
