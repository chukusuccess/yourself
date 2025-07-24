"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarOutlined,
  EditOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const navItems = [
  {
    label: "Capsules",
    path: "/time-capsule",
    icon: <ClockCircleOutlined />,
  },
  {
    label: "Create",
    path: "/create-time-capsule",
    icon: <EditOutlined />,
  },
  {
    label: "Check-In",
    path: "/weekly-check-in",
    icon: <CalendarOutlined />,
  },
];

const MobileBottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-sm flex justify-around sm:hidden">
      {navItems.map(({ label, path, icon }) => {
        const isActive = pathname === path;
        return (
          <Link
            key={path}
            href={path}
            className={`flex flex-col items-center justify-center py-2 w-full text-xs ${
              isActive ? "text-blue-600 font-semibold" : "text-gray-500"
            }`}
          >
            <div className="text-xl">{icon}</div>
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
