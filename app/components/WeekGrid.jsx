// WeekGrid.jsx
"use client";
import React, { useMemo } from "react";

const WeekGrid = ({ stats, t }) => {
  const weekGrid = useMemo(() => {
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
        <h2 className="text-sm font-normal mb-4">{t("lifeInWeeksTitle")}</h2>
        <div className="flex flex-col">{rows}</div>
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
  }, [stats, t]);

  return weekGrid;
};

export default React.memo(WeekGrid);
