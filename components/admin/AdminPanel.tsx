"use client";

import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  Eye,
  Image as ImageIcon,
  LogOut,
  MessageCircle,
  Moon,
  Pencil,
  Settings,
  Star,
  Sun
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Appointment,
  defaultSettings,
  deleteReview,
  GalleryItem,
  getAppointments,
  getGallery,
  getReviews,
  getServices,
  getSettings,
  getWhatsappRequests,
  Review,
  ServiceItem,
  SiteSettings,
  supabase,
  updateAppointments,
  updateGallery,
  updateReviews,
  updateServices,
  updateSettings,
  WhatsappRequest
} from "@/lib/store";
import { Metric } from "./AdminComponents";
import TabContenido from "./TabContenido";
import TabServicios from "./TabServicios";
import TabGaleria from "./TabGaleria";
import TabResenas from "./TabResenas";
import TabCitas from "./TabCitas";
import TabWhatsApp from "./TabWhatsApp";
import TabEstadisticas from "./TabEstadisticas";

const tabs = [
  { id: "contenido", label: "Contenido", icon: Pencil },
  { id: "servicios", label: "Servicios", icon: Settings },
  { id: "galeria", label: "Galeria", icon: ImageIcon },
  { id: "resenas", label: "Resenas", icon: Star },
  { id: "citas", label: "Citas", icon: CalendarDays },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "estadisticas", label: "Estadisticas", icon: BarChart3 }
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<TabId>("contenido");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [whatsappRequests, setWhatsappRequests] = useState<WhatsappRequest[]>([]);
  const [savedMessage, setSavedMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("paola-mazza-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(savedTheme ? savedTheme === "dark" : prefersDark);
    refreshData();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem("paola-mazza-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  async function refreshData() {
    const [nextReviews, nextAppointments, nextSettings, nextServices, nextGallery, nextWhatsapp] =
      await Promise.all([
        getReviews(),
        getAppointments(),
        getSettings(),
        getServices(),
        getGallery(),
        getWhatsappRequests()
      ]);
    setReviews(nextReviews);
    setAppointments(nextAppointments);
    setSettings(nextSettings);
    setServiceItems(nextServices);
    setGalleryItems(nextGallery);
    setWhatsappRequests(nextWhatsapp);
  }

  const stats = useMemo(() => {
    const approved = reviews.filter((r) => r.approved);
    const average =
      approved.length > 0
        ? approved.reduce((s, r) => s + r.rating, 0) / approved.length
        : 0;
    return {
      approved: approved.length,
      pending: reviews.length - approved.length,
      average,
      whatsapp: whatsappRequests.length,
      appointments: appointments.length
    };
  }, [reviews, whatsappRequests.length, appointments.length]);

  function notifySaved(text = "Cambios guardados") {
    setSavedMessage(text);
    window.setTimeout(() => setSavedMessage(""), 2600);
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut();
    window.localStorage.removeItem("paola-mazza-admin");
    onLogout();
  }

  return (
    <main className="min-h-screen bg-[#f7fdff] transition-colors dark:bg-[#07181f]">
      <header className="border-b border-ocean-100 bg-white dark:border-white/10 dark:bg-[#09222c]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <Link href="/" className="text-sm font-bold text-ocean-600 dark:text-ocean-300">
              Ver sitio publico
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-clinic-ink dark:text-white">
              Panel del consultorio
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-ocean-100">
              Base de datos: {supabase ? "Supabase conectado" : "modo local"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                  activeTab === id
                    ? "bg-ocean-500 text-white"
                    : "bg-ocean-50 text-ocean-900 dark:bg-white/10 dark:text-ocean-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
            <button
              onClick={() => setDarkMode((v) => !v)}
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-ocean-50 px-4 py-2 text-sm font-bold text-ocean-900 dark:bg-white/10 dark:text-ocean-50"
              title={darkMode ? "Modo claro" : "Modo oscuro"}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={logout}
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 dark:bg-white/10 dark:text-white"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {savedMessage && (
          <div className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            {savedMessage}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-5">
          <Metric label="Citas" value={stats.appointments} icon={CalendarDays} />
          <Metric label="WhatsApp" value={stats.whatsapp} icon={MessageCircle} />
          <Metric label="Resenas" value={stats.approved} icon={Star} />
          <Metric label="Pendientes" value={stats.pending} icon={Eye} />
          <Metric label="Promedio" value={stats.average.toFixed(1)} icon={BarChart3} />
        </div>

        {activeTab === "contenido" && (
          <TabContenido
            settings={settings}
            onChange={setSettings}
            onSave={async () => {
              await updateSettings(settings);
              notifySaved();
            }}
          />
        )}
        {activeTab === "servicios" && (
          <TabServicios
            items={serviceItems}
            onChange={setServiceItems}
            onSave={async () => {
              await updateServices(serviceItems);
              notifySaved("Servicios guardados");
            }}
          />
        )}
        {activeTab === "galeria" && (
          <TabGaleria
            items={galleryItems}
            onChange={setGalleryItems}
            onSave={async () => {
              await updateGallery(galleryItems);
              notifySaved("Galeria guardada");
            }}
          />
        )}
        {activeTab === "resenas" && (
          <TabResenas
            reviews={reviews}
            onApprove={async (id) => {
              const next = reviews.map((r) =>
                r.id === id ? { ...r, approved: true } : r
              );
              setReviews(next);
              await updateReviews(next);
              notifySaved("Resena aprobada");
            }}
            onDelete={async (id) => {
              setReviews((prev) => prev.filter((r) => r.id !== id));
              await deleteReview(id);
              notifySaved("Resena eliminada");
            }}
          />
        )}
        {activeTab === "citas" && (
          <TabCitas
            appointments={appointments}
            onChangeStatus={async (id, status) => {
              const next = appointments.map((a) =>
                a.id === id ? { ...a, status } : a
              );
              setAppointments(next);
              await updateAppointments(next);
              notifySaved("Cita actualizada");
            }}
          />
        )}
        {activeTab === "whatsapp" && (
          <TabWhatsApp requests={whatsappRequests} />
        )}
        {activeTab === "estadisticas" && (
          <TabEstadisticas stats={stats} />
        )}
      </section>
    </main>
  );
}
