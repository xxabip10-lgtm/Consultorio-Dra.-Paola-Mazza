import {
  Baby,
  CalendarCheck,
  ClipboardCheck,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  WandSparkles
} from "lucide-react";

export const contact = {
  name: "Consultorio Dental Dra. Paola Mazza",
  phone: "099 859 760",
  whatsapp: "59899859760",
  address: "C. Regidores 1284 bis, Montevideo, Uruguay",
  shortAddress: "C. Regidores 1284 bis, Montevideo",
  hours: {
    weekdays: "09:00 - 19:00",
    weekend: "Cerrado"
  }
};

export const whatsappMessages = {
  schedule:
    "Hola Dra. Paola Mazza, encontré su sitio web y me gustaría agendar una consulta odontológica.",
  reserve: "Hola Dra. Paola Mazza, quiero reservar una consulta odontológica."
};

export const mapUrl =
  "https://www.google.com/maps/search/?api=1&query=C.%20Regidores%201284%20bis%2C%20Montevideo%2C%20Uruguay";

export const embedMapUrl =
  "https://www.google.com/maps?q=C.%20Regidores%201284%20bis%2C%20Montevideo%2C%20Uruguay&output=embed";

export const services = [
  { title: "Odontologia General", icon: Stethoscope },
  { title: "Limpieza Dental", icon: Sparkles },
  { title: "Blanqueamiento Dental", icon: WandSparkles },
  { title: "Restauraciones", icon: HeartPulse },
  { title: "Tratamientos Preventivos", icon: ShieldCheck },
  { title: "Atencion para Ninos", icon: Baby },
  { title: "Urgencias Odontologicas", icon: CalendarCheck },
  { title: "Evaluaciones y Controles", icon: ClipboardCheck }
];

export const gallery = [
  {
    title: "Fachada del consultorio",
    src: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1400&q=85"
  },
  {
    title: "Consultorio interior",
    src: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1400&q=85"
  },
  {
    title: "Equipamiento odontologico",
    src: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1400&q=85"
  },
  {
    title: "Area de atencion",
    src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1400&q=85"
  }
];

export const initialReviews = [
  {
    id: "lucia",
    name: "Lucia",
    rating: 5,
    comment:
      "Muy recomendable. Excelente profesional, responsable y muy amable tanto con ninos como con adultos.",
    approved: true,
    createdAt: "2026-01-15T12:00:00.000Z"
  },
  {
    id: "alvaro-crespi",
    name: "Alvaro Crespi",
    rating: 5,
    comment: "Excelente odontologa.",
    approved: true,
    createdAt: "2026-02-08T12:00:00.000Z"
  }
];
