import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://consultoriodentalpaolamazza.uy"),
  title: {
    default: "Consultorio Dental Dra. Paola Mazza | Odontologia en Montevideo",
    template: "%s | Consultorio Dental Dra. Paola Mazza"
  },
  description:
    "Atencion odontologica profesional para ninos y adultos en Montevideo. Agenda por WhatsApp con la Dra. Paola Mazza.",
  keywords: [
    "odontologa Montevideo",
    "consultorio dental Montevideo",
    "Dra Paola Mazza",
    "limpieza dental",
    "blanqueamiento dental",
    "urgencias odontologicas"
  ],
  openGraph: {
    title: "Consultorio Dental Dra. Paola Mazza",
    description:
      "Odontologia integral, trato humano y reservas por WhatsApp en Montevideo.",
    type: "website",
    locale: "es_UY"
  },
  alternates: {
    canonical: "/"
  }
};

export const viewport: Viewport = {
  themeColor: "#19b9c9",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-UY">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
