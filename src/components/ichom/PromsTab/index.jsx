import { PROMS } from "@/mock/ichom";

export default function PromsTab({ set }) {
  return (
    <>
      <div className="section-title">PROMs instruments</div>
      <div>
        {set.proms.map((code) => {
          const p = PROMS[code] || { full: code, scope: "—", items: "—" };
          return (
            <div key={code} className="prom-card">
              <span className="code">{code}</span>
              <div>
                <div className="full">{p.full}</div>
                <div className="scope">{p.scope}</div>
              </div>
              <span className="items">{p.items} items</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
