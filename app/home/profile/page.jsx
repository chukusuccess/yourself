"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, Switch, Button, Typography, message } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  OpenAIOutlined,
  BuildOutlined,
  SettingOutlined,
  BellOutlined,
  WarningOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/app/contexts/AuthProvider";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const customFormat = (value) => {
  if (!value) return "";
  const day = value.date();
  const daySuffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";
  return `${day}${daySuffix} ${value.format("MMMM, YYYY")}`;
};

const { Title } = Typography;

const Profile = () => {
  const [theme, setTheme] = useState("light");
  const [modal, setModal] = useState("");

  const { currentUser, logout } = useAuth();

  const router = useRouter();

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    message.success(`Switched to ${theme === "light" ? "dark" : "light"} mode`);
  };

  const openModal = (key) => setModal(key);
  const closeModal = () => setModal("");

  return (
    <div className="w-full p-6">
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-lg flex flex-col p-6">
          <div className="w-full flex flex-col items-center justify-center mb-5 gap-5">
            <div className="w-full flex items-center gap-5">
              <div className="bg-gray-100 text-xl rounded-full w-14 h-14 flex items-center justify-center font-bold">
                {currentUser?.user_metadata?.full_name[0].toUpperCase()}
              </div>
              <div className="flex flex-col items-start justify-start">
                <span className="text-center font-semibold text-lg">
                  {currentUser?.user_metadata?.full_name}
                </span>
                <span className="text-center text-xs opacity-50">
                  {currentUser?.email}
                </span>
              </div>
            </div>
            <div className="w-full flex items-center justify-between gap-5">
              <div className="flex flex-col w-1/2 gap-1 items-center justify-center border rounded-md text-xs p-3 opacity-60">
                <span className="font-bold text-lg">8</span>
                <span>Total Habits</span>
              </div>
              <div className="flex flex-col w-1/2 gap-1 items-center justify-center border rounded-md text-xs p-3 opacity-60">
                <span className="font-bold text-lg">128</span>
                <span>Longest Streak</span>
              </div>
            </div>
            {/* <div className="w-full">
              <p className="text-xs opacity-50 my-2">
                <b className="text-black">Birth date</b>
              </p>
              <p className="bg-gray-100 rounded-sm p-2 w-full text-xs opacity-70">
                {dayjs(localStorage?.getItem("birthdate")).format(
                  "MMM DD, YYYY."
                ) || ""}
              </p>
            </div> */}
            <div className="opacity-50 text-xs w-full">
              <p className="space-y-1">
                <p>
                  <b className="text-black">Family & Friends</b>
                </p>
                <Button
                  onClick={() => router.push("/home/friends")}
                  block
                  icon={<TeamOutlined />}
                  type="default"
                >
                  <span className="text-xs">
                    Manage your family and friends
                  </span>
                </Button>
              </p>
              <br />
              <p className="space-y-1">
                <p>
                  <b className="text-black">Achievements</b>
                </p>
                <Button
                  onClick={() => router.push("/home/achievements")}
                  block
                  icon={<TrophyOutlined />}
                  type="default"
                >
                  <span className="text-xs">View your achievements</span>
                </Button>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg flex flex-col p-6">
          <h2 className="font-semibold">
            <OpenAIOutlined /> AI-Generated Biography
          </h2>
          <div className="opacity-50 mt-5 text-xs">
            Generate a personalized biography based on your habits, milestones,
            and journey.
            <br />
            <br />
            This operation might take a while to complete, so we'll notify you
            once your biography has been generated and downloaded
          </div>
          <br />
          <Button block icon={<FilePdfOutlined />} type="primary">
            Generate & Download Biography
          </Button>
        </div>
        <div className="bg-white rounded-lg flex flex-col p-6">
          <h2 className="font-semibold">
            <OpenAIOutlined /> Weekly AI Reviews
          </h2>
          <div className="opacity-50 mt-5 text-xs">
            <strong>This week&apos;s review</strong>
            <br />
            <br />
            "Your consistency with morning exercise has improved 23% this week.
            Consider adding a 5-minute meditation to enhance your routine's
            impact on stress levels."
          </div>
        </div>
        <div className="bg-white rounded-lg flex flex-col p-6">
          <h2 className="font-semibold">
            <BuildOutlined /> Habit Recommendations
          </h2>
          <div className="opacity-50 mt-5 text-xs">
            <div className="flex flex-col gap-3">
              <p className="space-y-1 border rounded-lg p-4">
                <p>
                  <b className="text-black">Evening Reading</b>
                </p>
                <p>
                  Based on your fitness habits, this could boost your energy
                  levels.
                </p>
              </p>
              <p className="space-y-1 border rounded-lg p-4">
                <p>
                  <b className="text-black">Call Family</b>
                </p>
                <p>
                  Complements your learning goals and improves sleep quality.
                </p>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg flex flex-col p-6">
          <h2 className="font-semibold">
            <SettingOutlined /> Preferences
          </h2>
          <div className="opacity-50 mt-5 text-xs">
            <div className="flex items-center justify-between">
              <p className="space-y-1">
                <p>
                  <b className="text-black">Dark Mode</b>
                </p>
                <p>Switch to dark theme.</p>
              </p>
              <Switch checked={theme === "dark"} onChange={toggleTheme} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg flex flex-col p-6">
          <h2 className="font-semibold">
            <BellOutlined /> Notifications
          </h2>
          <div className="opacity-50 mt-5 text-xs">
            <div className="flex items-center justify-between">
              <p className="space-y-1">
                <p>
                  <b className="text-black">Push Notifications</b>
                </p>
                <p>Receive all notifications theme.</p>
              </p>
              <Switch checked={theme === "dark"} onChange={toggleTheme} />
            </div>
            <br />
            <div className="flex items-center justify-between">
              <p className="space-y-1">
                <p>
                  <b className="text-black">Habit Reminders</b>
                </p>
                <p>Daily reminders for your habits.</p>
              </p>
              <Switch checked={theme === "dark"} onChange={toggleTheme} />
            </div>
            <br />
            <div className="flex items-center justify-between">
              <p className="space-y-1">
                <p>
                  <b className="text-black">Weekly Reports</b>
                </p>
                <p>AI-generated weekly progress reports.</p>
              </p>
              <Switch checked={theme === "dark"} onChange={toggleTheme} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg flex flex-col p-6">
          <h2 className="font-semibold text-red-500">
            <WarningOutlined /> Danger Zone
          </h2>
          <br />
          <Button
            onClick={() => openModal("logout")}
            danger
            block
            icon={<LogoutOutlined />}
            type="primary"
          >
            Logout
          </Button>
          <br />
          <Button
            onClick={() => openModal("delete")}
            danger
            block
            icon={<DeleteOutlined />}
            type="default"
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Modals */}

      <Modal
        open={modal === "logout"}
        onCancel={closeModal}
        title="Log Out"
        onOk={() => logout()}
        okText="Yes"
        cancelText="No"
        centered
      >
        <p>Are you sure you want to log out?</p>
      </Modal>

      <Modal
        open={modal === "delete"}
        onCancel={closeModal}
        title={<span className="text-red-500">Delete Account</span>}
        onOk={() => message.warning("Account deleted")}
        okText="Yes, Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        <p className="font-semibold">
          This action cannot be undone. Are you sure?
        </p>
        <p className="opacity-50 text-xs">
          Sarah, Bob, Dad and Sis will miss you 😟
        </p>
      </Modal>
    </div>
  );
};

export default Profile;
