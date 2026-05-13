"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "@/components/Icons/Icons";

const items = [
  {
    href: "/",
    icon: Icons.home,
    label: "Home",
    disabled: false,
  },
  {
    id: "/value-framework",
    href: "/value-framework",
    icon: Icons.framework,
    label: "Value Framework",
    disabled: false,
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
    disabled: false,
  },
  {
    href: "/contracts",
    id: "contracts",
    icon: Icons.contract,
    label: "Contracts",
    disabled: false,
  },
  {
    href: "/contract-setup",
    id: "setup",
    icon: Icons.setup,
    label: "Contract Setup",
    disabled: false,
  },
  {
    href: "/contract-finance",
    id: "finance",
    icon: Icons.finance,
    label: "Finance & Attribution",
    disabled: false,
  },
  {
    id: "/perf",
    icon: Icons.perf,
    label: "Performance",
    href: "/performance",
    disabled: false,
  },
  {
    href: "/portfolio",
    id: "portfolio",
    icon: Icons.portfolio,
    label: "Portfolio",
    disabled: false,
  },
  {
    href: "/payment",
    id: "payment",
    icon: Icons.payment,
    label: "Payments",
    disabled: false,
  },
  {
    href: "/alert",
    id: "alert",
    icon: Icons.alert,
    label: "Alerts",
    disabled: false,
  },
  {
    href: "/ai",
    id: "ai",
    icon: Icons.ai,
    label: "AiQL Reasoning",
    disabled: false,
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
            data-label={item.label}
          >
            {item.icon}
          </Link>
        );
      })}
      <div className="sb-divider" />
      <Link
        href="/settings"
        data-label={"Settings"}
        className={"sb-item" + (pathname === "/settings" ? " active" : "")}
      >
        {Icons.gear}
      </Link>
    </nav>
  );
}
