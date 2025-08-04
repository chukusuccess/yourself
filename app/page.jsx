"use client";
import { useEffect, useState } from "react";
import Splash from "./components/Splash";
import { motion } from "framer-motion";
import { TRANSLATIONS } from "./resources/constants";
import { findMatchingLocale } from "./resources/utils";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Input,
  Modal,
  Row,
  message,
} from "antd";
import { CopyOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { fadeIn, animationThree } from "./resources/animation";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "./supabase";

import customParseFormat from "dayjs/plugin/customParseFormat";
import Image from "next/image";

import WeekGrid from "./components/WeekGrid";
import LifeStats from "./components/LifeStats";
import DailyAffirmation from "./components/DailyAffirmations";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const prevDate = localStorage?.getItem("birthdate");

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      messageApi.success("Link copied to clipboard!");
      setIsModalOpen(false);
    } catch (err) {
      messageApi.error("Failed to copy.");
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const searchParams = useSearchParams();
  const freemium = searchParams.get("user");

  const router = useRouter();

  useEffect(() => {
    const fetchRefCode = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("ref_code")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching ref_code:", error);
        messageApi.error("Could not load invite link.");
      } else {
        const url = `https://yourself-virid.vercel.app/home/friends?ref=${data.ref_code}`;
        setInviteLink(url);
      }

      setLoading(false);
    };

    if (isModalOpen) {
      fetchRefCode();
    }

    // const prevDate = localStorage.getItem("birthdate");

    if (prevDate) {
      setBirthdate(() => prevDate);
    }
  }, [isModalOpen, prevDate]);

  const handleRoute = async (route) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session && route === "/home/invite-loved-one") {
      showModal();
    }

    if (!session) {
      router.push("/auth");
    }

    if (session && route !== "/home/invite-loved-one") {
      router.push(route);
    }
  };

  const text = t("pageSubtitle");
  const text2 = t("guestPageSubtitle");
  const speed = 40;

  useEffect(() => {
    const actualText = freemium === "guest" ? text2 : text;
    let i = 0;
    let intervalId = null;

    if (freemium !== null) {
      setCurrentPage(freemium); // sets current page to "guest"
      handleSubmit();
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
    localStorage?.setItem("birthdate", date);
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

    // --- New meaningful stats ---
    const hoursAlive = daysLived * 24;
    const monthsLived = Math.floor(daysLived / 30.44);
    const sunrisesSeen = Math.floor(daysLived * 0.7); // assuming ~30% missed while sleeping or indoors
    const laughs = Math.floor(daysLived * 17); // average person laughs 17 times a day
    const cries = Math.floor(daysLived * 0.5); // not every day
    const hugs = Math.floor(daysLived * 2); // variable, moderate guess

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

      // New additions
      hoursAlive,
      monthsLived,
      sunrisesSeen,
      laughs,
      cries,
      hugs,
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

  const handleSubmit = async () => {
    prevDate
      ? setStats(calculateStats(prevDate))
      : setStats(calculateStats(birthdate));
    setStep(2);

    // const {
    //   data: { session },
    // } = await supabase.auth.getSession();

    // if (session) {
    //   const userId = session.user.id;

    //   await supabase
    //     .from("profiles")
    //     .upsert({ id: userId, birthdate: birthdate.toString() });
    // }

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
    router.replace(param);
  };

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen max-w-screen sm:w-1/3">
      <Splash />
      <div className="min-h-screen pt-16 px-4">
        {contextHolder}
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
                  defaultValue={dayjs(
                    localStorage?.getItem("birthdate"),
                    customFormat
                  )}
                  minDate={dayjs("1935-01-02", customFormat)}
                  maxDate={dayjs("2025-12-30", customFormat)}
                  style={{ width: "100%" }}
                />
                <Divider />
                <Button
                  size="large"
                  type="primary"
                  onClick={handleSubmit}
                  className="w-full h-16 bg-[#5a5753] text-[#eee5dc] rounded-full hover:bg-gray-500 transition-colors"
                  disabled={!birthdate && !prevDate}
                >
                  {t("visualizeButton")}
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              <DailyAffirmation />
              <WeekGrid stats={stats} t={t} />
              <LifeStats
                stats={stats}
                t={t}
                getFormattedNumber={getFormattedNumber}
                getPopulationAtYear={getPopulationAtYear}
                getAverageBirthsPerDay={getAverageBirthsPerDay}
                getAverageDeathsPerDay={getAverageDeathsPerDay}
              />
              <br />
              <div className="flex flex-col items-center justify-center">
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <div
                      onClick={() => handleRoute("/home/create-time-capsule")}
                      className="bg-white p-6 rounded-xl aspect-square flex flex-col items-center justify-center text-center subtle-shadow"
                    >
                      Write a Time Capsule
                      <Image
                        src={"/clock.png"}
                        alt="add"
                        width={100}
                        height={100}
                        className="h-1/4 w-auto"
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      onClick={() => handleRoute("/home/create-milestone")}
                      className="bg-white p-6 rounded-xl aspect-square flex flex-col items-center justify-center text-center subtle-shadow"
                    >
                      Mark a Milestone
                      <Image
                        src={"/achieve.png"}
                        alt="add"
                        width={100}
                        height={100}
                        className="h-1/4 w-auto"
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      onClick={() => handleRoute("/home/create-habit")}
                      className="bg-white p-6 rounded-xl aspect-square flex flex-col items-center justify-center text-center subtle-shadow"
                    >
                      Add a New Habit
                      <Image
                        src={"/book.png"}
                        alt="add"
                        width={100}
                        height={100}
                        className="h-1/4 w-auto"
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      onClick={() => handleRoute("/home/invite-loved-one")}
                      className="bg-white p-6 rounded-xl aspect-square flex flex-col items-center justify-center text-center subtle-shadow"
                    >
                      Invite Family or Friends
                      <Image
                        src={"/family.png"}
                        alt="add"
                        width={100}
                        height={100}
                        className="h-1/4 w-auto"
                      />
                    </div>
                  </Col>
                </Row>
              </div>

              <Modal
                title="Share your invite link"
                centered
                open={isModalOpen}
                onOk={handleOk}
                okText="Copy"
                onCancel={handleCancel}
              >
                <div className="space-y-2">
                  <p>Send this link to someone you'd like to invite:</p>
                  <Input
                    value={inviteLink}
                    addonAfter={<CopyOutlined />}
                    readOnly
                  />
                </div>
              </Modal>

              <Button
                size="large"
                type="primary"
                onClick={() => handleReset(1, "/")}
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
