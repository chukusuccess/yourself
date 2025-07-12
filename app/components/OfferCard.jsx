"use client";
import { CheckOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

const OfferCard = ({
  offerTitle,
  price,
  discount,
  routineBilling,
  children,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl text-[#5a5753] flex flex-col gap-4 antialiased border border-[#d9d9d9]">
      <h2 className="text-lg font-semibold w-full flex items-center justify-between">
        {offerTitle}
        <CheckOutlined className="font-bold text-blue-500" />
      </h2>
      <span>
        <span className="text-purple-500 font-bold text-3xl">{price}</span>{" "}
        /month <span> {discount}</span>
      </span>
      <span className="text-blue-500">{routineBilling}</span>
      <div className="space-y-4 text-xs font-light">
        {children}
        <div className="rounded-full bg-gradient-to-br from-blue-500 to bg-pink-500 text-white font-normal w-fit px-6 py-4">
          See features
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
