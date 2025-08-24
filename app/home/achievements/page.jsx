"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, message } from "antd";
import { TrophyOutlined } from "@ant-design/icons";
import supabase from "@/app/supabase";
import { useAuth } from "@/app/contexts/AuthProvider";
import { LoadingScreen } from "@/app/components/LoadingScreen";

const { Search } = Input;

export default function Achievements() {
  const [searchTerm, setSearchTerm] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { currentUser } = useAuth();

  const router = useRouter();

  const filtered = achievements.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-6 pb-20 w-full">
      {contextHolder}
      <Search
        variant="filled"
        size="large"
        className="w-full bg-white rounded-md subtle-shadow"
        placeholder="Search achievements..."
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
        allowClear
      />
      <div className="bg-white rounded-lg flex flex-col p-6">
        <h2 className="font-semibold">
          <TrophyOutlined /> Achievements
        </h2>
        <div className="opacity-70 mt-5 text-xs">
          <div className="flex flex-col gap-3">
            <p className="space-y-1 border border-green-300 bg-green-50 rounded-lg p-4">
              <p>
                <b className="text-black">First habit</b>
              </p>
              <p>Created first habit</p>
            </p>
            <p className="space-y-1 border border-green-300 bg-green-50 rounded-lg p-4">
              <p>
                <b className="text-black">7-Day Streak</b>
              </p>
              <p>Maintained a 7-day streak</p>
            </p>
            <p className="space-y-1 border border-green-300 bg-green-50 rounded-lg p-4">
              <p>
                <b className="text-black">Reliable Witness</b>
              </p>
              <p>Verified 50+ habits for others</p>
            </p>
            <p className="space-y-1 border border-green-300 bg-green-50 rounded-lg p-4">
              <p>
                <b className="text-black">30-Day Warrior</b>
              </p>
              <p>Completed a 30-day habit</p>
            </p>
            <p className="space-y-1 border border-green-300 bg-green-50 rounded-lg p-4">
              <p>
                <b className="text-black">Habit Master</b>
              </p>
              <p>Maintain 5 active habits</p>
            </p>
            <p className="space-y-1 border bg-gray-50 rounded-lg p-4">
              <p>
                <b className="text-black">50-Day Legend</b>
              </p>
              <p>Reach 50-day streak</p>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
