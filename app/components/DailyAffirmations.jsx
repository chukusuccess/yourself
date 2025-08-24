"use client";
import {
  CopyOutlined,
  DownloadOutlined,
  SyncOutlined,
  OpenAIOutlined,
} from "@ant-design/icons";
import { Button, Spin, message } from "antd";
import React from "react";
import { useDailyAffirmations } from "../hooks/useDailyAffirmations";
import Image from "next/image";

const DailyAffirmation = ({ user }) => {
  const { currentAffirmation, refreshAffirmation, loading } =
    useDailyAffirmations(user);

  const [messageApi, contextHolder] = message.useMessage();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentAffirmation);
      messageApi.success("Copied to clipboard!");
    } catch {
      messageApi.error("Copy failed.");
    }
  };

  const downloadAsImage = async () => {
    const node = document.getElementById("affirmation-card");

    // Hide buttons and add logo + ad
    const buttons = node.querySelector(".export-ignore");
    const firstLogo = node.querySelector(".first-logo");
    const logo = node.querySelector(".export-logo");
    const ad = node.querySelector(".export-ad");
    const card = node.querySelector(".card");

    if (buttons) buttons.style.display = "none";
    if (firstLogo) firstLogo.style.display = "none";
    if (logo) logo.style.display = "flex";
    if (ad) ad.style.display = "flex";
    if (card) card.style.scale = "90%";

    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(node);

    // Restore buttons and hide logo + ad
    if (buttons) buttons.style.display = "flex";
    if (firstLogo) firstLogo.style.display = "flex";
    if (logo) logo.style.display = "none";
    if (ad) ad.style.display = "none";
    if (card) card.style.scale = "100%";

    const link = document.createElement("a");
    link.download = "affirmation.png";
    link.href = dataUrl;
    link.click();

    messageApi.success("Image downloaded!");
  };

  return (
    <div
      className="w-full flex items-center justify-center bg-[#f5f5f5]"
      id="affirmation-card"
    >
      <div className="bg-gradient-to-br bg-white p-8 rounded-xl shadow-sm mb-8 card">
        {contextHolder}
        <h2 className="text-2xl font-bold mb-4 flex gap-3 items-center justify-center w-full">
          <OpenAIOutlined className="font-bold text-4xl first-logo" />
          Today&apos;s Affirmation
        </h2>

        {loading ? (
          <div className="w-full flex items-center justify-center">
            <Spin />
          </div>
        ) : (
          <div className="space-y-4 text-xs font-normal text-center flex flex-col items-center justify-center">
            <div>&quot;{currentAffirmation}&quot;</div>

            <div className="flex items-center gap-5 export-ignore">
              <Button
                type="text"
                size="large"
                className="rounded-full"
                onClick={copyToClipboard}
              >
                <CopyOutlined />
              </Button>
              <Button
                type="text"
                size="large"
                className="rounded-full"
                onClick={refreshAffirmation}
                disabled={!user?.isPremium}
              >
                <SyncOutlined />
              </Button>
              <Button
                type="text"
                size="large"
                className="rounded-full"
                onClick={downloadAsImage}
              >
                <DownloadOutlined />
              </Button>
            </div>
          </div>
        )}
        <div className="w-full items-center justify-center mt-5 export-logo hidden">
          <Image
            className="opacity-100"
            src={"/bg.png"}
            alt="cover"
            width={50}
            height={50}
          />
        </div>
        <div className="w-full items-center justify-center text-[10px] opacity-50 export-ad hidden">
          <span>
            Shared from <b className="text-[12px]">Yourself</b> app.
          </span>
        </div>
      </div>
    </div>
  );
};

export default DailyAffirmation;
