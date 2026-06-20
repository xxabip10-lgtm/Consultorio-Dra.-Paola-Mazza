"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  ExternalLink,
  MapPin,
  Menu,
  MessageCircle,
  Star,
  X
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  contact,
  embedMapUrl,
  gallery,
  mapUrl,
  services,
  whatsappMessages
} from "@/lib/site-data";
import {
  defaultSettings,
  getReviews,
  getSettings,
  logWhatsappRequest,
  Review,
  saveReview,
  SiteSettings
} from "@/lib/store";

const navItems = ["Servicios", "Horarios", "Galeria", "Resenas", "Ubicacion"];

function whatsappHref(message: string) {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

function useOpenStatus() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  return useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Montevideo",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
    const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
    const minute = Number(
      parts.find((part) => part.type === "minute")?.value ?? 0
    );
    const minutes = hour * 60 + minute;
    const isWeekday = !["Sat", "Sun"].includes(weekday);
    const open = isWeekday && minutes >= 540 && minutes < 1140;
    return {
      open,
      label: open ? "Abierto ahora" : "Cerrado ahora"
    };
  }, [now]);
}

function Stars({
  value,
  interactive = false,
  onChange
}: {
  value: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
}) {
  return (
    <div className="flex gap-1" aria-label={`${value} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} estrellas`}
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className="focus-ring rounded-full disabled:cursor-default"
        >
          <Star
            className={`h-5 w-5 ${
              star <= value
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-slate-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const status = useOpenStatus();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const approvedReviews = reviews.filter((review) => review.approved);
  const average =
    approvedReviews.length > 0
      ? approvedReviews.reduce((total, review) => total + review.rating, 0) /
        approvedReviews.length
      : 0;

  useEffect(() => {
    getReviews().then(setReviews);
    setSettings(getSettings());
  }, []);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    const next = await saveReview({
      name: name.trim(),
      rating,
      comment: comment.trim(),
      approved: false
    });
    setReviews((current) => [next, ...current]);
    setName("");
    setRating(5);
    setComment("");
  }

  return (
    <main className="overflow-hidden">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/60 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-ocean-500 text-lg font-bold text-white shadow-glow">
              PM
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold text-clinic-ink">
                Consultorio Dental
              </span>
              <span className="block text-xs text-slate-500">
                Dra. Paola Mazza
              </span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-ocean-600">
                {item}
              </a>
            ))}
            <Link href="/admin" className="hover:text-ocean-600">
              Admin
            </Link>
          </nav>
          <a
            href={whatsappHref(whatsappMessages.schedule)}
            onClick={() => logWhatsappRequest("Hero: agendar por WhatsApp")}
            className="focus-ring hidden items-center gap-2 rounded-full bg-ocean-500 px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-ocean-600 md:flex"
          >
            <MessageCircle className="h-4 w-4" />
            Agendar
          </a>
          <button
            className="focus-ring rounded-full p-2 lg:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Abrir menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-ocean-100 bg-white px-4 py-4 lg:hidden">
            <div className="mx-auto grid max-w-7xl gap-3 text-sm font-semibold text-slate-700">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-2 py-2 hover:bg-ocean-50"
                >
                  {item}
                </a>
              ))}
              <Link href="/admin" className="rounded-md px-2 py-2 hover:bg-ocean-50">
                Admin
              </Link>
            </div>
          </div>
        )}
      </header>

      <section className="relative min-h-[92vh] bg-clinic-sky pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(46,211,183,.18),transparent_26%),radial-gradient(circle_at_78%_6%,rgba(25,185,201,.18),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-ocean-200 bg-white px-4 py-2 text-sm font-semibold text-ocean-900 shadow-sm">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  status.open ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
              {status.label}
            </div>
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] text-clinic-ink sm:text-6xl lg:text-7xl">
              Tu sonrisa en las mejores manos
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Atencion odontologica profesional para ninos y adultos en
              Montevideo. Calidad, experiencia y trato personalizado para cuidar
              tu salud bucal.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappHref(whatsappMessages.schedule)}
                onClick={() => logWhatsappRequest("Hero: agendar por WhatsApp")}
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-ocean-500 px-6 py-4 font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-ocean-600"
              >
                <MessageCircle className="h-5 w-5" />
                Agendar por WhatsApp
              </a>
              <a
                href={mapUrl}
                target="_blank"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-ocean-200 bg-white px-6 py-4 font-bold text-clinic-ink shadow-sm transition hover:-translate-y-0.5 hover:border-ocean-400"
              >
                <MapPin className="h-5 w-5 text-ocean-600" />
                Como llegar
              </a>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-500">
              WhatsApp: {settings.phone}
            </p>
          </div>
          <div className="relative min-h-[480px] lg:min-h-[650px]">
            <div className="absolute inset-x-2 bottom-0 top-8 overflow-hidden rounded-[2rem] shadow-soft">
              <Image
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1500&q=88"
                alt="Consultorio odontologico moderno"
                fill
                unoptimized
                priority
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="glass-panel absolute bottom-8 left-0 max-w-xs rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-white">
                  <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-clinic-ink">
                    {average ? average.toFixed(1) : "5.0"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Pacientes recomiendan la atencion
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20" id="sobre">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-ocean-600">
              Sobre nosotros
            </p>
            <h2 className="mt-3 text-4xl font-bold text-clinic-ink">
              Atencion odontologica con experiencia y confianza
            </h2>
          </div>
          <p className="text-lg leading-8 text-slate-600">
            Brindamos atencion odontologica integral con un enfoque profesional y
            humano. Nuestro objetivo es ofrecer tratamientos de calidad en un
            ambiente comodo y seguro para pacientes de todas las edades.
          </p>
        </div>
      </section>

      <section className="bg-[#f2fbfe] py-20" id="servicios">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-ocean-600">
              Servicios
            </p>
            <h2 className="mt-3 text-4xl font-bold text-clinic-ink">
              Cuidado dental integral para cada etapa
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ title, icon: Icon }, index) => (
              <article
                key={title}
                className="group rounded-lg border border-ocean-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft"
                style={{ animationDelay: `${index * 65}ms` }}
              >
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-ocean-50 text-ocean-600 transition group-hover:bg-ocean-500 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-clinic-ink">
                  {title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20" id="horarios">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-1">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-ocean-600">
              Horarios
            </p>
            <h2 className="mt-3 text-4xl font-bold text-clinic-ink">
              Atencion coordinada
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            <div className="rounded-lg border border-ocean-100 bg-clinic-sky p-6">
              <Clock className="h-8 w-8 text-ocean-600" />
              <p className="mt-5 text-sm font-semibold text-slate-500">
                Lunes a Viernes
              </p>
              <p className="mt-2 text-3xl font-bold text-clinic-ink">
                {settings.weekdayHours}
              </p>
            </div>
            <div className="rounded-lg border border-ocean-100 bg-white p-6 shadow-sm">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${
                  status.open
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    status.open ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                {status.label}
              </span>
              <p className="mt-5 text-sm font-semibold text-slate-500">
                Sabados y Domingos
              </p>
              <p className="mt-2 text-3xl font-bold text-clinic-ink">
                {settings.weekendHours}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7fdff] py-20" id="galeria">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-ocean-600">
                Galeria
              </p>
              <h2 className="mt-3 text-4xl font-bold text-clinic-ink">
                Espacios pensados para tu comodidad
              </h2>
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {gallery.map((item, index) => (
              <button
                key={item.title}
                onClick={() => setLightbox(index)}
                className={`focus-ring group relative min-h-72 overflow-hidden rounded-lg ${
                  index === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  unoptimized
                  sizes="(min-width: 768px) 25vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-clinic-ink/75 to-transparent p-5 text-left font-bold text-white">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20" id="resenas">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-ocean-600">
              Resenas
            </p>
            <h2 className="mt-3 text-4xl font-bold text-clinic-ink">
              Experiencias de pacientes
            </h2>
            <div className="mt-8 rounded-lg bg-clinic-sky p-6">
              <p className="text-5xl font-bold text-clinic-ink">
                {average.toFixed(1)}
              </p>
              <Stars value={Math.round(average || 5)} />
              <p className="mt-3 text-sm font-semibold text-slate-600">
                {approvedReviews.length} resenas publicadas
              </p>
            </div>
            <form onSubmit={submitReview} className="mt-6 rounded-lg border border-ocean-100 p-5">
              <h3 className="text-lg font-bold text-clinic-ink">
                Agregar nueva resena
              </h3>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nombre"
                className="focus-ring mt-4 w-full rounded-md border border-slate-200 px-4 py-3"
              />
              <div className="mt-4">
                <Stars value={rating} interactive onChange={setRating} />
              </div>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Comentario"
                rows={4}
                className="focus-ring mt-4 w-full resize-none rounded-md border border-slate-200 px-4 py-3"
              />
              <button className="focus-ring mt-4 rounded-full bg-clinic-ink px-5 py-3 font-bold text-white transition hover:bg-ocean-900">
                Publicar resena
              </button>
              <p className="mt-3 text-xs text-slate-500">
                Las nuevas resenas quedan pendientes de aprobacion en el panel.
              </p>
            </form>
          </div>
          <div className="grid gap-4">
            {approvedReviews.slice(0, 6).map((review) => (
              <article
                key={review.id}
                className="rounded-lg border border-ocean-100 bg-white p-6 shadow-sm"
              >
                <Stars value={review.rating} />
                <p className="mt-4 text-lg leading-8 text-slate-700">
                  "{review.comment}"
                </p>
                <p className="mt-4 font-bold text-clinic-ink">{review.name}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f2fbfe] py-20" id="ubicacion">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.82fr_1.18fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-ocean-600">
              Ubicacion
            </p>
            <h2 className="mt-3 text-4xl font-bold text-clinic-ink">
              {settings.address}
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Montevideo, Uruguay. Acceso claro para coordinar tu consulta y
              llegar sin vueltas.
            </p>
            <a
              href={mapUrl}
              target="_blank"
              className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-ocean-500 px-6 py-4 font-bold text-white shadow-glow"
            >
              Abrir en Google Maps
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
          <div className="min-h-[420px] overflow-hidden rounded-lg border border-ocean-100 bg-white shadow-soft">
            <iframe
              title="Mapa del Consultorio Dental Dra. Paola Mazza"
              src={embedMapUrl}
              className="h-full min-h-[420px] w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="bg-clinic-ink px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <h2 className="text-4xl font-bold sm:text-5xl">
            Agenda tu consulta hoy mismo
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ocean-50">
            Estamos listos para ayudarte a mantener una sonrisa sana y
            saludable.
          </p>
          <a
            href={whatsappHref(whatsappMessages.reserve)}
            onClick={() => logWhatsappRequest("CTA final: reservar cita")}
            className="focus-ring mt-8 inline-flex items-center gap-3 rounded-full bg-white px-8 py-5 text-lg font-bold text-clinic-ink shadow-glow transition hover:-translate-y-0.5"
          >
            <MessageCircle className="h-6 w-6 text-ocean-600" />
            Reservar cita ahora
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      <footer className="bg-white px-4 py-10 text-sm text-slate-600 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 border-t border-ocean-100 pt-8 md:grid-cols-4">
          <p className="font-bold text-clinic-ink">{contact.name}</p>
          <p>Direccion: {settings.address}</p>
          <p>Telefono: {settings.phone}</p>
          <p>Horario: Lunes a Viernes {settings.weekdayHours}</p>
        </div>
      </footer>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-clinic-ink/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="focus-ring absolute right-5 top-5 rounded-full bg-white p-3 text-clinic-ink"
            aria-label="Cerrar galeria"
            onClick={() => setLightbox(null)}
          >
            <X />
          </button>
          <div className="relative h-[72vh] w-full max-w-5xl overflow-hidden rounded-lg">
            <Image
              src={gallery[lightbox].src}
              alt={gallery[lightbox].title}
              fill
              unoptimized
              sizes="90vw"
              className="object-cover"
            />
          </div>
        </div>
      )}
    </main>
  );
}
