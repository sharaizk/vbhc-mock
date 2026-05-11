function Sparkline({
  data,
  color = "var(--fg-secondary)",
  w = 88,
  h = 26,
  pad = 2,
  area = true,
}) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data),
    max = Math.max(...data),
    span = max - min || 1;
  const xs = data.map((_, i) => pad + (i * (w - pad * 2)) / (data.length - 1));
  const ys = data.map((v) => h - pad - ((v - min) / span) * (h - pad * 2));
  const d = xs
    .map((x, i) => `${i ? "L" : "M"}${x.toFixed(1)} ${ys[i].toFixed(1)}`)
    .join(" ");
  const last = data[data.length - 1] >= data[0];
  const stroke =
    color === "auto"
      ? last
        ? "oklch(0.55 0.16 145)"
        : "oklch(0.55 0.18 25)"
      : color;
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
      {area && (
        <path
          d={`${d} L${xs[xs.length - 1]} ${h - pad} L${xs[0]} ${h - pad} Z`}
          fill={stroke}
          opacity=".12"
        />
      )}
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={xs[xs.length - 1]}
        cy={ys[ys.length - 1]}
        r="2.2"
        fill={stroke}
      />
    </svg>
  );
}

export default Sparkline;
