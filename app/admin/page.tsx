"use client";

import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  Check,
  Clock,
  Eye,
  Image as ImageIcon,
  MessageCircle,
  Pencil,
  Settings,
  Star,
  Trash2
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { gallery, services } from "@/lib/site-data";
import {
  Appointment,
  defaultSettings,
  getAppointments,
  getReviews,
  getSettings,
  getWhatsappRequests,
  Review,
  SiteSettings,
  updateAppointments,
  updateReviews,
  updateSettings
} from "@/lib/store";

const tabs = [
  { id: "citas", label: "Citas", icon: CalendarDays },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "resenas", label: "Resenas", icon: Star },
  { id: "contenido", label: "Contenido", icon: Pencil },
  { id: "estadisticas", label: "Estadisticas", icon: BarChart3 }
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("citas");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [whatsappRequests, setWhatsappRequests] = useState<
    { id: string; label: string; createdAt: string }[]
  >([]);

  useEffect(() => {
    setUnlocked(window.localStorage.getItem("paola-mazza-admin") === "true");
    getReviews().then(setReviews);
    setAppointments(getAppointments());
    setSettings(getSettings());
    setWhatsappRequests(getWhatsappRequests());
  }, []);

  const stats = useMemo(() => {
    const approved = reviews.filter((review) => review.approved);
    const average =
      approved.length > 0
        ? approved.reduce((sum, review) => sum + review.rating, 0) /
          approved.length
        : 0;
    return {
      approved: approved.length,
      pending: reviews.length - approved.length,
      average,
      whatsapp: whatsappRequests.length,
      appointments: appointments.length
    };
  }, [appointments.length, reviews, whatsappRequests.length]);

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.trim().toLowerCase() === "admin") {
      window.localStorage.setItem("paola-mazza-admin", "true");
      setUnlocked(true);
      setLoginError("");
      return;
    }
    setLoginError("Codigo incorrecto. Usa admin para esta demo.");
  }

  function approveReview(id: string) {
    const next = reviews.map((review) =>
      review.id === id ? { ...review, approved: true } : review
    );
    setReviews(next);
    updateReviews(next);
  }

  function deleteReview(id: string) {
    const next = reviews.filter((review) => review.id !== id);
    setReviews(next);
    updateReviews(next);
  }

  function changeAppointmentStatus(id: string, status: Appointment["status"]) {
    const next = appointments.map((appointment) =>
      appointment.id === id ? { ...appointment, status } : appointment
    );
    setAppointments(next);
    updateAppointments(next);
  }

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateSettings(settings);
  }

  if (!unlocked) {
    return (
      <main className="grid min-h-screen place-items-center bg-clinic-sky px-4">
        <form
          onSubmit={login}
          className="w-full max-w-md rounded-lg border border-ocean-100 bg-white p-8 shadow-soft"
        >
          <Link href="/" className="text-sm font-bold text-ocean-600">
            Volver al sitio
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-clinic-ink">
            Panel administrativo
          </h1>
          <p className="mt-3 text-slate-600">
            Ingresa el codigo de acceso para gestionar el contenido del sitio.
          </p>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Codigo de acceso"
            className="focus-ring mt-6 w-full rounded-md border border-slate-200 px-4 py-3"
          />
          {loginError && (
            <p className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
              {loginError}
            </p>
          )}
          <button className="focus-ring mt-4 w-full rounded-full bg-ocean-500 px-5 py-3 font-bold text-white shadow-glow">
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              window.localStorage.setItem("paola-mazza-admin", "true");
              setUnlocked(true);
            }}
            className="focus-ring mt-3 w-full rounded-full border border-ocean-200 px-5 py-3 font-bold text-ocean-900"
          >
            Entrar como admin demo
          </button>
          <p className="mt-3 text-xs text-slate-500">
            Codigo demo: admin. En produccion conviene reemplazarlo por auth de
            Supabase.
          </p>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7fdff]">
      <header className="border-b border-ocean-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <Link href="/" className="text-sm font-bold text-ocean-600">
              Ver sitio publico
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-clinic-ink">
              Panel Consultorio Dental
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                  activeTab === id
                    ? "bg-ocean-500 text-white"
                    : "bg-ocean-50 text-ocean-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-5">
          <Metric label="Citas" value={stats.appointments} icon={CalendarDays} />
          <Metric label="WhatsApp" value={stats.whatsapp} icon={MessageCircle} />
          <Metric label="Resenas" value={stats.approved} icon={Star} />
          <Metric label="Pendientes" value={stats.pending} icon={Eye} />
          <Metric label="Promedio" value={stats.average.toFixed(1)} icon={BarChart3} />
        </div>

        {activeTab === "citas" && (
          <Panel title="Gestionar citas">
            <div className="grid gap-3">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-lg border border-ocean-100 bg-white p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-clinic-ink">
                        {appointment.patientName}
                      </p>
                      <p className="text-sm text-slate-600">
                        {appointment.phone} · {appointment.reason}
                      </p>
                    </div>
                    <select
                      value={appointment.status}
                      onChange={(event) =>
                        changeAppointmentStatus(
                          appointment.id,
                          event.target.value as Appointment["status"]
                        )
                      }
                      className="focus-ring rounded-md border border-slate-200 px-3 py-2"
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
        )}

        {activeTab === "whatsapp" && (
          <Panel title="Solicitudes de WhatsApp">
            <div className="grid gap-3">
              {whatsappRequests.length === 0 && (
                <p className="text-slate-600">
                  Todavia no hay clicks registrados en los botones de WhatsApp.
                </p>
              )}
              {whatsappRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-lg border border-ocean-100 bg-white p-4"
                >
                  <p className="font-bold text-clinic-ink">{request.label}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(request.createdAt).toLocaleString("es-UY")}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {activeTab === "resenas" && (
          <Panel title="Aprobar o eliminar resenas">
            <div className="grid gap-3">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border border-ocean-100 bg-white p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-bold text-clinic-ink">
                        {review.name} · {review.rating}/5
                      </p>
                      <p className="mt-2 text-slate-600">{review.comment}</p>
                      <span
                        className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          review.approved
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {review.approved ? "Publicada" : "Pendiente"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {!review.approved && (
                        <button
                          onClick={() => approveReview(review.id)}
                          className="focus-ring rounded-full bg-emerald-500 p-3 text-white"
                          aria-label="Aprobar resena"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="focus-ring rounded-full bg-rose-500 p-3 text-white"
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
        )}

        {activeTab === "contenido" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Editar horarios y contacto">
              <form onSubmit={saveSettings} className="grid gap-4">
                <AdminInput
                  label="Horario lunes a viernes"
                  value={settings.weekdayHours}
                  onChange={(value) =>
                    setSettings((current) => ({
                      ...current,
                      weekdayHours: value
                    }))
                  }
                />
                <AdminInput
                  label="Horario fin de semana"
                  value={settings.weekendHours}
                  onChange={(value) =>
                    setSettings((current) => ({
                      ...current,
                      weekendHours: value
                    }))
                  }
                />
                <AdminInput
                  label="Telefono"
                  value={settings.phone}
                  onChange={(value) =>
                    setSettings((current) => ({ ...current, phone: value }))
                  }
                />
                <AdminInput
                  label="Direccion"
                  value={settings.address}
                  onChange={(value) =>
                    setSettings((current) => ({ ...current, address: value }))
                  }
                />
                <button className="focus-ring w-fit rounded-full bg-ocean-500 px-5 py-3 font-bold text-white">
                  Guardar cambios
                </button>
              </form>
            </Panel>
            <Panel title="Servicios e imagenes">
              <div className="grid gap-4">
                <div>
                  <p className="mb-3 flex items-center gap-2 font-bold text-clinic-ink">
                    <Settings className="h-4 w-4" />
                    Servicios publicados
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {services.map((service) => (
                      <span
                        key={service.title}
                        className="rounded-full bg-ocean-50 px-3 py-2 text-sm font-semibold text-ocean-900"
                      >
                        {service.title}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 flex items-center gap-2 font-bold text-clinic-ink">
                    <ImageIcon className="h-4 w-4" />
                    Galeria actual
                  </p>
                  <div className="grid gap-2">
                    {gallery.map((image) => (
                      <p
                        key={image.title}
                        className="rounded-md border border-ocean-100 bg-white px-3 py-2 text-sm text-slate-600"
                      >
                        {image.title}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        )}

        {activeTab === "estadisticas" && (
          <Panel title="Estadisticas de visitas y conversion">
            <div className="grid gap-4 md:grid-cols-3">
              <Insight
                title="Visitas estimadas"
                value="Local"
                text="Conecta Google Analytics o Supabase Edge Functions para medicion real."
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
        )}
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-ocean-100 bg-white p-4 shadow-sm">
      <Icon className="h-5 w-5 text-ocean-600" />
      <p className="mt-3 text-2xl font-bold text-clinic-ink">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

function Panel({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 rounded-lg border border-ocean-100 bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-2xl font-bold text-clinic-ink">{title}</h2>
      {children}
    </section>
  );
}

function AdminInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-clinic-ink">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring rounded-md border border-slate-200 px-4 py-3 font-normal text-slate-700"
      />
    </label>
  );
}

function Insight({
  title,
  value,
  text
}: {
  title: string;
  value: string | number;
  text: string;
}) {
  return (
    <div className="rounded-lg bg-clinic-sky p-5">
      <p className="text-sm font-bold text-ocean-700">{title}</p>
      <p className="mt-3 text-4xl font-bold text-clinic-ink">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
