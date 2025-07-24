"use client";
import { RiseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useRouter } from "next/navigation";

const PremiumAdCard = () => {
  const router = useRouter();
  return (
    <div className="bg-gradient-to-br from-black to bg-[#ffd700] p-8 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-white flex gap-3 items-center">
        <RiseOutlined className="font-bold text-4xl" />
        Unlock Your Full Potential
      </h2>
      <div className="space-y-4 text-xs text-white font-normal">
        <div>
          Upgrade to Premium for advanced insights, detailed habit tracking, and
          personalized wisdom. See your life with even greater clarity.
        </div>
        <Button
          onClick={() => router.push("/offer")}
          size="large"
          className="rounded-full font-semibold w-full h-16"
        >
          Upgrade to Premium
        </Button>
      </div>
    </div>
  );
};

export default PremiumAdCard;
