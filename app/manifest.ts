import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Consultorio Dental Dra. Paola Mazza",
    short_name: "Dental Paola Mazza",
    description: "Odontologia profesional para ninos y adultos en Montevideo.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fdff",
    theme_color: "#19b9c9",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
