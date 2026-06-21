"use client";

import { Save } from "lucide-react";
import { SiteSettings } from "@/lib/store";
import { AdminInput, AdminTextarea, Panel } from "./AdminComponents";

export default function TabContenido({
  settings,
  onChange,
  onSave
}: {
  settings: SiteSettings;
  onChange: (settings: SiteSettings) => void;
  onSave: () => void;
}) {
  function update(key: keyof SiteSettings, value: string) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <Panel title="Editar textos, contacto y horarios">
      <form
        onSubmit={(e) => { e.preventDefault(); onSave(); }}
        className="grid gap-4 lg:grid-cols-2"
      >
        <AdminInput label="Nombre del sitio" value={settings.siteName} onChange={(v) => update("siteName", v)} />
        <AdminInput label="Telefono visible" value={settings.phone} onChange={(v) => update("phone", v)} />
        <AdminInput label="WhatsApp con codigo pais" value={settings.whatsapp} onChange={(v) => update("whatsapp", v)} />
        <AdminInput label="Direccion" value={settings.address} onChange={(v) => update("address", v)} />
        <AdminInput label="Busqueda en Google Maps" value={settings.mapQuery} onChange={(v) => update("mapQuery", v)} />
        <AdminInput label="Horario lunes a viernes" value={settings.weekdayHours} onChange={(v) => update("weekdayHours", v)} />
        <AdminInput label="Horario fin de semana" value={settings.weekendHours} onChange={(v) => update("weekendHours", v)} />
        <AdminInput label="Titulo hero" value={settings.heroTitle} onChange={(v) => update("heroTitle", v)} />
        <AdminTextarea label="Subtitulo hero" value={settings.heroSubtitle} onChange={(v) => update("heroSubtitle", v)} />
        <AdminTextarea label="Texto sobre nosotros" value={settings.aboutText} onChange={(v) => update("aboutText", v)} />
        <AdminInput label="Titulo sobre nosotros" value={settings.aboutTitle} onChange={(v) => update("aboutTitle", v)} />
        <AdminInput label="Titulo servicios" value={settings.servicesTitle} onChange={(v) => update("servicesTitle", v)} />
        <AdminInput label="Titulo horarios" value={settings.hoursTitle} onChange={(v) => update("hoursTitle", v)} />
        <AdminInput label="Titulo galeria" value={settings.galleryTitle} onChange={(v) => update("galleryTitle", v)} />
        <AdminInput label="Titulo resenas" value={settings.reviewsTitle} onChange={(v) => update("reviewsTitle", v)} />
        <AdminInput label="Titulo ubicacion" value={settings.locationTitle} onChange={(v) => update("locationTitle", v)} />
        <AdminTextarea label="Texto ubicacion" value={settings.locationText} onChange={(v) => update("locationText", v)} />
        <AdminInput label="Titulo CTA final" value={settings.ctaTitle} onChange={(v) => update("ctaTitle", v)} />
        <AdminTextarea label="Texto CTA final" value={settings.ctaText} onChange={(v) => update("ctaText", v)} />
        <div className="lg:col-span-2">
          <button className="focus-ring inline-flex items-center gap-2 rounded-full bg-ocean-500 px-5 py-3 font-bold text-white transition hover:bg-ocean-600">
            <Save className="h-4 w-4" />
            Guardar contenido
          </button>
        </div>
      </form>
    </Panel>
  );
}
