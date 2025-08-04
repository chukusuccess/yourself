"use client";
import {
  CopyOutlined,
  DownloadOutlined,
  OpenAIOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useRouter } from "next/navigation";

const DailyAffirmation = () => {
  const router = useRouter();
  return (
    <div className="bg-gradient-to-br bg-white p-8 rounded-xl shadow-sm mb-8">
      <h2 className="text-2xl font-bold mb-4 flex gap-3 items-center">
        <OpenAIOutlined className="font-bold text-4xl" />
        Today&apos;s Affirmation
      </h2>
      <div className="space-y-4 text-xs font-normal text-center flex flex-col items-center justify-center">
        <div>
          &quot;I have the power to break free from patterns that no longer
          serve me.&quot;
        </div>

        <div className="flex items-center gap-5">
          <Button type="text" size="large" className="rounded-full">
            <CopyOutlined />
          </Button>
          <Button type="text" size="large" className="rounded-full">
            <SyncOutlined />
          </Button>
          <Button type="text" size="large" className="rounded-full">
            <DownloadOutlined />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DailyAffirmation;
