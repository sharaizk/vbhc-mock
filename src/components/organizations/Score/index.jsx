import { scoreClass } from "@/utils/helpers";

export default function Score({ n, lg }) {
  return (
    <div className={`or-score ${lg ? "lg" : ""} ${scoreClass(n)}`}>{n}</div>
  );
}
