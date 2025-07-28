// LifeStats.jsx
"use client";
import React, { useState } from "react";
import PremiumAdCard from "./PremiumAdCard";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const getFormattedNumber = (num) => new Intl.NumberFormat().format(num);

const LifeStats = ({
  stats,
  t,
  getPopulationAtYear,
  getAverageBirthsPerDay,
  getAverageDeathsPerDay,
}) => {
  if (!stats) return null;

  const [animate, setAnimate] = useState({
    card1: false,
    card2: false,
    card3: false,
    card4: false,
  });

  const handleAnimate = (card) => {
    switch (true) {
      case card === "card1":
        setAnimate((prev) => ({ ...prev, card1: !animate.card1 }));
        break;
      case card === "card2":
        setAnimate((prev) => ({ ...prev, card2: !animate.card2 }));
        break;
      case card === "card3":
        setAnimate((prev) => ({ ...prev, card3: !animate.card3 }));
        break;
      case card === "card4":
        setAnimate((prev) => ({ ...prev, card4: !animate.card4 }));
        break;

      default:
        break;
    }
  };

  return (
    <div className="max-w-screen mt-8 space-y-6">
      <div className="bg-white p-6 rounded-xl subtle-shadow">
        <h2
          onClick={() => handleAnimate("card1")}
          className="w-full text-lg font-normal text-gray-800 flex items-center justify-between"
        >
          {t("lifeHighlightsTitle")}
          <Image
            src={"/life.png"}
            alt="life"
            width={100}
            height={100}
            className="h-full w-auto"
          />
        </h2>
        <AnimatePresence>
          {animate.card1 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 text-xs mt-4"
            >
              <p className="text-gray-600">
                {t("lifeHighlightsWeeks")}{" "}
                <span className="text-gray-900 font-medium">
                  {getFormattedNumber(stats.weeksLived)}
                </span>{" "}
                {t("lifeHighlightsWeeksEnd")}{" "}
                <span className="text-gray-900 font-medium">
                  {stats.percentageLived}%
                </span>{" "}
                {t("lifeHighlightsPercent")}
              </p>
              <p className="text-gray-600">
                {t("lifeHighlightsDays")}{" "}
                <span className="text-gray-900 font-medium">
                  {getFormattedNumber(stats.daysLived)}
                </span>{" "}
                {t("lifeHighlightsDaysEnd")}{" "}
                <span className="text-gray-900 font-medium">
                  {getFormattedNumber(stats.seasons)}
                </span>{" "}
                {t("lifeHighlightsSeasonsEnd")}
              </p>
              <p className="text-gray-600">
                {t("lifeHighlightsHeartbeats")}{" "}
                <span className="text-gray-900 font-medium">
                  {getFormattedNumber(stats.heartbeats)}
                </span>{" "}
                {t("lifeHighlightsHeartbeatsEnd")}
              </p>
              <p className="text-gray-600">
                {t("lifeHighlightsBreaths")}{" "}
                <span className="text-gray-900 font-medium">
                  {getFormattedNumber(stats.breaths)}
                </span>{" "}
                {t("lifeHighlightsBreathsMiddle")}{" "}
                <span className="text-gray-900 font-medium">
                  {getFormattedNumber(stats.hoursSlept)}
                </span>{" "}
                {t("lifeHighlightsBreathsEnd")}
              </p>
              <p>
                {t("lifeHighlightsSunrises")}{" "}
                <span className="text-gray-900 font-medium">
                  {getFormattedNumber(stats.sunrisesSeen)}
                </span>{" "}
                {t("lifeHighlightsSunrisesEnd")}
              </p>
              <p className="italic">{t("lifeHighlightsBlanks")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white p-6 rounded-xl subtle-shadow">
        <h2
          onClick={() => handleAnimate("card2")}
          className="w-full text-lg font-normal text-gray-800 flex items-center justify-between"
        >
          {t("societalContextTitle")}
          <Image
            src={"/globe.png"}
            alt="life"
            width={100}
            height={100}
            className="h-full w-auto"
          />
        </h2>
        <AnimatePresence>
          {animate.card2 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 text-xs mt-4"
            >
              <p className="text-gray-600">
                {t("societalPopulation")}{" "}
                {stats.birthYear ? (
                  <span className="text-gray-900 font-medium">
                    {getFormattedNumber(getPopulationAtYear(stats.birthYear))}
                  </span>
                ) : (
                  ""
                )}{" "}
                {t("societalPopulationEnd")}{" "}
                <span className="text-gray-900 font-medium">8</span>{" "}
                {t("societalPopulationFinal")}
              </p>
              <p className="text-gray-600">
                {t("societalMeetings")}{" "}
                <span className="text-gray-900 font-medium">80,000</span>{" "}
                {t("societalMeetingsMiddle")}{" "}
                <span className="text-gray-900 font-medium">
                  {getFormattedNumber(
                    Math.round(80000 * (stats.percentageLived / 100))
                  )}
                </span>{" "}
                {t("societalMeetingsEnd")}
              </p>
              <p className="text-gray-600">
                {t("societalBirthsDeaths")}{" "}
                <span className="text-gray-900 font-medium">
                  {getFormattedNumber(
                    Math.round(stats.daysLived * getAverageBirthsPerDay())
                  )}
                </span>{" "}
                {t("societalBirthsMiddle")}{" "}
                <span className="text-gray-900 font-medium">
                  {getFormattedNumber(
                    Math.round(stats.daysLived * getAverageDeathsPerDay())
                  )}
                </span>{" "}
                {t("societalDeathsEnd")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white p-6 rounded-xl subtle-shadow">
        <h2
          onClick={() => handleAnimate("card3")}
          className="w-full text-lg font-normal text-gray-800 flex items-center justify-between"
        >
          {t("emotionalMomentsTitle")}
          <Image
            src={"/vegetarian.png"}
            alt="life"
            width={100}
            height={100}
            className="h-full w-auto"
          />
        </h2>
        <AnimatePresence>
          {animate.card3 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 text-xs mt-4"
            >
              <p>
                {t("emotionalLaughter")}{" "}
                <span className="text-gray-900 font-medium">
                  {getFormattedNumber(stats.laughs)}
                </span>{" "}
                {t("emotionalLaughterEnd")}
              </p>
              <p>
                {t("emotionalCried")}{" "}
                <span className="text-gray-900 font-medium">
                  {getFormattedNumber(stats.cries)}
                </span>{" "}
                {t("emotionalCriedEnd")}
              </p>
              <p>
                {t("emotionalHugs")}{" "}
                <span className="text-gray-900 font-medium">
                  {getFormattedNumber(stats.hugs)}
                </span>{" "}
                {t("emotionalHugsEnd")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white p-6 rounded-xl subtle-shadow">
        <h2
          onClick={() => handleAnimate("card4")}
          className="w-full text-lg font-normal text-gray-800 flex items-center justify-between"
        >
          {t("reflectionTitle")}
          <Image
            src={"/autism.png"}
            alt="life"
            width={100}
            height={100}
            className="h-full w-auto"
          />
        </h2>
        <div className="space-y-2 text-xs text-gray-600 italic">
          <AnimatePresence>
            {animate.card4 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 text-xs mt-4"
              >
                <p>{t("reflectionMemory")}</p>
                <p>{t("reflectionChoices")}</p>
                <p>{t("reflectionGrowth")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* <PremiumAdCard /> */}
    </div>
  );
};

export default React.memo(LifeStats);
