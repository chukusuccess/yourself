"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Drawer, Button, Divider } from "antd";

const AppNavbar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Milestones", path: "/milestones" },
    { label: "Time Capsules", path: "/time-capsule" },
    { label: "Weekly Check-In", path: "/weekly-check-in" },
    { label: "Subscribe", path: "/offer" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <header className="w-full fixed top-0 z-50 px-6 py-3 subtle-shadow bg-white flex items-center justify-between">
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

      <Drawer placement="right" onClose={toggleDrawer} open={open} title="">
        <ul className="flex flex-col decoration-0 list-none">
          {navLinks.map((link) => (
            <li className="decoration-0 list-none" key={link.path}>
              <Link
                style={{ color: "#1e2939" }}
                href={link.path}
                onClick={() => setOpen(false)}
                className="block"
              >
                {link.label}
              </Link>
              <Divider />
            </li>
          ))}
        </ul>
      </Drawer>
    </header>
  );
};

export default AppNavbar;
