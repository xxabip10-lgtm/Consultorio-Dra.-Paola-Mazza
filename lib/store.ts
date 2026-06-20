"use client";

import { createClient } from "@supabase/supabase-js";
import { initialReviews } from "./site-data";

export type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
};

export type Appointment = {
  id: string;
  patientName: string;
  phone: string;
  reason: string;
  status: "pendiente" | "confirmada" | "cerrada";
  createdAt: string;
};

export type SiteSettings = {
  weekdayHours: string;
  weekendHours: string;
  phone: string;
  address: string;
};

export const defaultSettings: SiteSettings = {
  weekdayHours: "09:00 - 19:00",
  weekendHours: "Cerrado",
  phone: "099 859 760",
  address: "C. Regidores 1284 bis, Montevideo"
};

const keys = {
  reviews: "paola-mazza-reviews",
  appointments: "paola-mazza-appointments",
  whatsapp: "paola-mazza-whatsapp",
  settings: "paola-mazza-settings"
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Keep the UI usable if the browser blocks or fills localStorage.
    }
  }
}

export async function getReviews() {
  if (supabase) {
    const { data } = await supabase
      .from("reviews")
      .select("id,name,rating,comment,approved,created_at")
      .order("created_at", { ascending: false });
    if (data) {
      return data.map((review) => ({
        id: review.id,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        approved: review.approved,
        createdAt: review.created_at
      })) as Review[];
    }
  }
  return readLocal<Review[]>(keys.reviews, initialReviews);
}

export async function saveReview(review: Omit<Review, "id" | "createdAt">) {
  const payload = {
    ...review,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };

  if (supabase) {
    await supabase.from("reviews").insert({
      name: payload.name,
      rating: payload.rating,
      comment: payload.comment,
      approved: payload.approved
    });
  } else {
    const reviews = readLocal<Review[]>(keys.reviews, initialReviews);
    writeLocal(keys.reviews, [payload, ...reviews]);
  }

  return payload;
}

export async function updateReviews(reviews: Review[]) {
  writeLocal(keys.reviews, reviews);
}

export function getAppointments() {
  return readLocal<Appointment[]>(keys.appointments, [
    {
      id: "demo-appointment",
      patientName: "Solicitud demo",
      phone: "099 859 760",
      reason: "Consulta general",
      status: "pendiente",
      createdAt: new Date().toISOString()
    }
  ]);
}

export function updateAppointments(appointments: Appointment[]) {
  writeLocal(keys.appointments, appointments);
}

export function logWhatsappRequest(label: string) {
  const requests = readLocal<{ id: string; label: string; createdAt: string }[]>(
    keys.whatsapp,
    []
  );
  writeLocal(keys.whatsapp, [
    { id: crypto.randomUUID(), label, createdAt: new Date().toISOString() },
    ...requests
  ]);
}

export function getWhatsappRequests() {
  return readLocal<{ id: string; label: string; createdAt: string }[]>(
    keys.whatsapp,
    []
  );
}

export function getSettings() {
  return readLocal<SiteSettings>(keys.settings, defaultSettings);
}

export function updateSettings(settings: SiteSettings) {
  writeLocal(keys.settings, settings);
}
