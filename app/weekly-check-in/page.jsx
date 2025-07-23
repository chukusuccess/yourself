"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import CheckInCard from "../components/CheckInCard";

const dummyData = [
  {
    habitTitle: "Sleep 8hrs",
    month: "July 2025.",
    streak: [
      { day: "M", tooltip: "Monday", status: "done" },

      { day: "T", tooltip: "Tuesday", status: "done" },
      { day: "W", tooltip: "Wednesday", status: "done" },
      { day: "T", tooltip: "Thursday", status: "" },
      { day: "F", tooltip: "Friday", status: "" },
      { day: "S", tooltip: "Saturday", status: "" },
      { day: "S", tooltip: "Sunday", status: "" },
    ],
    message: "You have a 3 day streak! Future You is grateful.",
    reviewText:
      "Statistically, a 3 day streak out of 7 days is less than 50% achievement but you're making progress nonetheless! In 5 years, you'll have slept 817 more hours if you maintain your current pattern.",
  },
  {
    habitTitle: "Meditate",
    month: "July 2025.",
    streak: [
      { day: "M", status: "done" },

      { day: "T", status: "" },
      { day: "W", status: "done" },
      { day: "T", status: "" },
      { day: "F", status: "" },
      { day: "S", status: "" },
      { day: "S", status: "done" },
    ],
    message: "You have a 3 day streak! Future You is grateful.",
    reviewText: "",
  },
  {
    habitTitle: "Exercise",
    month: "July 2025.",
    streak: [
      { day: "M", status: "done" },

      { day: "T", status: "done" },
      { day: "W", status: "" },
      { day: "T", status: "" },
      { day: "F", status: "" },
      { day: "S", status: "" },
      { day: "S", status: "" },
    ],
    message: "You have a 2 day streak! Future You is grateful.",
    reviewText: "",
  },
  {
    habitTitle: "Make bed",
    month: "July 2025.",
    streak: [
      { day: "M", status: "done" },

      { day: "T", status: "done" },
      { day: "W", status: "" },
      { day: "T", status: "" },
      { day: "F", status: "done" },
      { day: "S", status: "done" },
      { day: "S", status: "done" },
    ],
    message: "You have a 5 day streak! Future You is grateful.",
    reviewText: "",
  },
];

const WeeklyCheckIn = () => {
  const router = useRouter();
  return (
    <div className="p-6 sm:w-1/3 w-full">
      <p className="w-full mb-4 px-8 text-center text-xs font-semibold">
        Visualize how this week contributed (or not) toward meaningful goals.
      </p>
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
              <CheckInCard
                key={index}
                habitTitle={item.habitTitle}
                month={item.month}
                streak={item.streak}
                message={item.message}
                reviewText={item.reviewText}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 fixed bottom-10 text-4xl font-bold bg-[#f0f0f0] pt-6 w-full">
        <span className="opacity-50">Weekly</span>
        <span>Check-in.</span>
      </div>
    </div>
  );
};

export default WeeklyCheckIn;
