// // Session 12 — s12-app.jsx — Root app with screen switching
// const { useState: useS12AppState, useEffect: useS12AppEffect } = React;

// function App() {
//   const [theme, setTheme] = useS12AppState("light");
//   const [screen, setScreen] = useS12AppState("comparison"); // "comparison" | "tiering"
//   const [l3, setL3] = useS12AppState(null); // {type:"peergroup"|"stats"|"adequacy"|"benefit"}
//   const [toast, setToast] = useS12AppState({ msg: "", visible: false });

//   useS12AppEffect(() => {
//     document.documentElement.dataset.theme = theme;
//   }, [theme]);

//   useS12AppEffect(() => {
//     window.__toast = (msg) => {
//       setToast({ msg, visible: true });
//       setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
//     };
//   }, []);

//   return (
//     <div className="app-shell">
//       <AppHeader12
//         theme={theme}
//         onTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
//         screen={screen}
//         onScreen={setScreen}
//       />
//       <PerfSidebar active="perf" onChange={() => {}} />
//       <main className="app-main" style={{ paddingBottom: 40 }}>
//         {/* Breadcrumb */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//             marginBottom: 14,
//             font: "400 12px var(--font-sans)",
//             color: "var(--fg-tertiary)",
//           }}
//         >
//           <a
//             href="../session-8/index.html"
//             style={{ color: "var(--accent)", textDecoration: "none" }}
//           >
//             ← Dashboard
//           </a>
//           <span>›</span>
//           <span style={{ color: "var(--fg-secondary)" }}>
//             Provider Performance
//           </span>
//           <span>›</span>
//           <span style={{ color: "var(--fg-primary)", fontWeight: 500 }}>
//             {screen === "comparison"
//               ? "Comparison & Benchmarking"
//               : "Tiering & Network Intelligence"}
//           </span>
//         </div>

//         {screen === "comparison" && (
//           <ProviderComparison
//             onOpenPeerGroup={() => setL3({ type: "peergroup" })}
//             onOpenStats={() => setL3({ type: "stats" })}
//             onSwitchToTiering={() => setScreen("tiering")}
//           />
//         )}
//         {screen === "tiering" && (
//           <ProviderTiering
//             onOpenNetworkAdequacy={() => setL3({ type: "adequacy" })}
//             onOpenBenefitDesign={() => setL3({ type: "benefit" })}
//             onSwitchToComparison={() => setScreen("comparison")}
//           />
//         )}

//         {/* L3 overlays */}
//         <L3APeerGroup
//           open={l3?.type === "peergroup"}
//           onClose={() => setL3(null)}
//         />
//         <L3BStats open={l3?.type === "stats"} onClose={() => setL3(null)} />
//         <L3ANetworkAdequacy
//           open={l3?.type === "adequacy"}
//           onClose={() => setL3(null)}
//         />
//         <L3BBenefitDesign
//           open={l3?.type === "benefit"}
//           onClose={() => setL3(null)}
//         />

//         {/* Toast */}
//         <div className={"toast" + (toast.visible ? " show" : "")}>
//           {toast.msg}
//         </div>
//       </main>
//     </div>
//   );
// }
