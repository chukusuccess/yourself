"use client";
import React, { useEffect, useState } from "react";
import { Segmented, List, Button, message, Empty, Progress } from "antd";
import { motion } from "framer-motion";
import supabase from "@/app/supabase";
import {
  ClockCircleOutlined,
  DeleteFilled,
  EyeOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthProvider";

const HabitsAndAddictions = () => {
  const [activeTab, setActiveTab] = useState("Habits");
  const [habits, setHabits] = useState([]);
  const [addictions, setAddictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const router = useRouter();

  const { currentUser } = useAuth();
  const userId = currentUser?.id;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        messageApi.error("Failed to fetch data.");
        setLoading(false);
        return;
      }

      setHabits(data.filter((item) => item.type === "habit"));
      setAddictions(data.filter((item) => item.type === "addiction"));
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("habits_addictions")
      .delete()
      .eq("id", id);

    if (error) {
      messageApi.error("Failed to delete.");
      return;
    }

    messageApi.success("Deleted successfully.");
    if (activeTab === "Habits") {
      setHabits((prev) => prev.filter((item) => item.id !== id));
    } else {
      setAddictions((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const listData = activeTab === "Habits" ? habits : addictions;

  return (
    <div className="p-6 sm:w-1/3 w-full">
      {contextHolder}

      <div className=" text-center mb-10">
        <h2 className="text-2xl font-bold">Discipline Tracker</h2>
        <div>Build Habits, Break Addictions</div>
      </div>

      <Segmented
        size="large"
        block
        options={["Habits", "Addictions"]}
        key={[1, 2]}
        value={activeTab}
        onChange={setActiveTab}
        className="mb-4 border-2 border-[#e9e9e9]"
      />

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <br />
        {listData.length === 0 ? (
          <Empty description={`No ${activeTab.toLowerCase()} yet.`} />
        ) : (
          <List
            loading={loading}
            dataSource={listData}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <div className="w-full bg-white rounded-xl p-6">
                  <div className="w-full flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="font-semibold text-lg">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-blue-500 text-xs text-white px-3 py-[0.75]">
                          Building
                        </span>
                        •<span className="text-xs">2 witnesses</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-end">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">12</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">day streak</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full my-4">
                    <span className="text-xs opacity-50 w-full flex items-center justify-between">
                      <span>Progress to goal</span>{" "}
                      <span className="text-black font-bold">12/30 days</span>
                    </span>
                    <Progress
                      status="active"
                      percent={80}
                      strokeColor={"#000000"}
                    />
                  </div>
                  <div className="w-full">
                    <span className="flex items-center mb-2">
                      <UsergroupAddOutlined />
                      <span>Witnesses</span>
                    </span>
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-2 border border-[#c2c2c2] rounded-full px-2 text-xs">
                        <EyeOutlined />
                        Sarah M.
                      </span>
                      <span className="flex items-center gap-2 border border-[#c2c2c2] rounded-full px-2 text-xs">
                        <EyeOutlined />
                        Jack M.
                      </span>
                    </span>
                  </div>
                  <div className="w-full">
                    <span className="flex items-center gap-2 mb-2 opacity-50 mt-5">
                      <ClockCircleOutlined />
                      <span>Last Verified: Yesterday</span>
                    </span>
                    <span className="flex items-center justify-between">
                      <Button
                        className="text-xs"
                        type="primary"
                        htmlType="button"
                      >
                        Request Verification
                      </Button>
                      <Button
                        className="text-xs"
                        type="default"
                        htmlType="button"
                      >
                        Give up
                      </Button>
                      <Button
                        className="text-xs"
                        // onClick={() => handleDelete(item.id)}
                        type="primary"
                        htmlType="button"
                        danger
                      >
                        <DeleteFilled />
                      </Button>
                    </span>
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}
      </motion.div>

      <div className="w-full pr-8 flex item cneter justify-end mt-8 mb-10 fixed bottom-0 right-4 z-50">
        <div
          onClick={() => router.push("/home/create-habit")}
          className="relative flex flex-row items-center justify-center"
        >
          <PlusOutlined className="absolute animate-ping rounded-full bg-white p-4 text-xs" />
          <PlusOutlined className="z-10 absolute rounded-full bg-white p-4 text-xl shadow-lg" />
        </div>
      </div>
    </div>
  );
};

export default HabitsAndAddictions;
