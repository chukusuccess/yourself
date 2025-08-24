"use client";
import { useEffect, useState } from "react";
import supabase from "../supabase";
import { genAI } from "../gemini";
import { getDaysInMonth } from "../resources/utils.js";
import { Type } from "@google/genai";

const generateAffirmations = async (days, context) => {
  const {
    username = "Cifer",
    tone = "poetic",
    theme = "self-worth",
    style = "reflective and deep",
  } = context;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate ${days} uplifting affirmations for a user.
      User's name: ${username}, tone: ${tone}, theme: ${theme}, style: ${style}`,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
        systemInstruction:
          "null means param isn't given. Personalize with the user’s name when given. Write in the chosen tone, style, and theme when given. Keep each affirmation unique. Do not repeat ideas. Avoid entitlement, arrogance, or unrealistic promises. Each affirmation should inspire action, faith, or reflection. Return JSON array of strings. Each array item is an affirmation (under 35 words).",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    const affirmations = JSON.parse(response.text); // 🔥 parse it

    if (!Array.isArray(affirmations)) {
      console.error("Invalid affirmations format:", affirmations);
      return [];
    }
    return affirmations;
  } catch (error) {
    console.error("Gemini fetch error:", error);
    return [];
  }
};

export function useDailyAffirmations(user) {
  const [affirmations, setAffirmations] = useState([]);
  const [currentAffirmation, setCurrentAffirmation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const today = new Date();
      const key = `${today.getFullYear()}-${today.getMonth() + 1}`;
      const day = today.getDate();

      // 1️⃣ Try localStorage
      let cached = JSON.parse(localStorage.getItem("affirmations") || "{}");

      if (cached[key]) {
        setAffirmations(cached[key]);
        setCurrentAffirmation(cached[key][day - 1]);
        setLoading(false);
        return;
      }

      // 2️⃣ Try Supabase
      const { data, error } = await supabase
        .from("affirmations")
        .select("list")
        .eq("month", key)
        .single();

      if (data?.list) {
        cached[key] = data.list;
        localStorage.setItem("affirmations", JSON.stringify(cached));
        setAffirmations(data.list);
        setCurrentAffirmation(data.list[day - 1]);
        setLoading(false);
        return;
      }

      // 3️⃣ Generate via AI
      const days = getDaysInMonth(today.getFullYear(), today.getMonth());
      const newList = await generateAffirmations(days, {
        username: "Cifer",
        tone: "poetic",
        theme: "self-worth",
        style: "reflective and deep",
      });

      // Save to Supabase
      await supabase
        .from("affirmations")
        .upsert([{ month: key, list: newList }]);

      cached[key] = newList;
      localStorage.setItem("affirmations", JSON.stringify(cached));

      setAffirmations(newList);
      setCurrentAffirmation(newList[day - 1]);
      setLoading(false);
    };

    init();
  }, []);

  // 🔄 Refresh (premium only)
  const refreshAffirmation = async () => {
    if (!user?.isPremium) return; // block freemium

    const today = new Date();
    const key = `${today.getFullYear()}-${today.getMonth() + 1}`;

    let cached = JSON.parse(localStorage.getItem("affirmations") || "{}");
    let list = cached[key] || affirmations;

    const currentIndex = list.indexOf(currentAffirmation);
    if (currentIndex < list.length - 1) {
      setCurrentAffirmation(list[currentIndex + 1]);
    } else {
      // exhausted → regenerate
      const days = getDaysInMonth(today.getFullYear(), today.getMonth());
      const newList = await generateAffirmations(days, {
        username: "Cifer",
        tone: "poetic",
        theme: "self-worth",
        style: "reflective and deep",
      });

      // Save
      cached[key] = newList;
      localStorage.setItem("affirmations", JSON.stringify(cached));
      await supabase
        .from("affirmations")
        .upsert([{ month: key, list: newList }]);

      setAffirmations(newList);
      setCurrentAffirmation(newList[0]);
    }
  };

  return { currentAffirmation, refreshAffirmation, loading };
}
