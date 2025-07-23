"use client";
import { useEffect, useState } from "react";
import Splash from "./components/Splash";
import { motion } from "framer-motion";
import { TRANSLATIONS } from "./resources/constants";
import { findMatchingLocale } from "./resources/utils";
import { Button, DatePicker, Divider, Tooltip } from "antd";
import dayjs from "dayjs";
import { fadeIn, animationThree } from "./resources/animation";
import { useRouter, useSearchParams } from "next/navigation";

import customParseFormat from "dayjs/plugin/customParseFormat";
import Image from "next/image";

import WeekGrid from "./components/WeekGrid";
import LifeStats from "./components/LifeStats";

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
  const [step, setStep] = useState(1);
  const [birthdate, setBirthdate] = useState("");
  const [stats, setStats] = useState(null);
  const [displayedText, setDisplayedText] = useState("");
  const [currentPage, setCurrentPage] = useState("");

  const searchParams = useSearchParams();
  const freemium = searchParams.get("user");

  const router = useRouter();

  const text = t("pageSubtitle");
  const text2 = t("guestPageSubtitle");
  const speed = 40;

  useEffect(() => {
    const actualText = freemium === "guest" ? text2 : text;
    let i = 0;
    let intervalId = null;

    if (freemium !== null) {
      setCurrentPage(freemium); // sets current page to "guest"
      intervalId = setInterval(() => {
        if (i < actualText.length) {
          setDisplayedText(actualText.slice(0, i + 1));
          i++;
        } else {
          clearInterval(intervalId);
        }
      }, speed);
    } else {
      const delay = setTimeout(() => {
        intervalId = setInterval(() => {
          if (i < text.length) {
            setDisplayedText(text.slice(0, i + 1));
            i++;
          } else {
            clearInterval(intervalId);
          }
        }, speed);
        handleReset(1, "/");
      }, 4000);

      return () => clearTimeout(delay);
    }

    return () => clearInterval(intervalId);
  }, [freemium]);

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

  const handleReset = (step, param) => {
    setBirthdate("");
    setStats(null);
    setStep(step);
    setCurrentPage("");
    router.push(param);
  };

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen max-w-screen sm:w-1/3">
      <Splash />
      <div className="min-h-screen pt-16 px-4">
        <div>
          <motion.div
            key={currentPage} // important to trigger animation when page changes
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col items-center justify-center"
          >
            <Image
              className={`${
                currentPage === "guest" ? "w-1/3" : "w-2/3"
              } h-auto sm:w-1/2 lg:w-1/3 sm:h-auto`}
              src={
                currentPage === "guest" ? "/pocketwatch.png" : "/silhouette.png"
              }
              alt="cover"
              width={1000}
              height={1000}
            />
            <motion.h1
              className="text-2xl text-center font-normal mb-2"
              variants={fadeIn("up", "tween", 2, 1)}
              initial="hidden"
              animate="show"
            >
              {currentPage === "guest" ? t("guestPageTitle") : t("pageTitle")}
            </motion.h1>
          </motion.div>

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
              <WeekGrid stats={stats} t={t} />
              <LifeStats
                stats={stats}
                t={t}
                getFormattedNumber={getFormattedNumber}
                getPopulationAtYear={getPopulationAtYear}
                getAverageBirthsPerDay={getAverageBirthsPerDay}
                getAverageDeathsPerDay={getAverageDeathsPerDay}
              />

              <Button
                size="large"
                type="primary"
                onClick={() => handleReset(1, "/?user=")}
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
