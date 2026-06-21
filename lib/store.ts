"use client";

import { createClient } from "@supabase/supabase-js";
import { gallery, initialReviews, services } from "./site-data";

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
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  servicesTitle: string;
  servicesSubtitle: string;
  hoursTitle: string;
  galleryTitle: string;
  reviewsTitle: string;
  locationTitle: string;
  locationText: string;
  ctaTitle: string;
  ctaText: string;
  weekdayHours: string;
  weekendHours: string;
  phone: string;
  whatsapp: string;
  address: string;
  mapQuery: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  active: boolean;
  sortOrder: number;
};

export type GalleryItem = {
  id: string;
  title: string;
  src: string;
  active: boolean;
  sortOrder: number;
};

export type WhatsappRequest = {
  id: string;
  label: string;
  createdAt: string;
};

export const adminAccessCode =
  process.env.NEXT_PUBLIC_ADMIN_ACCESS_CODE || "Mazza-2026";

export const defaultSettings: SiteSettings = {
  siteName: "Consultorio Dental Dra. Paola Mazza",
  heroTitle: "Tu sonrisa en las mejores manos",
  heroSubtitle:
    "Atencion odontologica profesional para ninos y adultos en Montevideo. Calidad, experiencia y trato personalizado para cuidar tu salud bucal.",
  aboutTitle: "Atencion odontologica con experiencia y confianza",
  aboutText:
    "Brindamos atencion odontologica integral con un enfoque profesional y humano. Nuestro objetivo es ofrecer tratamientos de calidad en un ambiente comodo y seguro para pacientes de todas las edades.",
  servicesTitle: "Cuidado dental integral para cada etapa",
  servicesSubtitle: "Servicios",
  hoursTitle: "Atencion coordinada",
  galleryTitle: "Espacios pensados para tu comodidad",
  reviewsTitle: "Experiencias de pacientes",
  locationTitle: "C. Regidores 1284 bis",
  locationText:
    "Montevideo, Uruguay. Acceso claro para coordinar tu consulta y llegar sin vueltas.",
  ctaTitle: "Agenda tu consulta hoy mismo",
  ctaText: "Estamos listos para ayudarte a mantener una sonrisa sana y saludable.",
  weekdayHours: "09:00 - 19:00",
  weekendHours: "Cerrado",
  phone: "099 859 760",
  whatsapp: "59899859760",
  address: "C. Regidores 1284 bis, Montevideo",
  mapQuery: "C. Regidores 1284 bis, Montevideo, Uruguay"
};

const defaultServices: ServiceItem[] = services.map((service, index) => ({
  id: service.title.toLowerCase().replaceAll(" ", "-"),
  title: service.title,
  active: true,
  sortOrder: index
}));

const defaultGallery: GalleryItem[] = gallery.map((item, index) => ({
  id: item.title.toLowerCase().replaceAll(" ", "-"),
  title: item.title,
  src: item.src,
  active: true,
  sortOrder: index
}));

