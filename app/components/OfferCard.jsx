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
    <div className="bg-white p-6 rounded-xl text-[#5a5753] flex flex-col gap-4 antialiased">
      <h2 className="text-lg font-semibold w-full flex items-center justify-between">
        {offerTitle}
        <CheckOutlined className="font-bold text-blue-500" />
      </h2>
      <span>
        <span className="text-[#bf9b30] font-bold text-3xl">{price}</span>{" "}
        /month | <span className="text-[#bf9b30] font-bold"> {discount}</span>
      </span>
      <span className="text-[#bf9b30] font-semibold">{routineBilling}</span>
      <div className="space-y-4 text-xs font-light">
        {children}
        <Button
          type="primary"
          className="rounded-full text-white font-normal w-fit"
        >
          See Features
        </Button>
      </div>
    </div>
  );
};

export default OfferCard;
