import { Icons } from "@/components/Icons/Icons";
import Sparkline from "../PortfolioPulse/Sparkline";
import "./modules.css";
const MOD_ICON = {
  sys: Icons.ichom,
  con: Icons.contract,
  prv: Icons.perf,
  port: Icons.portfolio,
  pay: Icons.payment,
  rep: Icons.report,
  alr: Icons.alert,
  ai: Icons.ai,
};

function ModuleHero({ modules }) {
  const featured = modules.find((m) => m.primary);
  const rest = [...modules];

  // tiny sparkline preview for the featured tile
  const featuredHist = [76.5, 78.0, 79.2, 80.9, 72.4, 67.3, 76.1, 64.7];

  return (
    <section className="mh">
      <div className="mh-head">
        <div className="crumb">Modules · jump into any surface</div>
        <h2>Where would you like to work today?</h2>
      </div>

      <div className="mh-grid">
        <button className="mh-feat" style={{ "--mod-hue": featured.hue }}>
          <span className="mh-feat-tag">
            <span className="mh-feat-dot" />
            Primary action · this period
          </span>
          <span className="mh-feat-num">{featured.path}</span>
          <span className="mh-feat-ic">{MOD_ICON[featured.id]}</span>
          <h3 className="mh-feat-name">{featured.name}</h3>
          <p className="mh-feat-blurb">{featured.blurb}</p>

          <div className="mh-feat-stats">
            <div className="stat">
              <span className="num">5</span>
              <span className="lbl">Active</span>
            </div>
            <div className="stat">
              <span className="num">2</span>
              <span className="lbl">Draft</span>
            </div>
            <div className="stat">
              <span className="num">3</span>
              <span className="lbl">Pending settle</span>
            </div>
            <div className="stat">
              <span className="num">14d</span>
              <span className="lbl">Next close</span>
            </div>
          </div>

          <div className="mh-feat-preview">
            <span className="prev-lbl">Composite · last 8 periods</span>
            <Sparkline
              data={featuredHist}
              color="white"
              w={220}
              h={36}
              pad={3}
            />
          </div>

          <span className="mh-feat-cta">
            Open Contract Management {Icons.arrowR}
          </span>
        </button>

        {rest.map((m, index) => (
          <button
            key={m.id}
            className={"mh-tile kind-" + m.kind}
            style={{ "--mod-hue": m.hue }}
          >
            <span className="mh-tile-num">0{index + 1}</span>
            <span className="mh-tile-ic">{MOD_ICON[m.id]}</span>
            <span className="mh-tile-name">{m.name}</span>
            <span className="mh-tile-blurb">{m.blurb}</span>
            <span className="mh-tile-metric">{m.metric}</span>
            <span className="mh-tile-sub">{m.sub}</span>
            <span className="mh-tile-spine" />
          </button>
        ))}
      </div>
      {/* </div> */}
    </section>
  );
}

export default ModuleHero;
