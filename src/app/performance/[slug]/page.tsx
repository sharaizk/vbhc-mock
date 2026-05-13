// app/performance/[slug]/page.tsx

"use client";

import dynamic from "next/dynamic";
import "@/css/performance.css";

const DimensionDeepDive = dynamic(
  () => import("@/components/performance/DimensionDeepDive"),
  {
    ssr: false,
  }
);

export default function PerformanceSlugPage() {
  return <DimensionDeepDive />;
}