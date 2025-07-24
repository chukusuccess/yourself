"use client";
import React from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";

dayjs.extend(duration);

const TimeCapsuleCard = ({ capsule }) => {
  const router = useRouter();
  const now = dayjs();
  const unlockDate = dayjs(capsule.unlockDate);
  const isUnlocked = now.isAfter(unlockDate);

  const handleClick = () => {
    if (isUnlocked) {
      router.push(`/view-time-capsule/${capsule.id}`);
    }
  };

  const timeLeft = dayjs.duration(unlockDate.diff(now));
  const countdown = isUnlocked
    ? "Unlocked"
    : `${timeLeft.days()}d ${timeLeft.hours()}h ${timeLeft.minutes()}m`;

  return (
    <div
      onClick={handleClick}
      className={`rounded-xl p-4 cursor-pointer transition-transform hover:scale-[1.0125] ${
        isUnlocked
          ? "bg-white hover:bg-blue-50"
          : "bg-white blur-[3px] pointer-events-none"
      }`}
    >
      <div className="flex justify-between items-center mb-1 z-50">
        <h3 className="text-base font-semibold text-gray-800 truncate">
          {capsule.title || "Untitled Message"}
        </h3>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded ${
            isUnlocked
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {isUnlocked ? "Open" : "Locked"}
        </span>
      </div>

      <p className="text-xs text-gray-400 mb-1 italic">
        From {capsule.from} to {capsule.to}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
        <span className="flex items-center gap-1">
          <CalendarOutlined />
          {unlockDate.format("MMM D, YYYY")}
        </span>

        <span className="flex items-center gap-1">
          <ClockCircleOutlined />
          {countdown}
        </span>
      </div>
    </div>
  );
};

export default TimeCapsuleCard;
