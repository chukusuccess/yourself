"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, message } from "antd";
import {
  CheckCircleOutlined,
  CloseSquareOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import supabase from "@/app/supabase";
import { useAuth } from "@/app/contexts/AuthProvider";
import { LoadingScreen } from "@/app/components/LoadingScreen";

const { Search } = Input;

export default function WitnessNetwork() {
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { currentUser } = useAuth();

  const router = useRouter();

  const filtered = requests.filter((item) =>
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
        placeholder="Search requests..."
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
        allowClear
      />
      <div className="flex flex-col">
        <h2 className="font-semibold">
          <CheckCircleOutlined /> Verification Requests
        </h2>
        <div className="opacity-70 mt-5 text-xs bg-white rounded-lg flex items-start gap-3 justify-start p-4">
          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-100 text-red-500">
            <InfoCircleOutlined />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <p className="space-y-1">
              <p>
                <b className="text-black">Sarah Miller</b>
              </p>
              <p>Requesting verification for Morning Exercise</p>
            </p>
            <div className="flex items-center gap-5">
              <Button type="primary" block icon={<CheckCircleOutlined />}>
                <span className="text-xs">Verify</span>
              </Button>
              <Button type="default" block icon={<CloseSquareOutlined />}>
                <span className="text-xs">Ignore</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="opacity-70 mt-5 text-xs bg-white rounded-lg flex items-start gap-3 justify-start p-4">
          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-100 text-red-500">
            <InfoCircleOutlined />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <p className="space-y-1">
              <p>
                <b className="text-black">John Davis</b>
              </p>
              <p>Requesting verification for Quit Smoking</p>
            </p>
            <div className="flex items-center gap-5">
              <Button type="primary" block icon={<CheckCircleOutlined />}>
                <span className="text-xs">Verify</span>
              </Button>
              <Button type="default" block icon={<CloseSquareOutlined />}>
                <span className="text-xs">Ignore</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
