import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    deviceSizes: [384, 640, 828, 1080, 1200, 1920],
    imageSizes: [256, 384],
  },
  async redirects() {
    return [
      { source: "/clinicas/luvania", destination: "/", permanent: true },
      { source: "/pqr", destination: "/pqrs", permanent: true },
      { source: "/ofertas", destination: "/promociones", permanent: true },
      { source: "/galerias", destination: "/sedes", permanent: true },
      { source: "/restrepo", destination: "/sedes/restrepo", permanent: true },
      { source: "/modelia", destination: "/sedes/modelia", permanent: true },
      { source: "/chico", destination: "/sedes/chico", permanent: true },
      { source: "/colina", destination: "/sedes/colina", permanent: true },
      { source: "/venecia", destination: "/sedes/venecia", permanent: true },
      { source: "/tratamientos/porcenalizacion", destination: "/tratamientos/porcelanizacion", permanent: true },
      { source: "/tratamientos/hidroxipatita-de-calcio", destination: "/tratamientos/hidroxiapatita-de-calcio", permanent: true },
      { source: "/tratamientos/perdida-de-cabello", destination: "/tratamientos/hair-loss", permanent: true },
      { source: "/tratamientos/:slug/articulos", destination: "/tratamientos/:slug", permanent: true },
      { source: "/tratamientos/:slug/experiencias", destination: "/tratamientos/:slug", permanent: true },
      { source: "/tratamientos/:slug/ofertas", destination: "/tratamientos/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