const keys = {
  reviews: "paola-mazza-reviews",
  appointments: "paola-mazza-appointments",
  whatsapp: "paola-mazza-whatsapp",
  settings: "paola-mazza-settings",
  services: "paola-mazza-services",
  gallery: "paola-mazza-gallery"
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

function sortByOrder<T extends { sortOrder: number }>(items: T[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function buildMapUrl(settings: SiteSettings) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    settings.mapQuery || settings.address
  )}`;
}

export function buildEmbedMapUrl(settings: SiteSettings) {
  return `https://www.google.com/maps?q=${encodeURIComponent(
    settings.mapQuery || settings.address
  )}&output=embed`;
}

export function buildWhatsappHref(settings: SiteSettings, message: string) {
  const cleanNumber = settings.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export async function getSettings() {
  if (supabase) {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("id", "main")
      .maybeSingle();
    if (data?.value) return { ...defaultSettings, ...data.value } as SiteSettings;
  }
  return readLocal<SiteSettings>(keys.settings, defaultSettings);
}

export async function updateSettings(settings: SiteSettings) {
  if (supabase) {
    await supabase.from("site_settings").upsert({
      id: "main",
      value: settings,
      updated_at: new Date().toISOString()
    });
  }
  writeLocal(keys.settings, settings);
}

export async function getServices() {
  if (supabase) {
    const { data } = await supabase
      .from("services")
      .select("id,title,active,sort_order")
      .order("sort_order", { ascending: true });
    if (data?.length) {
      return data.map((item) => ({
        id: item.id,
        title: item.title,
        active: item.active,
        sortOrder: item.sort_order
      })) as ServiceItem[];
    }
  }
  return sortByOrder(readLocal<ServiceItem[]>(keys.services, defaultServices));
}

export async function updateServices(items: ServiceItem[]) {
  const next = sortByOrder(items);
  if (supabase) {
    await supabase.from("services").upsert(
      next.map((item) => ({
        id: item.id,
        title: item.title,
        active: item.active,
        sort_order: item.sortOrder
      }))
    );
  }
  writeLocal(keys.services, next);
}

export async function getGallery() {
  if (supabase) {
    const { data } = await supabase
      .from("gallery_images")
      .select("id,title,src,active,sort_order")
      .order("sort_order", { ascending: true });
    if (data?.length) {
      return data.map((item) => ({
        id: item.id,
        title: item.title,
        src: item.src,
        active: item.active,
        sortOrder: item.sort_order
      })) as GalleryItem[];
    }
  }
  return sortByOrder(readLocal<GalleryItem[]>(keys.gallery, defaultGallery));
}

export async function updateGallery(items: GalleryItem[]) {
  const next = sortByOrder(items);
  if (supabase) {
    await supabase.from("gallery_images").upsert(
      next.map((item) => ({
        id: item.id,
        title: item.title,
        src: item.src,
        active: item.active,
        sort_order: item.sortOrder
      }))
    );
  }
  writeLocal(keys.gallery, next);
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
  }

  const reviews = readLocal<Review[]>(keys.reviews, initialReviews);
  writeLocal(keys.reviews, [payload, ...reviews]);
  return payload;
}

export async function updateReviews(reviews: Review[]) {
  if (supabase) {
    await supabase.from("reviews").upsert(
      reviews.map((review) => ({
        id: review.id,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        approved: review.approved,
        created_at: review.createdAt
      }))
    );
  }
  writeLocal(keys.reviews, reviews);
}

export async function deleteReview(id: string) {
  if (supabase) await supabase.from("reviews").delete().eq("id", id);
  const reviews = readLocal<Review[]>(keys.reviews, initialReviews).filter(
    (review) => review.id !== id
  );
  writeLocal(keys.reviews, reviews);
}

export async function getAppointments() {
  if (supabase) {
    const { data } = await supabase
      .from("appointments")
      .select("id,patient_name,phone,reason,status,created_at")
      .order("created_at", { ascending: false });
    if (data) {
      return data.map((item) => ({
        id: item.id,
        patientName: item.patient_name,
        phone: item.phone,
        reason: item.reason || "",
        status: item.status,
        createdAt: item.created_at
      })) as Appointment[];
    }
  }
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

export async function updateAppointments(appointments: Appointment[]) {
  if (supabase) {
    await supabase.from("appointments").upsert(
      appointments.map((appointment) => ({
        id: appointment.id,
        patient_name: appointment.patientName,
        phone: appointment.phone,
        reason: appointment.reason,
        status: appointment.status,
        created_at: appointment.createdAt
      }))
    );
  }
  writeLocal(keys.appointments, appointments);
}

export async function logWhatsappRequest(label: string) {
  const payload = {
    id: crypto.randomUUID(),
    label,
    createdAt: new Date().toISOString()
  };

  if (supabase) {
    await supabase.from("whatsapp_requests").insert({
      label: payload.label
    });
  }

  const requests = readLocal<WhatsappRequest[]>(keys.whatsapp, []);
  writeLocal(keys.whatsapp, [payload, ...requests]);
}

export async function getWhatsappRequests() {
  if (supabase) {
    const { data } = await supabase
      .from("whatsapp_requests")
      .select("id,label,created_at")
      .order("created_at", { ascending: false });
    if (data) {
      return data.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: item.created_at
      })) as WhatsappRequest[];
    }
  }
  return readLocal<WhatsappRequest[]>(keys.whatsapp, []);
}

export async function signOutAdmin() {
  if (supabase) await supabase.auth.signOut();
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("paola-mazza-admin");
  }
}
