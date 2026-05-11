"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { HOME_USER } from "@/mock/home";
import { ReactNode, useEffect, useState } from "react";

type AppProps = {
  children: ReactNode;
};

export default function App({ children }: AppProps) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="app-shell">
      <Header
        user={HOME_USER}
        theme={theme}
        onTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      />

      <Sidebar />

      <main className="app-main">{children}</main>
    </div>
  );
}
