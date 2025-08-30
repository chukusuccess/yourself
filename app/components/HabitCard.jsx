import {
  ClockCircleOutlined,
  DeleteFilled,
  EyeOutlined,
  TrophyFilled,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Button, Progress } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect } from "react";

dayjs.extend(relativeTime);

export const HabitCard = ({
  habit,
  onDelete,
  onVerify, // ✅ parent provides
  onRequestVerification, // ✅ parent provides
}) => {
  useEffect(() => {
    console.log(habit);
  }, [habit]);

  return (
    <div className="w-full bg-white rounded-xl p-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col w-3/4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="font-semibold text-base truncate">
              {habit.title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full ${
                habit.type === "habit" ? "bg-teal-500" : "bg-cyan-500"
              } text-xs text-white px-3 py-[0.75]`}
            >
              {habit.type === "habit" ? "Building" : "Breaking"}
            </span>
            •
            <span className="text-xs">
              {habit.witnesses.length === 1
                ? `${habit.witnesses.length} witness`
                : `${habit.witnesses.length} witnesses`}
            </span>
          </div>
        </div>

        {/* Streak */}
        <div className="flex w-1/4 flex-col items-end justify-end">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">{habit.streak_count}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">day streak</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full my-4">
        <span className="text-xs opacity-50 w-full flex items-center justify-between">
          <span>
            <TrophyFilled /> Progress to achievement
          </span>
          <span className="text-black font-bold">
            {habit.streak_count}/7 days
          </span>
        </span>
        <Progress
          status="active"
          percent={Math.min(Math.round((habit.streak_count / 7) * 100), 100)}
          strokeColor={"#000000"}
        />
      </div>

      {/* Witnesses */}
      <div className="w-full">
        <span className="flex items-center mb-2">
          <UsergroupAddOutlined />
          <span>Witnesses</span>
        </span>
        <span className="flex flex-wrap items-center gap-2">
          {habit.witnesses.length > 0 ? (
            habit.witnesses.map((item, index) => (
              <span
                key={index}
                className="flex items-center gap-2 border border-[#c2c2c2] rounded-full px-2 text-xs"
              >
                <EyeOutlined />
                {item.full_name}
              </span>
            ))
          ) : (
            <span className="flex items-center gap-2 border border-[#c2c2c2] rounded-full px-2 text-xs">
              <EyeOutlined />
              You
            </span>
          )}
        </span>
      </div>

      {/* Actions */}
      <div className="w-full">
        <span className="flex text-xs items-center gap-2 mb-2 opacity-50 mt-5">
          <ClockCircleOutlined />
          <span>
            Last Verified:{" "}
            {habit.last_verified
              ? dayjs(habit.last_verified).fromNow()
              : "Never"}
          </span>
        </span>
        <span className="w-full flex items-center justify-between">
          {habit.witness_required === true ? (
            <Button type="primary" onClick={() => onRequestVerification(habit)}>
              <span className="text-xs">Request Verification</span>
            </Button>
          ) : (
            <Button type="primary" onClick={() => onVerify(habit)}>
              <span className="text-xs">Verify for yourself</span>
            </Button>
          )}

          <Button type="default" htmlType="button">
            <span className="text-xs">Give up</span>
          </Button>

          <Button onClick={() => onDelete(habit)} type="primary" danger>
            <DeleteFilled />
          </Button>
        </span>
      </div>
    </div>
  );
};
