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
