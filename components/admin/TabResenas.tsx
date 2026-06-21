"use client";

import { Check, Trash2 } from "lucide-react";
import { Review } from "@/lib/store";
import { Panel } from "./AdminComponents";

export default function TabResenas({
  reviews,
  onApprove,
  onDelete
}: {
  reviews: Review[];
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Panel title="Aprobar o eliminar resenas">
      <div className="grid gap-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-lg border border-ocean-100 bg-white p-4 dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-bold text-clinic-ink dark:text-white">
                  {review.name} - {review.rating}/5
                </p>
                <p className="mt-2 text-slate-600 dark:text-ocean-50">{review.comment}</p>
                <span
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                    review.approved
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                  }`}
                >
                  {review.approved ? "Publicada" : "Pendiente"}
                </span>
              </div>
              <div className="flex gap-2">
                {!review.approved && (
                  <button
                    onClick={() => onApprove(review.id)}
                    className="focus-ring rounded-full bg-emerald-500 p-3 text-white transition hover:bg-emerald-600"
                    aria-label="Aprobar resena"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(review.id)}
                  className="focus-ring rounded-full bg-rose-500 p-3 text-white transition hover:bg-rose-600"
                  aria-label="Eliminar resena"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
