// LifeStats.jsx
"use client";
import React from "react";
import PremiumAdCard from "./PremiumAdCard";

const getFormattedNumber = (num) => new Intl.NumberFormat().format(num);

const LifeStats = ({
  stats,
  t,
  getPopulationAtYear,
  getAverageBirthsPerDay,
  getAverageDeathsPerDay,
}) => {
  if (!stats) return null;

  return (
    <div className="max-w-screen mt-8 space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-normal mb-4 text-gray-800">
          {t("lifeHighlightsTitle")}
        </h2>
        <div className="space-y-4 text-xs">
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
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-normal mb-4 text-gray-800">
          {t("societalContextTitle")}
        </h2>
        <div className="space-y-4 text-xs">
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
          {t("emotionalMomentsTitle")}
        </h2>
        <div className="space-y-4 text-xs text-gray-600">
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
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-normal mb-4 text-gray-800">
          {t("reflectionTitle")}
        </h2>
        <div className="space-y-2 text-xs text-gray-600 italic">
          <p>{t("reflectionMemory")}</p>
          <p>{t("reflectionChoices")}</p>
          <p>{t("reflectionGrowth")}</p>
        </div>
      </div>

      {/* <PremiumAdCard /> */}
    </div>
  );
};

export default React.memo(LifeStats);
