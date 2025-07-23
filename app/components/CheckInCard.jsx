"use client";
import { OpenAIFilled } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CheckInCard = ({ habitTitle, month, streak, message, reviewText }) => {
  const [review, setReview] = useState(false);

  const handleAIReview = () => {
    if (reviewText) {
      setReview(!review);
    }
    return;
  };
  return (
    <div className="bg-white p-6 rounded-xl text-[#5a5753] flex flex-col gap-2 antialiased w-full">
      <h2 className="text-lg font-semibold w-full flex items-center justify-between">
        {habitTitle}
        <Button
          onClick={handleAIReview}
          icon={<OpenAIFilled />}
          size="small"
          type="text"
        >
          Review
        </Button>
      </h2>
      <div>
        <span> {month}</span>
      </div>
      <div className="w-full flex items-center justify-between">
        {streak?.map((item, index) => {
          return (
            <Tooltip key={index} title={item.tooltip}>
              <span
                className={`${
                  item.status === "done"
                    ? "bg-black text-white opacity-100"
                    : "text-black bg-[#5a575330]"
                } w-9 h-9 rounded-full flex items-center justify-center font-semibold`}
              >
                {item.day}
              </span>
            </Tooltip>
          );
        })}
      </div>
      <div className="space-y-4 text-xs font-light">{message}</div>
      <AnimatePresence>
        {review && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xs font-light w-full"
          >
            {reviewText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckInCard;
