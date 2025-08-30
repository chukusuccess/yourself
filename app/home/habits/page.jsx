"use client";
import React, { useEffect, useState } from "react";
import { Segmented, List, message, Empty } from "antd";
import { motion } from "framer-motion";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthProvider";
import { HabitService } from "@/app/services/habit.service";
import { StreakService } from "@/app/services/streak.service";
import { HabitCard } from "@/app/components/HabitCard";
import { VerificationService } from "@/app/services/verification.service";

const HabitsAndAddictions = () => {
  const [activeTab, setActiveTab] = useState("Habits");
  const [habits, setHabits] = useState([]);
  const [addictions, setAddictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const router = useRouter();

  const { currentUser } = useAuth();
  const userId = currentUser?.id;

  // make fetchData available to handlers
  const fetchData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await HabitService.listHabits(userId);
      setHabits(data.filter((item) => item.type === "habit"));
      setAddictions(data.filter((item) => item.type === "addiction"));
    } catch (err) {
      console.error("Failed to fetch data.", err);
      messageApi.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  // ✅ handle verify (self-verify) - wired to StreakService
  const handleVerify = async (habit) => {
    if (!currentUser?.id) {
      messageApi.error("You must be signed in to verify.");
      return;
    }

    const habitId = habit.$id || habit.id;
    setLoading(true);
    try {
      await StreakService.verifyHabit(habitId, currentUser.id);
      messageApi.success("Verified for today ✅");
      // refresh list so UI shows updated streak metadata
      await fetchData();
    } catch (err) {
      console.error("Error verifying habit:", err);
      messageApi.error("Failed to verify habit.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ handle witness-request flow
  const handleRequestVerification = async (habit) => {
    if (!currentUser?.id) {
      messageApi.error("You must be signed in to request verification.");
      return;
    }

    if (!habit.witnesses || habit.witnesses.length === 0) {
      messageApi.warning("No witnesses assigned to this habit.");
      return;
    }

    setLoading(true);
    try {
      // create a request per witness
      const res = await VerificationService.createRequests(
        habit.$id,
        currentUser.id,
        habit.witnesses
      );

      console.log(res);

      messageApi.success("Verification request(s) sent ✅");
    } catch (err) {
      console.error("Error creating request(s):", err);
      messageApi.error("Failed to send verification request.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await HabitService.deleteHabit(id);
      messageApi.success("Deleted successfully.");
      if (activeTab === "Habits") {
        setHabits((prev) => prev.filter((item) => item.$id !== id));
      } else {
        setAddictions((prev) => prev.filter((item) => item.$id !== id));
      }
    } catch (err) {
      messageApi.error("Failed to delete.");
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
        className="mb-10"
      >
        <br />
        {listData.length === 0 ? (
          <Empty description={`No ${activeTab.toLowerCase()} yet.`} />
        ) : (
          <List
            loading={loading}
            dataSource={listData}
            pagination={{
              pageSize: 8,
              showSizeChanger: false,
              align: "center",
            }}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <HabitCard
                  habit={item}
                  onDelete={handleDelete}
                  onVerify={() => handleVerify(item)}
                  onRequestVerification={() => handleRequestVerification(item)}
                />
              </List.Item>
            )}
          />
        )}
      </motion.div>
      <br />

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
