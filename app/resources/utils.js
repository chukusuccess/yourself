import { TRANSLATIONS } from "./constants";

export const findMatchingLocale = (locale) => {
  if (TRANSLATIONS[locale]) return locale;
  const lang = locale.split("-")[0];
  const match = Object.keys(TRANSLATIONS).find((key) =>
    key.startsWith(lang + "-")
  );
  return match || "en-US";
};

// utils/dateUtils.js
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate(); // Feb -> 28/29 auto handled
};
