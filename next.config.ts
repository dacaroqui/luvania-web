import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      { source: "/pqr", destination: "/pqrs", permanent: true },
      { source: "/ofertas", destination: "/promociones", permanent: true },
      { source: "/tratamientos/porcenalizacion", destination: "/tratamientos/porcelanizacion", permanent: true },
      { source: "/tratamientos/x", destination: "/tratamientos", permanent: false },
      { source: "/restrepo", destination: "/sedes/restrepo", permanent: true },
      { source: "/modelia", destination: "/sedes/modelia", permanent: true },
      { source: "/chico", destination: "/sedes/chico", permanent: true },
      { source: "/colina", destination: "/sedes/colina", permanent: true },
      { source: "/venecia", destination: "/sedes/venecia", permanent: true },
    ];
  },
};

export default nextConfig;
