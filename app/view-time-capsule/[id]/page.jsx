"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Image from "next/image";
import { Button } from "antd";

const TimeCapsuleView = ({
  capsule = {
    title: "Your First Birthday",
    from: "Dad",
    to: "You",
    dateWritten: "July 15, 2025",
    unlockDate: "2025-07-20",
    messageText: "Happy 18th birthday! I’m so proud of you...",
    image: "/uploads/photo.jpg",
    audio: "/uploads/voice.mp3",
  },
}) => {
  const router = useRouter();

  const now = dayjs();
  const unlockDate = dayjs(capsule.unlockDate);
  const isUnlocked = now.isAfter(unlockDate);

  if (!isUnlocked) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-center p-8">
        <LockOutlined className="text-6xl text-gray-400 mb-4 animate-pulse" />
        <h1 className="text-xl font-bold text-gray-700">Too Early</h1>
        <p className="text-sm text-gray-500">
          This message will unlock on {unlockDate.format("MMMM D, YYYY")}.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <p className="text-sm text-gray-500 mb-2">{capsule.dateWritten}</p>
      <h2 className="text-3xl font-bold text-gray-800 mb-1">
        From {capsule.from} to {capsule.to}
      </h2>

      <div className="text-gray-700 text-base leading-relaxed mt-4 whitespace-pre-wrap">
        {capsule.messageText}
      </div>

      {capsule.image && (
        <div className="mt-6">
          <Image
            src={capsule.image}
            alt="Attached"
            width={800}
            height={500}
            className="rounded-xl"
          />
        </div>
      )}

      {capsule.audio && (
        <div className="mt-6">
          <audio controls className="w-full">
            <source src={capsule.audio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <div className="mt-10 text-right">
        <Button type="primary" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default TimeCapsuleView;
