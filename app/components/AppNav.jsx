"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Drawer, Button } from "antd";

const AppNavbar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Create Time Capsule", path: "/create-time-capsule" },
    { label: "Time Capsules", path: "/time-capsule" },
    { label: "Weekly Check-In", path: "/weekly-check-in" },
    { label: "Subscribe", path: "/offer" },
  ];

  return (
    <header className="w-full fixed top-0 z-50 px-6 py-3 shadow-sm bg-white flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-gray-800">
        Yourself.
      </Link>

      <div className="flex items-center gap-4">
        {/* <Link href="/offer">
          <Button type="primary" className="hidden sm:inline-block text-xs">
            Get Premium
          </Button>
        </Link> */}

        <Button
          type="primary"
          htmlType="button"
          icon={open ? <CloseOutlined /> : <MenuOutlined />}
          onClick={toggleDrawer}
          className="sm:hidden"
        />
      </div>

      <Drawer placement="right" onClose={toggleDrawer} open={open} title="Menu">
        <ul className="flex flex-col">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-gray-800 hover:bg-gray-100"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Drawer>
    </header>
  );
};

export default AppNavbar;
