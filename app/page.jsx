"use client";
import { useEffect, useState } from "react";
import Splash from "./components/Splash";
import { motion } from "framer-motion";
import { TRANSLATIONS } from "./resources/constants";
import { findMatchingLocale } from "./resources/utils";
import { Button, DatePicker, Divider, Tooltip } from "antd";
import dayjs from "dayjs";
import {
  animationOne,
  fadeIn,
  animationTwo,
  animationThree,
  animationFour,
} from "./resources/animation";
import { useRouter, useSearchParams } from "next/navigation";

import customParseFormat from "dayjs/plugin/customParseFormat";
import Image from "next/image";

dayjs.extend(customParseFormat);
const customFormat = (value) => {
  if (!value) return "";
  const day = value.date();
  const daySuffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";
  return `${day}${daySuffix} ${value.format("MMMM, YYYY")}`;
};

const appLocale = "{{APP_LOCALE}}";
const browserLocale = navigator.languages?.[0] || navigator.language || "en-US";

const locale =
  appLocale !== "{{APP_LOCALE}}"
    ? findMatchingLocale(appLocale)
    : findMatchingLocale(browserLocale);
const t = (key) =>
  TRANSLATIONS[locale]?.[key] || TRANSLATIONS["en-US"][key] || key;

export default function Home() {
  const [step, setStep] = useState(0);
  const [birthdate, setBirthdate] = useState("");
  const [stats, setStats] = useState(null);
  const [showHoverData, setShowHoverData] = useState(false);
  const [hoverWeek, setHoverWeek] = useState(null);
  const [displayedText, setDisplayedText] = useState("");
  const [currentPage, setCurrentPage] = useState("");

  const searchParams = useSearchParams();
  const freemium = searchParams.get("user");

  const router = useRouter();

  const text = t("pageSubtitle");
  const text2 = t("guestPageSubtitle");
  const speed = 40;

  useEffect(() => {
    if (freemium === "guest") {
      setCurrentPage(freemium);
      let timeoutId = null;
      let i = 0;

      const type = () => {
        if (i < text2.length) {
          setDisplayedText(text2.slice(0, i + 1));
          i++;
          timeoutId = setTimeout(type, speed);
        }
      };

      type();

      // Cleanup timeout
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [freemium]);

  useEffect(() => {
    let timeoutId = null;
    let typingTimeoutId = null;
    let i = 0;

    const type = () => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        timeoutId = setTimeout(type, speed);
      }
    };

    // Delay the start by 3 seconds
    typingTimeoutId = setTimeout(() => {
      type();
      handleReset();
    }, 4000);

    // Cleanup both timeouts
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(typingTimeoutId);
    };
  }, [text]);

  const handleChange = (date, dateString) => {
    setBirthdate(date);
  };

  const calculateStats = (date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const birthYear = birthDate.getFullYear();

    // Calculate weeks lived
    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    const weeksLived = Math.floor((today - birthDate) / msInWeek);

    // Assuming average lifespan of ~80 years (4160 weeks)
    const totalWeeks = 4160;
    const weeksRemaining = totalWeeks - weeksLived;
    const percentageLived = Math.round((weeksLived / totalWeeks) * 100);

    // Calculate days lived
    const msInDay = 1000 * 60 * 60 * 24;
    const daysLived = Math.floor((today - birthDate) / msInDay);

    // Calculate hours slept (assuming 8 hours per day)
    const hoursSlept = Math.floor(daysLived * 8);

    // Calculate heartbeats (average 70 bpm)
    const heartbeats = Math.floor(daysLived * 24 * 60 * 70);

    // Calculate breaths (average 16 breaths per minute)
    const breaths = Math.floor(daysLived * 24 * 60 * 16);

    // Calculate seasons experienced
    const seasons = Math.floor(daysLived / 91.25);

    return {
      weeksLived,
      totalWeeks,
      weeksRemaining,
      percentageLived,
      daysLived,
      hoursSlept,
      heartbeats,
      breaths,
      seasons,
      birthYear,
    };
  };

  // Helper functions for contextual statistics
  const getPopulationAtYear = (year) => {
    // World population estimates by year (in billions)
    const populationData = {
      1950: 2.5,
      1960: 3.0,
      1970: 3.7,
      1980: 4.4,
      1990: 5.3,
      2000: 6.1,
      2010: 6.9,
      2020: 7.8,
      2025: 8.1,
    };

    // Find the closest year in our data
    const years = Object.keys(populationData).map(Number);
    const closestYear = years.reduce((prev, curr) =>
      Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev
    );

    return Math.round(populationData[closestYear] * 1000000000);
  };

  const getAverageBirthsPerDay = () => {
    // Approximately 385,000 births per day globally (as of 2023)
    return 385000;
  };

  const getAverageDeathsPerDay = () => {
    // Approximately 166,000 deaths per day globally (as of 2023)
    return 166000;
  };

  const handleSubmit = () => {
    setStats(calculateStats(birthdate));
    setStep(2);
    router.push("/?user=guest");
  };

  const getFormattedNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const renderWeekGrid = () => {
    if (!stats) return null;

    const rows = [];
    const weeksPerRow = 52;
    const totalRows = Math.ceil(stats.totalWeeks / weeksPerRow);

    for (let row = 0; row < totalRows; row++) {
      const weekCells = [];
      for (let col = 0; col < weeksPerRow; col++) {
        const weekNumber = row * weeksPerRow + col;
        if (weekNumber < stats.totalWeeks) {
          const isPast = weekNumber < stats.weeksLived;
          const isCurrent = weekNumber === stats.weeksLived;

          let cellClass = "w-1 h-1 mb-0.25 rounded-full transition-all ";
          if (isPast) {
            cellClass += "bg-gray-800 ";
          } else if (isCurrent) {
            cellClass += "bg-blue-500 scale-110 animate-pulse";
          } else {
            cellClass += "bg-gray-200 ";
          }

          weekCells.push(
            <Tooltip
              open={isCurrent ? true : false}
              placement="bottom"
              autoAdjustOverflow={false}
              title={isCurrent ? "Now" : null}
              color={"#5a5753"}
              key={weekNumber}
            >
              <div
                key={weekNumber}
                className={cellClass}
                onMouseEnter={() => {
                  setHoverWeek(weekNumber);
                  setShowHoverData(true);
                }}
                onMouseLeave={() => setShowHoverData(false)}
              />
            </Tooltip>
          );
        }
      }

      rows.push(
        <div
          key={row}
          className="flex items-center justify-between max-w-screen"
        >
          {weekCells}
        </div>
      );
    }

    return (
      <div className="max-w-screen bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-sm font-normal mb-4">{t("lifeInWeeksTitle")}</h2>
        <div className="flex flex-col">{rows}</div>

        {showHoverData && (
          <div className="mt-4 text-sm text-gray-600">
            Week {hoverWeek + 1}:
            {hoverWeek < stats.weeksLived
              ? t("weekHoverPast")
              : hoverWeek === stats.weeksLived
              ? t("weekHoverCurrent")
              : t("weekHoverFuture")}
          </div>
        )}

        <div className="flex mt-6 text-sm">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 rounded-full bg-gray-800 mr-2"></div>
            <span>{t("legendPast")}</span>
          </div>
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 rounded-full animate-pulse bg-blue-500 mr-2"></div>
            <span>{t("legendPresent")}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-200 mr-2"></div>
            <span>{t("legendFuture")}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderStats = () => {
    if (!stats) return null;

    return (
      <div className="max-w-screen mt-8 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-normal mb-4 text-gray-800">
            {t("lifeHighlightsTitle")}
          </h2>
          <div className="space-y-4">
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
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-normal mb-4 text-gray-800">
            {t("societalContextTitle")}
          </h2>
          <div className="space-y-4">
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
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-normal mb-4 text-gray-800">
            {t("cosmicPerspectiveTitle")}
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              {t("cosmicEarthTravel")}{" "}
              <span className="text-gray-900 font-medium">
                {getFormattedNumber(
                  Math.round(stats.daysLived * 1.6 * 1000000)
                )}
              </span>{" "}
              {t("cosmicEarthTravelEnd")}
            </p>
            <p className="text-gray-600">
              {t("cosmicUniverse")}{" "}
              <span className="text-gray-900 font-medium">93</span>{" "}
              {t("cosmicUniverseMiddle")}{" "}
              <span className="text-gray-900 font-medium">93</span>{" "}
              {t("cosmicUniverseMiddle2")}{" "}
              <span className="text-gray-900 font-medium">
                {((80 / 13800000000) * 100).toFixed(10)}%
              </span>{" "}
              {t("cosmicUniverseEnd")}
            </p>
            <p className="text-gray-600">
              {t("cosmicSolarSystem")}{" "}
              <span className="text-gray-900 font-medium">
                {getFormattedNumber(Math.round(stats.daysLived * 24 * 828000))}
              </span>{" "}
              {t("cosmicSolarSystemEnd")}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-normal mb-4 text-gray-800">
            {t("naturalWorldTitle")}
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              {t("naturalLunarCycles")}{" "}
              <span className="text-gray-900 font-medium">
                {getFormattedNumber(Math.round(stats.daysLived / 29.53))}
              </span>{" "}
              {t("naturalLunarMiddle")}{" "}
              <span className="text-gray-900 font-medium">
                {getFormattedNumber(Math.floor(stats.daysLived / 365.25))}
              </span>{" "}
              {t("naturalLunarEnd")}
            </p>
            <p className="text-gray-600">
              {t("naturalSequoia")}{" "}
              <span className="text-gray-900 font-medium">
                {((stats.daysLived / 365.25 / 3000) * 100).toFixed(2)}%
              </span>{" "}
              {t("naturalSequoiaEnd")}
            </p>
            <p className="text-gray-600">{t("naturalCells")}</p>
          </div>
        </div>
      </div>
    );
  };

  const handleReset = () => {
    setBirthdate("");
    setStats(null);
    setStep(1);
    setCurrentPage("");
    router.push("/user=");
  };

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen max-w-screen">
      <Splash />
      <div className="bg-gray-50 min-h-screen pt-16 px-4">
        <div>
          <div className="w-full flex items-center justify-center">
            {currentPage === "guest" ? (
              <Image
                className="w-1/3 mb-2 h-auto sm:w-1/2 lg:w-1/3 sm:h-auto"
                src={"/pocketwatch.png"}
                alt="cover"
                width={1000}
                height={1000}
              />
            ) : (
              <Image
                className="w-2/3 h-auto sm:w-1/2 lg:w-1/3 sm:h-auto"
                src={"/silhouette.png"}
                alt="cover"
                width={1000}
                height={1000}
              />
            )}
          </div>
          <motion.h1
            variants={fadeIn("up", "tween", 2.5, 3)}
            initial="hidden"
            animate="show"
            className="text-2xl text-center font-normal mb-2"
          >
            {currentPage === "guest" ? t("guestPageTitle") : t("pageTitle")}
          </motion.h1>
          <br />
          <p className="text-gray-400 text-sm text-center mb-8">
            {displayedText}
          </p>
          <br />
          {step === 1 ? (
            <motion.div
              variants={animationThree}
              initial="hidden"
              animate="visible"
              className="bg-white p-6 rounded-md shadow-sm"
            >
              <h2 className="font-normal mb-4 text-gray-800 text-center">
                {t("birthDateQuestion")}
              </h2>
              <div>
                <DatePicker
                  size="large"
                  format={customFormat}
                  onChange={handleChange}
                  placeholder="Select birthdate"
                  style={{ width: "100%" }}
                />
                <Divider />
                <Button
                  size="large"
                  type="primary"
                  onClick={handleSubmit}
                  className="w-full h-16 bg-[#5a5753] text-[#eee5dc] rounded-full hover:bg-gray-500 transition-colors"
                  disabled={!birthdate}
                >
                  {t("visualizeButton")}
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              {renderWeekGrid()}
              {renderStats()}
              <Button
                size="large"
                type="primary"
                onClick={handleReset}
                className="my-8 w-full h-16 bg-[#5a5753] text-[#eee5dc] rounded-full hover:bg-gray-500 transition-colors"
              >
                {t("startOverButton")}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
