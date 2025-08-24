// WeekGrid.jsx
"use client";
import { CalendarOutlined } from "@ant-design/icons";
import { Progress } from "antd";
import React, { useMemo } from "react";

const WeekGrid = ({ stats, t }) => {
  const weekGrid = useMemo(() => {
    if (!stats) return null;

    const rows = [];
    const weeksPerRow = 52;
    const totalRows = Math.ceil(stats.totalWeeks / weeksPerRow);

    const percentLived = Math.floor(
      (stats.weeksLived / stats.totalWeeks) * 100
    );

    for (let row = 0; row < totalRows; row++) {
      const weekCells = [];
      for (let col = 0; col < weeksPerRow; col++) {
        const weekNumber = row * weeksPerRow + col;
        if (weekNumber < stats.totalWeeks) {
          const isPast = weekNumber < stats.weeksLived;
          const isCurrent = weekNumber === stats.weeksLived;

          let cellClass = "w-1 h-1 mb-0.25 rounded-full ";
          if (isPast) cellClass += "bg-gray-800 ";
          else if (isCurrent)
            cellClass += "bg-blue-500 scale-200 animate-pulse";
          else cellClass += "bg-gray-200 ";

          weekCells.push(<div key={weekNumber} className={cellClass} />);
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
        <div className="flex flex-col w-full items-center justify-center gap-5">
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold">{stats.weeksLived}</h2>
              <span className="text-xs">weeks lived</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold">
                {stats.totalWeeks - stats.weeksLived}
              </h2>
              <span className="text-xs">weeks left</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold">
                {Math.floor(stats.weeksLived / 52)}
              </h2>
              <span className="text-xs">years old</span>
            </div>
          </div>
          <div className="w-full mb-5">
            <span className="text-xs opacity-50">
              you have lived {percentLived}% of the average human life span
            </span>
            <Progress
              status="active"
              percent={percentLived}
              strokeColor={"#000000"}
            />
          </div>
        </div>
        <h2 className="text-sm font-normal mb-4">{t("lifeInWeeksTitle")}</h2>
        <div className="flex flex-col">{rows}</div>
        <div className="mt-4 text-xs ">
          <CalendarOutlined /> Each dot = 1 week
        </div>
        <div className="flex mt-2 text-sm">
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
  }, [stats, t]);

  return weekGrid;
};

export default React.memo(WeekGrid);
