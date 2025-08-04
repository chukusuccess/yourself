"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  FilePdfOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/app/contexts/AuthProvider";

const { Title } = Typography;

const Profile = () => {
  const [theme, setTheme] = useState("light");
  const [modal, setModal] = useState("");

  const { currentUser, logout } = useAuth();

  const router = useRouter();

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
      label: "Biography",
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
      <div className="flex flex-col gap-4">
        {profileItems.map(({ key, icon, label, render }) => (
          <div
            key={key}
            className={`flex items-center justify-between mb-4 ${
              key !== "theme" ? "cursor-pointer" : ""
            }`}
            onClick={() => {
              if (key !== "theme" && key !== "family") openModal(key);
              if (key === "family") router.push("/home/friends");
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
        title=""
        footer={null}
        centered
      >
        <div className="w-full flex flex-col items-center justify-center">
          <div className="bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center">
            <UserOutlined className="text-4xl" />
          </div>
          <br />
          <span className="w-full text-center">{currentUser?.email}</span>
        </div>
      </Modal>

      <Modal
        open={modal === "family"}
        onCancel={closeModal}
        title="Family Profile"
        footer={null}
        centered
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
        title="Biography"
        footer={null}
        centered
      >
        <div>Download a copy of your data</div>
        <br />
        <Button icon={<FilePdfOutlined />} type="primary">
          Download
        </Button>
      </Modal>

      <Modal
        open={modal === "places"}
        onCancel={closeModal}
        title="Saved Places"
        footer={null}
        centered
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
        centered
      >
        <ul className="space-y-2">
          <li>English (Default)</li>
        </ul>
      </Modal>

      <Modal
        open={modal === "calendars"}
        onCancel={closeModal}
        title="Connected Calendars"
        footer={<Button type="primary">Connect New Calendar</Button>}
        centered
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
        centered
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
        centered
      >
        <p>This action cannot be undone. Are you sure?</p>
      </Modal>
    </div>
  );
};

export default Profile;
