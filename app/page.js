"use client";
import { useState } from "react";

const TRANSLATIONS = {
  "en-US": {
    "pageTitle": "Yourself",
    "pageSubtitle": "A simple visualization to reflect on the passage of time",
    "birthDateQuestion": "Enter a birthdate",
    "visualizeButton": "Visualize your time",
    "startOverButton": "Start over",
    "lifeInWeeksTitle": "Your life in weeks",
    "weekHoverPast": " A week from your past",
    "weekHoverCurrent": " Your current week",
    "weekHoverFuture": " A week in your potential future",
    "legendPast": "Past",
    "legendPresent": "Present",
    "legendFuture": "Future",
    "lifeHighlightsTitle": "Life highlights",
    "lifeHighlightsWeeks": "You've lived",
    "lifeHighlightsWeeksEnd": "weeks, which is",
    "lifeHighlightsPercent": "of a full life.",
    "lifeHighlightsDays": "That's",
    "lifeHighlightsDaysEnd": "days of experience and approximately",
    "lifeHighlightsSeasonsEnd": "seasons observed.",
    "lifeHighlightsHeartbeats": "Your heart has beaten approximately",
    "lifeHighlightsHeartbeatsEnd": "times.",
    "lifeHighlightsBreaths": "You've taken around",
    "lifeHighlightsBreathsMiddle": "breaths and slept about",
    "lifeHighlightsBreathsEnd": "hours.",
    "societalContextTitle": "Societal context",
    "societalPopulation":
      "During your lifetime, humanity's population has grown from",
    "societalPopulationEnd": "to over",
    "societalPopulationFinal": "billion people.",
    "societalMeetings": "The average person will meet around",
    "societalMeetingsMiddle":
      "people in their lifetime. You've likely already met approximately",
    "societalMeetingsEnd": "individuals.",
    "societalBirthsDeaths":
      "Since your birth, humanity has collectively experienced approximately",
    "societalBirthsMiddle": "births and",
    "societalDeathsEnd": "deaths.",
    "cosmicPerspectiveTitle": "Cosmic perspective",
    "cosmicEarthTravel": "Since your birth, Earth has traveled approximately",
    "cosmicEarthTravelEnd": "kilometers through space around the Sun.",
    "cosmicUniverse": "The observable universe is about",
    "cosmicUniverseMiddle": "billion light-years across, meaning light takes",
    "cosmicUniverseMiddle2":
      "billion years to cross it. Your entire lifespan is just",
    "cosmicUniverseEnd": "of the universe's age.",
    "cosmicSolarSystem":
      "During your lifetime, our solar system has moved about",
    "cosmicSolarSystemEnd": "kilometers through the Milky Way galaxy.",
    "naturalWorldTitle": "Natural world",
    "naturalLunarCycles": "You've experienced approximately",
    "naturalLunarMiddle": "lunar cycles and",
    "naturalLunarEnd": "trips around the Sun.",
    "naturalSequoia":
      "A giant sequoia tree can live over 3,000 years. Your current age is",
    "naturalSequoiaEnd": "of its potential lifespan.",
    "naturalCells":
      "During your lifetime, your body has replaced most of its cells several times. You are not made of the same atoms you were born with.",
  },
};

const appLocale = "{{APP_LOCALE}}";
const browserLocale = navigator.languages?.[0] || navigator.language || "en-US";
const findMatchingLocale = (locale) => {
  if (TRANSLATIONS[locale]) return locale;
  const lang = locale.split("-")[0];
  const match = Object.keys(TRANSLATIONS).find((key) =>
    key.startsWith(lang + "-")
  );
  return match || "en-US";
};
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
  const [showHoverData, setShowHoverData] = useState(false);
  const [hoverWeek, setHoverWeek] = useState(null);

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

          let cellClass = "w-2 h-2 m-0.5 rounded-sm transition-all ";
          if (isPast) {
            cellClass += "bg-gray-800 ";
          } else if (isCurrent) {
            cellClass += "bg-blue-500 animate-pulse ";
          } else {
            cellClass += "bg-gray-200 ";
          }

          weekCells.push(
            <div
              key={weekNumber}
              className={cellClass}
              onMouseEnter={() => {
                setHoverWeek(weekNumber);
                setShowHoverData(true);
              }}
              onMouseLeave={() => setShowHoverData(false)}
            />
          );
        }
      }

      rows.push(
        <div key={row} className="flex">
          {weekCells}
        </div>
      );
    }

    return (
      <div className="mt-8 max-w-screen bg-white p-6 rounded-md shadow-sm">
        <h2 className="text-lg font-normal mb-4 text-gray-800">
          {t("lifeInWeeksTitle")}
        </h2>
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
            <div className="w-3 h-3 bg-gray-800 mr-2"></div>
            <span className="text-gray-600">{t("legendPast")}</span>
          </div>
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-blue-500 mr-2"></div>
            <span className="text-gray-600">{t("legendPresent")}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-200 mr-2"></div>
            <span className="text-gray-600">{t("legendFuture")}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderStats = () => {
    if (!stats) return null;

    return (
      <div className="max-w-screen mt-8 space-y-6">
        <div className="bg-white p-6 rounded-md shadow-sm">
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

        <div className="bg-white p-6 rounded-md shadow-sm">
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

        <div className="bg-white p-6 rounded-md shadow-sm">
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

        <div className="bg-white p-6 rounded-md shadow-sm">
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
  };

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen max-w-screen">
      <div className="bg-gray-50 min-h-screen pt-16">
        <div>
          <h1 className="text-2xl font-normal text-gray-800 mb-2">
            {t("pageTitle")}
          </h1>
          <p className="text-gray-600 mb-8">{t("pageSubtitle")}</p>

          {step === 1 ? (
            <div className="bg-white p-6 rounded-md shadow-sm">
              <h2 className="text-lg font-normal mb-4 text-gray-800">
                {t("birthDateQuestion")}
              </h2>
              <div>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 text-gray-800"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  required
                />
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
                  disabled={!birthdate}
                >
                  {t("visualizeButton")}
                </button>
              </div>
            </div>
          ) : (
            <>
              {renderWeekGrid()}
              {renderStats()}
              <button
                onClick={handleReset}
                className="mt-8 w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                {t("startOverButton")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
