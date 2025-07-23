"use client";
import { DeleteFilled } from "@ant-design/icons";
import { Button } from "antd";

const TimeCapsuleCard = ({ countdown, month, messageTitle, messageText }) => {
  const handleDelete = () => {
    return;
  };
  return (
    <div className="bg-white p-6 rounded-xl text-[#5a5753] flex flex-col gap-2 antialiased max-w-screen w-full">
      <h2 className="text-lg font-semibold w-full flex items-center justify-between">
        {countdown}
        <Button
          onClick={handleDelete}
          icon={<DeleteFilled />}
          size="small"
          type="text"
          danger
        >
          Trash
        </Button>
      </h2>
      <div>
        <span> {month}</span>
      </div>
      <div className="space-y-4 text-xs font-light">{messageTitle}</div>
    </div>
  );
};

export default TimeCapsuleCard;
