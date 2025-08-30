"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button, Input, message } from "antd";
import {
  CheckCircleOutlined,
  CloseSquareOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/app/contexts/AuthProvider";
import { LoadingScreen } from "@/app/components/LoadingScreen";
import { HabitService } from "@/app/services/habit.service";
import { VerificationService } from "@/app/services/verification.service";
import { StreakService } from "@/app/services/streak.service";

const { Search } = Input;

export default function WitnessNetwork() {
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUser?.id) return;
      setLoading(true);
      try {
        const res = await VerificationService.listRequests(currentUser.id);
        setRequests(res);
      } catch (err) {
        console.error(err);
        messageApi.error("Failed to fetch requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentUser?.id]);

  const handleRespond = async (requestId, status, habitId) => {
    try {
      const response = await VerificationService.respondRequest(
        requestId,
        status
      );
      setRequests((prev) => prev.filter((r) => r.$id !== requestId));

      if (response) {
        await StreakService.verifyHabit(habitId, currentUser?.id);

        messageApi.success(
          status === "verified" ? "Witnessed! ✅" : "Request ignored ❌"
        );
      }
    } catch (err) {
      console.error(err);
      messageApi.error("Failed to update request.");
    }
  };

  const filtered = requests.filter((item) =>
    item.requester_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingScreen />;

  return (
    <div className="p-6 pb-20 w-full">
      {contextHolder}
      <Search
        variant="filled"
        size="large"
        className="w-full bg-white rounded-md subtle-shadow"
        placeholder="Search requests..."
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
        allowClear
      />

      <div className="flex flex-col">
        <h2 className="font-semibold">
          <CheckCircleOutlined /> Verification Requests
        </h2>

        {filtered.length === 0 && (
          <p className="text-sm mt-6 opacity-60">No pending requests</p>
        )}

        {filtered.map((req) => (
          <div
            key={req.$id}
            className="mt-5 text-xs bg-white rounded-lg flex items-start gap-3 justify-start p-4"
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-100 text-red-500">
              <InfoCircleOutlined />
            </div>
            <div className="flex flex-col gap-3 w-full">
              <p>
                <b className="text-black">{req.requester_name}</b>
                <br />
                is requesting verification for{" "}
                <span className="font-semibold">{req.habit_title}</span>
              </p>
              <div className="flex items-center gap-5">
                <Button
                  type="primary"
                  block
                  icon={<CheckCircleOutlined />}
                  onClick={() =>
                    handleRespond(req.$id, "verified", req.habit_id)
                  }
                >
                  <span className="text-xs">Verify</span>
                </Button>
                <Button
                  type="default"
                  block
                  icon={<CloseSquareOutlined />}
                  onClick={() => handleRespond(req.$id, "ignored")}
                >
                  <span className="text-xs">Ignore</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
