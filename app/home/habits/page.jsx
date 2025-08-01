"use client";
import React, { useEffect, useState } from "react";
import { Segmented, List, Button, message, Empty } from "antd";
import { motion } from "framer-motion";
import supabase from "@/app/supabase";
import { PlusOutlined } from "@ant-design/icons";
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

      <Segmented
        block
        options={["Habits", "Addictions"]}
        key={[1, 2]}
        value={activeTab}
        onChange={setActiveTab}
        className="mb-4"
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
            bordered
            dataSource={listData}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="delete"
                    danger
                    type="text"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>,
                ]}
              >
                {item.title}
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
