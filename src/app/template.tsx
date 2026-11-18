"use client";

import { FlorLuvania } from "@/components/flor-luvania";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="page-bloom" aria-hidden="true">
        <FlorLuvania className="flor-loader" />
      </div>
      {children}
    </>
  );
}
