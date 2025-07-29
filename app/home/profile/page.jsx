"use client";
import React, { useState } from "react";
import { Avatar, Modal, Switch, Button, Typography, message } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  LockOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  CalendarOutlined,
  BulbOutlined,
  LogoutOutlined,
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  MoonFilled,
} from "@ant-design/icons";
import { useAuth } from "@/app/contexts/AuthProvider";

const { Title } = Typography;

const userName = "John Doe";

const Profile = () => {
  const [theme, setTheme] = useState("light");
  const [modal, setModal] = useState("");

  const { logout } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    message.success(`Switched to ${theme === "light" ? "dark" : "light"} mode`);
  };

  const openModal = (key) => setModal(key);
  const closeModal = () => setModal("");

  const profileItems = [
    {
      key: "personal",
      icon: <UserOutlined />,
      label: "Personal Info",
    },
    {
      key: "family",
      icon: <TeamOutlined />,
      label: "Family & Friends",
    },
    {
      key: "privacy",
      icon: <LockOutlined />,
      label: "Privacy",
    },
    {
      key: "places",
      icon: <EnvironmentOutlined />,
      label: "Saved Places",
    },
    {
      key: "language",
      icon: <GlobalOutlined />,
      label: "Language",
    },
    {
      key: "calendars",
      icon: <CalendarOutlined />,
      label: "Calendars",
    },
    {
      key: "theme",
      icon: <MoonFilled />,
      label: "Dark Mode",
      render: <Switch checked={theme === "dark"} onChange={toggleTheme} />,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete Account",
    },
  ];

  return (
    <div className="w-full p-6">
      {/* <div className="flex flex-col items-center mb-6">
        <Avatar size={80} icon={<UserOutlined />} />
        <h2 className="text-xl font-semibold mt-3">{userName}</h2>
      </div> */}

      {/* <div className="bg-gradient-to-br from-[#191970] to bg-[#f1a61a] p-4 rounded-xl shadow-sm text-white flex items-center w-full mb-8">
        <span className="flex-3">Get Yourself Premium now</span>
        <span className="flex-1 flex text-3xl font-bold items-center justify-center">
          £2.99
        </span>
      </div> */}

      <div className="flex flex-col gap-4">
        {profileItems.map(({ key, icon, label, render }) => (
          <div
            key={key}
            className={`flex items-center justify-between mb-4 ${
              key !== "theme" ? "cursor-pointer" : ""
            }`}
            onClick={() => {
              if (key !== "theme") openModal(key);
            }}
          >
            <div className="flex items-center gap-3 text-base">
              <div className="bg-white p-2 flex items-center justify-center invert rounded-full text-xl">
                {icon}
              </div>
              <span>{label}</span>
            </div>
            {render}
          </div>
        ))}
      </div>

      {/* Modals */}

      <Modal
        open={modal === "personal"}
        onCancel={closeModal}
        title="Personal Info"
        footer={null}
      >
        <p className="mb-2 flex items-center gap-2">
          <MailOutlined /> Email: johndoe@example.com
        </p>
        <p className="mb-2 flex items-center gap-2">
          <PhoneOutlined /> Phone: +234 801 234 5678
        </p>
        <p className="mb-2 flex items-center gap-2">
          <UserOutlined /> Profile image: (default avatar)
        </p>
      </Modal>

      <Modal
        open={modal === "family"}
        onCancel={closeModal}
        title="Family Profile"
        footer={null}
      >
        <ul className="list-disc list-inside space-y-1">
          <li>Mom - Janet Doe</li>
          <li>Dad - James Doe</li>
          <li>Brother - Peter Doe</li>
        </ul>
      </Modal>

      <Modal
        open={modal === "privacy"}
        onCancel={closeModal}
        title="Privacy Settings"
        footer={null}
      >
        <Button type="primary">Download a copy of your data</Button>
      </Modal>

      <Modal
        open={modal === "places"}
        onCancel={closeModal}
        title="Saved Places"
        footer={null}
      >
        <ul className="list-disc list-inside space-y-1">
          <li>Home - Lagos</li>
          <li>Work - Ikeja</li>
        </ul>
      </Modal>

      <Modal
        open={modal === "language"}
        onCancel={closeModal}
        title="Select Language"
        footer={null}
      >
        <ul className="space-y-2">
          <li>English (Selected)</li>
          <li>Yoruba</li>
          <li>Hausa</li>
          <li>French</li>
        </ul>
      </Modal>

      <Modal
        open={modal === "calendars"}
        onCancel={closeModal}
        title="Connected Calendars"
        footer={<Button type="primary">Connect New Calendar</Button>}
      >
        <ul className="space-y-1">
          <li>Google Calendar - Connected</li>
        </ul>
      </Modal>

      <Modal
        open={modal === "logout"}
        onCancel={closeModal}
        title="Log Out"
        onOk={() => logout()}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Are you sure you want to log out?</p>
      </Modal>

      <Modal
        open={modal === "delete"}
        onCancel={closeModal}
        title="Delete Account"
        onOk={() => message.warning("Account deleted")}
        okText="Yes, Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <p>This action cannot be undone. Are you sure?</p>
      </Modal>
    </div>
  );
};

export default Profile;
