import type { Metadata } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";

import "@/css/colors_and_type.css";
import "@/css/ichom.css";

import App from "@/app/App";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ValueOS",
  description: "ValueOS by AiQL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body>
        <App>{children}</App>
      </body>
    </html>
  );
}
