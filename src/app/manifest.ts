import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pixel Art — Photo to Pixel Art Converter",
    short_name: "Pixel Art",
    description:
      "Convert your photos into pixel art instantly. All processing happens locally in your browser — no uploads, 100% private.",
    start_url: "/",
    display: "standalone",
    background_color: "#1a1a2e",
    theme_color: "#1a1a2e",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
