import { DIMS, MEASURES } from "@/mock/framework";
import { FAMILIES } from "@/mock/ichom";

export const tier = (n: number): string => {
  if (n == null) return "na";
  if (n < 60) return "crit";
  if (n < 70) return "warn";
  if (n < 80) return "ok";
  return "great";
};

export const fmtSAR = (n: number): string =>
  "SAR " +
  (n >= 1000000
    ? (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M"
    : (n / 1000).toFixed(0) + "K");

export function scoreClass(n: number) {
  if (n >= 75) return "s-good";
  if (n >= 65) return "s-mid";
  if (n >= 55) return "s-warn";
  return "s-low";
}
export function scoreColor(n: number) {
  if (n >= 75) return "oklch(0.55 0.16 145)";
  if (n >= 65) return "oklch(0.55 0.16 250)";
  if (n >= 55) return "oklch(0.60 0.16 60)";
  return "oklch(0.55 0.18 25)";
}
export function typePill(t: string) {
  if (t.startsWith("Tertiary")) return "tertiary";
  if (t.startsWith("Secondary")) return "referral";
  if (t.startsWith("Specialist")) return "specialist";
  return "general";
}
export function rolePill(r: string) {
  if (r === "Department Head") return "role-head";
  if (r === "Senior Consultant") return "role-senior";
  if (r === "Consultant") return "role-cons";
  if (r === "Specialist") return "role-spec";
  return "role-res";
}

export const measuresFor = (dimId: any) =>
  MEASURES.filter((m) => m.dim === dimId);
export const dimById = (id: any) => DIMS.find((d) => d.id === id);

export const driverIcon = (kind: string) => {
  switch (kind) {
    case "ICHOM":
      return "ICHOM-driven";
    case "Catalogue":
      return "Owns catalogue";
    case "Cross-cutting":
      return "Cross-cutting";
    case "Foundational":
      return "Foundational";
    default:
      return kind;
  }
};

export function polar(cx: any, cy: any, r: any, angleDeg: any) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
export function wedgePath(
  cx: any,
  cy: any,
  rIn: any,
  rOut: any,
  a1: any,
  a2: any,
) {
  const [x1, y1] = polar(cx, cy, rOut, a1);
  const [x2, y2] = polar(cx, cy, rOut, a2);
  const [x3, y3] = polar(cx, cy, rIn, a2);
  const [x4, y4] = polar(cx, cy, rIn, a1);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${rOut} ${rOut} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 ${large} 0 ${x4} ${y4} Z`;
}

export function familyOf(id: any) {
  return FAMILIES.find((f) => f.id === id) || FAMILIES[0];
}
export function statusLabel(s: string) {
  return s === "active"
    ? "In contract"
    : s === "available"
      ? "Ingested"
      : "Draft";
}
export function fmtBeneficiaries(n: number) {
  return n >= 1000
    ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k"
    : n.toString();
}

export function complianceColor(pct: number) {
  if (pct == null) return "var(--bg-muted)";
  if (pct >= 80) return "var(--perf-target)";
  if (pct >= 60) return "oklch(56% .13 75)";
  return "var(--perf-floor)";
}
export function complianceSoft(pct: number | null) {
  if (pct == null) return "var(--bg-muted)";
  if (pct >= 80) return "var(--perf-target-soft)";
  if (pct >= 60) return "var(--perf-below-soft)";
  return "var(--perf-floor-soft)";
}
export function gradeColor(g: any) {
  const m: any = {
    A: "var(--accent)",
    B: "var(--perf-target)",
    C: "oklch(56% .13 75)",
    E: "var(--fg-tertiary)",
  };
  return m[g] || "var(--fg-tertiary)";
}
export function gradeSoft(g: any) {
  const m: any = {
    A: "var(--accent-soft)",
    B: "var(--perf-target-soft)",
    C: "var(--perf-below-soft)",
    E: "var(--bg-elevated)",
  };
  return m[g] || "var(--bg-elevated)";
}
