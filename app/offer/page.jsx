"use client";
import { Button, Divider } from "antd";
import React from "react";
import { useRouter } from "next/navigation";
import OfferCard from "../components/OfferCard";

const PremiumOffer = () => {
  const router = useRouter();
  return (
    <div className="p-6 bg-[#f0f0f0]">
      <h2 className="text-xl font-bold mb-4 w-full text-center">
        Upgrade to Premium
      </h2>
      <p className="w-full mb-4 px-8 text-center text-xs">
        Unlock your full potential with exclusive features designed to deepen
        your insights
      </p>
      <div className="space-y-4 text-xs text-white font-normal flex flex-col">
        <OfferCard
          offerTitle={"Yourself Standard"}
          price={"£3.99"}
          routineBilling={"Billed annually at £48"}
        >
          <ul className="flex flex-col items-start justify-start gap-2 pl-4 list-disc">
            <li>Full life grid customization</li>
            <li>All stat cards</li>
            <li>Milestone tracking</li>
            <li>Social share</li>
          </ul>
        </OfferCard>
        <OfferCard
          offerTitle={"Yourself Premium"}
          price={"£2.99"}
          discount={" | £24/year"}
          routineBilling={"Billed annually at £24"}
        >
          <ul className="flex flex-col items-start justify-start gap-2 pl-4 list-disc">
            <li>All standard features</li>
            <li>Advanced stat insights</li>
            <li>Habit tracking tracking & Streaks</li>
            <li>Daily wisdom feed</li>
            <li>Priority support</li>
          </ul>
        </OfferCard>
      </div>

      {/* <h2 className="text-xl font-bold mb-4 w-full text-center">
        What You&apos;ll Gain
      </h2> */}
      {/* <div className="space-y-4 text-xs text-white font-normal flex flex-col"> */}
      {/* map gain cards here in grid or flexwrap */}
      {/* </div> */}
      <Divider />
      <p className="w-full mb-4 px-8 text-center text-xs">
        By tapping "Upgrade Now", you agree to our{" "}
        <span className="text-blue-500">Terms of Service</span> and{" "}
        <span className="text-blue-500">Privacy Policy</span>. Your subscription
        will auto-renew unless cancelled.
      </p>
      <Divider />
      <Button
        //   onClick={() => router.push("/offer")}
        size="large"
        type="primary"
        className="rounded-full font-semibold w-full h-16"
      >
        Upgrade Now
      </Button>
    </div>
  );
};

export default PremiumOffer;
