"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "@/components/Icons/Icons";

const items = [
  {
    href: "/",
    icon: Icons.home,
    label: "Home",
  },
  {
    id: "/value-framework",
    href: "/value-framework",
    icon: Icons.framework,
    label: "Value Framework",
  },
  // {
  //   href: "/ichom",
  //   icon: Icons.ichom,
  //   label: "ICHOM Sets",
  // },

  {
    id: "/org",
    icon: Icons.org,
    label: "Organizations",
    href: "/organizations",
  },
  {
    href: "/contracts",
    id: "contracts",
    icon: Icons.contract,
    label: "Contracts",
  },
  {
    href: "/contract-setup",
    id: "setup",
    icon: Icons.setup,
    label: "Contract Setup",
  },
  {
    href: "/contract-finance",
    id: "finance",
    icon: Icons.finance,
    label: "Finance & Attribution",
  },
  // {
  //   href: "/transformation",
  //   id: "txfm",
  //   icon: Icons.txfm,
  //   label: "Transformation",
  // },
  {
    id: "/perf",
    icon: Icons.perf,
    label: "Performance",
    disabled: true,
    href: "performance",
  },
  {
    href: "/portfolio",
    id: "portfolio",
    icon: Icons.portfolio,
    label: "Portfolio",
    disabled: true,
  },
  {
    href: "/payment",
    id: "payment",
    icon: Icons.payment,
    label: "Payments",
    disabled: true,
  },
  {
    href: "/alert",
    id: "alert",
    icon: Icons.alert,
    label: "Alerts",
    disabled: true,
  },
  {
    href: "/ai",
    id: "ai",
    icon: Icons.ai,
    label: "AiQL Reasoning",
    disabled: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="sb">
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              "sb-item" +
              (isActive ? " active" : "") +
              (item.disabled ? " disabled" : "")
            }
          >
            {item.icon}
          </Link>
        );
      })}
      <div className="sb-divider" />
      <Link
        href="/settings"
        className={"sb-item" + (pathname === "/settings" ? " active" : "")}
      >
        {Icons.gear}
      </Link>
    </nav>
  );
}
