"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthProvider";
import { HabitService } from "@/app/services/habit.service";
import CheckInCard from "../../components/CheckInCard";
import dayjs from "dayjs";
import { LoadingScreen } from "@/app/components/LoadingScreen";

const WeeklyCheckIn = () => {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHabits = async () => {
      if (!currentUser?.id) return;
      try {
        const res = await HabitService.listHabits(currentUser.id);
        console.log(res);
        setHabits(res);
      } catch (err) {
        console.error("Failed to fetch habits", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [currentUser?.id]);

  // Utility to build a 7-day streak grid for the current week
  const buildWeeklyStreak = (habit) => {
    const today = dayjs();
    const startOfWeek = today.startOf("week"); // Monday by default (depending on locale)
    const days = ["M", "T", "W", "T", "F", "S", "S"];

    return days.map((d, idx) => {
      const date = startOfWeek.add(idx, "day");
      const verified =
        habit.last_verified && dayjs(habit.last_verified).isSame(date, "day");

      return {
        day: d,
        tooltip: date.format("dddd"),
        status: verified ? "done" : "",
      };
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-6 sm:w-1/3 w-full">
      <p className="w-full mb-4 px-8 text-center text-xs font-semibold">
        Visualize how this week contributed (or not) toward meaningful goals.
      </p>
      <div className="space-y-4 text-xs text-white font-normal flex flex-col relative overflow-y-auto noscroll h-[75vh] sm:h-full pb-16 w-full">
        {habits.map((habit, index) => {
          const streak = buildWeeklyStreak(habit);
          return (
            <motion.div
              key={habit.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="w-full"
            >
              <CheckInCard
                habitTitle={habit.title}
                month={dayjs().format("MMMM YYYY")}
                streak={streak}
                message={`You have a ${
                  habit.streak_count
                } day streak! Future You is ${
                  habit.streak_count === 0 ? "not" : ""
                } grateful.`}
                reviewText={
                  habit.streak_count < 4
                    ? "Keep going, you're building consistency."
                    : "Great progress, consistency compounds over time!"
                }
              />
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col fixed bottom-0 text-2xl font-bold py-4 w-full">
        <span className="opacity-50">Weekly</span>
        <span>Check-in.</span>
      </div>
    </div>
  );
};

export default WeeklyCheckIn;
