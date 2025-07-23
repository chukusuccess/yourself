"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import TimeCapsuleCard from "../components/TimeCapsuleCard";
import { PlusOutlined } from "@ant-design/icons";

const dummyData = [
  {
    countdown: "View in 35 weeks",
    month: "Written: July 2025.",
    messageTitle: "First major move",
    messageText:
      "As I write this letter, I'm filled with curiousity about where life has taken us over the past year. Remember...",
  },
  {
    countdown: "View in 1 week",
    month: "Written: July 2025.",
    messageTitle: "Retirement",
    messageText: "Congrats on coming this far",
  },
  {
    countdown: "View in 110 weeks",
    month: "Written: July 2025.",
    messageTitle: "Children",
    messageText: "I know you still eat junk 😏",
  },
];

const TimeCapsule = () => {
  const router = useRouter();
  return (
    <div className="p-6 sm:w-1/3 w-full">
      <p className="w-full mb-4 px-8 text-center text-xs font-semibold">
        Messages from you to your future self
      </p>
      <div className="w-full pr-8 flex item cneter justify-end mt-8 mb-10">
        <div
          onClick={() => router.push("/create-time-capsule")}
          className="relative flex flex-row items-center justify-center"
        >
          <PlusOutlined className="absolute animate-ping rounded-full bg-white p-4 text-xs" />
          <PlusOutlined className="z-10 absolute rounded-full bg-white p-4 text-xl" />
        </div>
      </div>
      <div className="space-y-4 text-xs text-white font-normal flex flex-col relative overflow-y-auto noscroll h-[75vh] sm:h-full pb-16 w-full">
        {dummyData.map((item, index) => {
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="w-full"
            >
              <TimeCapsuleCard
                key={index}
                countdown={item.countdown}
                month={item.month}
                messageTitle={item.messageTitle}
                messageText={item.messageText}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 fixed bottom-10 text-4xl font-bold bg-[#f0f0f0] pt-6 w-full">
        <span className="opacity-50">From You</span>
        <span>To You.</span>
      </div>
    </div>
  );
};

export default TimeCapsule;
