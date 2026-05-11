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
    href: "/ichom",
    icon: Icons.ichom,
    label: "ICHOM Sets",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="sb">
      {items.map((item) => {
        const isActive =
          pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              "sb-item" +
              (isActive ? " active" : "")
            }
          >
            {item.icon}
          </Link>
        );
      })}
    </nav>
  );
}