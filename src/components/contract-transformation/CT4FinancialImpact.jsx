import { FINANCIAL_IMPACT } from "@/mock/transformation";
import React from "react";

// Session 7 — CT4FinancialImpact.jsx — Step 4: Financial Impact Dashboard
const { useState: ct4UseState } = React;

const SAR = (n,opts={}) => {
  const abs=Math.abs(n||0);
  const s=abs>=1e9?(abs/1e9).toFixed(2)+"B":abs>=1e6?(abs/1e6).toFixed(0)+"M":abs.toLocaleString();
  return (n<0?"−":"")+(opts.plus&&n>0?"+":"")+"SAR "+s;
};

/* SVG bar chart */
function BarChart({ groups, height=220, yMax }) {
  const n       = groups.reduce((a,g)=>Math.max(a,g.bars.length),0);
  const W       = 560, PAD={t:12,r:16,b:56,l:72}, CW=W-PAD.l-PAD.r, CH=height-PAD.t-PAD.b;
  const allVals = groups.flatMap(g=>g.bars.map(b=>Math.abs(b.value)));
  const maxV    = yMax || (Math.max(...allVals)*1.08);
  const gW      = CW/groups.length;
  const bW      = Math.min(32, (gW-16)/groups[0].bars.length);
  const py      = v => PAD.t+CH-((v/maxV)*CH);
  const bh      = v => (v/maxV)*CH;
  const yTicks  = [0,0.25,0.5,0.75,1].map(f=>Math.round(maxV*f));

  return (
    <svg width={W} height={height} style={{overflow:"visible"}}>
      {yTicks.map((t,i)=>(
        <g key={i}>
          <line x1={PAD.l} y1={py(t)} x2={PAD.l+CW} y2={py(t)} stroke="var(--border-default)" strokeWidth=".5" strokeDasharray="4 3"/>
          <text x={PAD.l-6} y={py(t)} textAnchor="end" dominantBaseline="middle" fontSize="9" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)">{SAR(t)}</text>
        </g>
      ))}
      {groups.map((g,gi)=>{
        const gx = PAD.l + gi*gW + 8;
        return (
          <g key={gi}>
            {g.bars.map((b,bi)=>{
              const bx = gx + bi*(bW+4);
              const bH = Math.max(bh(b.value), 2);
              const by = py(b.value);
              return (
                <g key={bi}>
                  <rect x={bx} y={by} width={bW} height={bH} rx={4} fill={b.color} opacity={b.current?1:0.72}/>
                  {b.current && <rect x={bx-2} y={by-2} width={bW+4} height={bH+4} rx={5} fill="none" stroke={b.color} strokeWidth="1.5" opacity="0.4"/>}
                  <text x={bx+bW/2} y={by-5} textAnchor="middle" fontSize="8" fill={b.color} fontFamily="var(--font-mono)" fontWeight="600">{SAR(b.value)}</text>
                </g>
              );
            })}
            <text x={gx+(g.bars.length*(bW+4)-4)/2} y={PAD.t+CH+18} textAnchor="middle" fontSize="10" fill="var(--fg-secondary)" fontFamily="var(--font-sans)">{g.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* Quality trajectory line chart */
function QualityLine({ data, width=480, height=180 }) {
  const PAD={t:12,r:24,b:32,l:44};
  const W=width-PAD.l-PAD.r, H=height-PAD.t-PAD.b;
  const minY=40, maxY=90;
  const px=i=>PAD.l+(i/(data.length-1||1))*W;
  const py=v=>PAD.t+H-((v-minY)/(maxY-minY))*H;
  const pts=data.map((d,i)=>`${px(i)},${py(d.score)}`).join(" ");
  const scoreColor=v=>v>=75?"oklch(0.40 0.16 145)":v>=60?"oklch(0.78 0.14 145)":"oklch(0.55 0.14 60)";
  return (
    <svg width={width} height={height} style={{overflow:"visible"}}>
      {[60,70,80,90].map(v=>(
        <g key={v}>
          <line x1={PAD.l} y1={py(v)} x2={PAD.l+W} y2={py(v)} stroke="var(--border-default)" strokeWidth=".5" strokeDasharray={v===80?"6 3":"4 3"}/>
          <text x={PAD.l-4} y={py(v)} textAnchor="end" dominantBaseline="middle" fontSize="9" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)">{v}</text>
        </g>
      ))}
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="2.5"/>
      {data.map((d,i)=>(
        <g key={i}>
          <circle cx={px(i)} cy={py(d.score)} r={5} fill={scoreColor(d.score)} stroke="var(--bg-surface)" strokeWidth="2"/>
          <text x={px(i)} y={PAD.t+H+18} textAnchor="middle" fontSize="10" fill="var(--fg-secondary)" fontFamily="var(--font-sans)">{d.label}</text>
          <text x={px(i)} y={py(d.score)-14} textAnchor="middle" fontSize="10" fill={scoreColor(d.score)} fontFamily="var(--font-mono)" fontWeight="700">{d.score}</text>
        </g>
      ))}
    </svg>
  );
}

/* Break-even scatter/line */
function BreakEvenChart({ width=480, height=200 }) {
  const PAD={t:12,r:24,b:36,l:60};
  const W=width-PAD.l-PAD.r, H=height-PAD.t-PAD.b;
  // x = composite quality score (40-100), y = cost savings rate % (0-5)
  const px=v=>PAD.l+((v-40)/(100-40))*W;
  const py=v=>PAD.t+H-((v-0)/5)*H;
  // Break-even line: at quality=62, savings=1.2%
  const beQ=62, beS=1.2;
  // Provider earns more above this line
  const beLine = [[40,0.5],[55,0.9],[62,1.2],[75,1.8],[90,2.4],[100,3.0]];
  const blPts  = beLine.map(([q,s])=>`${px(q)},${py(s)}`).join(" ");

  return (
    <svg width={width} height={height} style={{overflow:"visible"}}>
      {/* Axes */}
      {[0,1,2,3,4,5].map(v=>(
        <g key={v}>
          <line x1={PAD.l} y1={py(v)} x2={PAD.l+W} y2={py(v)} stroke="var(--border-default)" strokeWidth=".5" strokeDasharray="4 3"/>
          <text x={PAD.l-4} y={py(v)} textAnchor="end" dominantBaseline="middle" fontSize="8" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)">{v}%</text>
        </g>
      ))}
      {[40,50,60,70,80,90,100].map(v=>(
        <text key={v} x={px(v)} y={PAD.t+H+16} textAnchor="middle" fontSize="8" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)">{v}</text>
      ))}
      {/* Zone fills */}
      <rect x={PAD.l} y={PAD.t} width={W} height={H} fill="oklch(0.96 0.04 25)" opacity="0.4"/>
      <clipPath id="above-be"><polygon points={`${px(40)},${py(beLine[0][1])} ${beLine.map(([q,s])=>`${px(q)},${py(s)}`).join(" ")} ${px(100)},${PAD.t+H} ${px(40)},${PAD.t+H}`}/></clipPath>
      <rect x={PAD.l} y={PAD.t} width={W} height={H} fill="oklch(0.95 0.05 145)" opacity="0.5" clipPath="url(#above-be)"/>
      {/* Break-even line */}
      <polyline points={blPts} fill="none" stroke="oklch(0.40 0.16 145)" strokeWidth="2" strokeDasharray="6 3"/>
      {/* Break-even point */}
      <circle cx={px(beQ)} cy={py(beS)} r={6} fill="oklch(0.40 0.16 145)" stroke="var(--bg-surface)" strokeWidth="2"/>
      <text x={px(beQ)+10} y={py(beS)-6} fontSize="9" fill="oklch(0.40 0.16 145)" fontFamily="var(--font-mono)" fontWeight="700">Break-even: Q={beQ}, {beS}% savings</text>
      {/* Current baseline */}
      <circle cx={px(74)} cy={py(2.8)} r={5} fill="var(--accent)" stroke="var(--bg-surface)" strokeWidth="2"/>
      <text x={px(74)+10} y={py(2.8)-4} fontSize="9" fill="var(--accent)" fontFamily="var(--font-mono)">Baseline projection</text>
      {/* Zone labels */}
      <text x={PAD.l+8} y={py(0.3)} fontSize="9" fill="oklch(0.50 0.18 25)" fontFamily="var(--font-sans)">Provider earns less (current contract better)</text>
      <text x={PAD.l+8} y={PAD.t+12} fontSize="9" fill="oklch(0.40 0.16 145)" fontFamily="var(--font-sans)">Provider earns more (transformation better)</text>
      {/* Axis labels */}
      <text x={PAD.l+W/2} y={PAD.t+H+32} textAnchor="middle" fontSize="9" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)">Composite quality score</text>
      <text transform={`translate(${PAD.l-48},${PAD.t+H/2}) rotate(-90)`} textAnchor="middle" fontSize="9" fill="var(--fg-tertiary)" fontFamily="var(--font-mono)">Cost savings rate (%)</text>
    </svg>
  );
}

function CT4FinancialImpact({ onComplete, selectedPath }) {
  const fi = FINANCIAL_IMPACT || {};
  const [showReport, setShowReport] = ct4UseState(false);
  const pathLabel = selectedPath?.label || "Moderate";

  return (
    <div className="ct4-page">
      <div className="ct4-page-head">
        <div>
          <div className="rs-crumb">Step 4 · Financial Impact</div>
          <h2 className="rs-title">Cost-Benefit Analysis — {pathLabel} Path</h2>
          <p style={{font:"400 13px/18px var(--font-sans)",color:"var(--fg-secondary)",marginTop:4,maxWidth:640}}>
            Financial impact of transforming the CNHI-PSMMC block contract from FFS to a performance-based model under the {pathLabel} path. Under baseline performance, both parties benefit — this is the incentive alignment message.
          </p>
        </div>
        <button className="cd-btn" onClick={()=>setShowReport(true)}>Generate business case report</button>
      </div>

      <div className="ct4-panels">
        {/* Panel 1: Purchaser cost */}
        <div className="ct4-panel">
          <div className="ct4-panel-head">
            <span className="ct4-ph-title">Panel 1 · Cost to Purchaser (CNHI)</span>
            <span className="ct4-ph-sub">Annual total cost · current vs transformed scenarios</span>
          </div>
          <BarChart
            yMax={190000000}
            groups={[
              { label:"Current contract", bars:[{value:fi.purchaserCost?.current||176000000,color:"oklch(0.55 0.02 270)",current:true}] },
              { label:"Optimistic", bars:[{value:fi.purchaserCost?.optimistic||168000000,color:"oklch(0.40 0.16 145)"}] },
              { label:"Baseline",   bars:[{value:fi.purchaserCost?.baseline||173000000,  color:"var(--accent)"}] },
              { label:"Pessimistic",bars:[{value:fi.purchaserCost?.pessimistic||179000000,color:"oklch(0.55 0.14 60)"}] },
            ]}/>
          <div className="ct4-insight ok">
            Net expected savings to CNHI: {SAR(fi.purchaserCost?.netSavingsRange?.min||3000000)} – {SAR(fi.purchaserCost?.netSavingsRange?.max||8000000)} annually
          </div>
        </div>

        {/* Panel 2: Provider revenue */}
        <div className="ct4-panel">
          <div className="ct4-panel-head">
            <span className="ct4-ph-title">Panel 2 · Revenue to Provider (PSMMC)</span>
            <span className="ct4-ph-sub">Annual revenue · current guaranteed vs performance-linked</span>
          </div>
          <BarChart
            yMax={190000000}
            groups={[
              { label:"Current contract", bars:[{value:fi.providerRevenue?.current||176000000,color:"oklch(0.55 0.02 270)",current:true}] },
              { label:"Optimistic", bars:[{value:fi.providerRevenue?.optimistic||183000000,color:"oklch(0.40 0.16 145)"}] },
              { label:"Baseline",   bars:[{value:fi.providerRevenue?.baseline||178000000,  color:"var(--accent)"}] },
              { label:"Pessimistic",bars:[{value:fi.providerRevenue?.pessimistic||172000000,color:"oklch(0.50 0.18 25)"}] },
            ]}/>
          <div className="ct4-insight ok">
            At baseline performance, PSMMC earns {SAR(2000000,{plus:true})} more than the current block contract — transformation is financially beneficial.
          </div>
        </div>

        {/* Panel 3: Quality trajectory */}
        <div className="ct4-panel">
          <div className="ct4-panel-head">
            <span className="ct4-ph-title">Panel 3 · Quality Improvement Projection</span>
            <span className="ct4-ph-sub">Composite quality score over 3 years under performance incentives</span>
          </div>
          <QualityLine data={fi.qualityTrajectory||[]} width={480} height={180}/>
          <div className="ct4-lit-ref">{fi.literatureRef}</div>
        </div>

        {/* Panel 4: Break-even */}
        <div className="ct4-panel">
          <div className="ct4-panel-head">
            <span className="ct4-ph-title">Panel 4 · Break-Even Analysis</span>
            <span className="ct4-ph-sub">At what score + savings level does transformation benefit the provider?</span>
          </div>
          <BreakEvenChart width={480} height={188}/>
          <div className="ct4-insight ok">
            Provider breaks even at composite score {fi.providerRevenue?.breakEvenScore||62} and {fi.providerRevenue?.breakEvenSavingsPct||1.2}% cost savings — both well below the baseline scenario projection.
          </div>
        </div>
      </div>

      <div className="rs-panel-foot" style={{padding:"16px 0"}}>
        <button className="cd-btn primary" onClick={()=>onComplete(4)}>
          Proceed to Side-by-Side Diff →
        </button>
      </div>

      {showReport && (
        <div className="co-modal-overlay" onClick={()=>setShowReport(false)}>
          <div className="co-modal" style={{width:620,maxWidth:"95vw",maxHeight:"80vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
            <div className="co-modal-head">Business Case Report — {pathLabel} Transformation</div>
            <div style={{display:"flex",flexDirection:"column",gap:14,font:"400 13px/18px var(--font-sans)",color:"var(--fg-secondary)"}}>
              <div><strong style={{color:"var(--fg-primary)"}}>Executive Summary</strong><br/>Transforming the CNHI-PSMMC SAR 176M block contract from FFS to shared savings under the {pathLabel} path is projected to generate SAR 3–8M annual savings for CNHI while increasing PSMMC's revenue by SAR 2M annually at baseline performance.</div>
              <div><strong style={{color:"var(--fg-primary)"}}>Current Contract Maturity: 9/100</strong><br/>The contract has no outcome measures, zero payment-performance linkage, no attribution methodology, and no reconciliation process.</div>
              <div><strong style={{color:"var(--fg-primary)"}}>Financial Impact Summary</strong>
                <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:4}}>
                  {[["Purchaser cost reduction (optimistic)","SAR 8M/yr"],["Provider revenue uplift (baseline)","SAR 2M/yr"],["Quality score improvement (Year 3)","55 → 79"],["Break-even quality score","62/100"],["Provider max upside","SAR 7.8M"],["Provider max downside (stop-loss)","SAR 3.2M"]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:".5px solid var(--border-default)"}}>
                      <span>{k}</span><span style={{fontFamily:"var(--font-mono)",fontWeight:600,color:"var(--fg-primary)"}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div><strong style={{color:"var(--fg-primary)"}}>Recommendation</strong><br/>{pathLabel} path — timeline {selectedPath?.timeline||"12–18 months"}. Provider infrastructure investment {selectedPath?.providerInvestment}.</div>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
              <button className="cd-btn" onClick={()=>setShowReport(false)}>Close</button>
              <button className="cd-btn primary" onClick={()=>window.print()}>Print / Save PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default CT4FinancialImpact;
