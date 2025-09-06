"use client";
import { useEffect, useState } from "react";
import { genAI } from "../gemini";
import { getDaysInMonth } from "../resources/utils.js";
import { Type } from "@google/genai";
import { AffirmationService } from "../services/affirmation.service";

const generateAffirmations = async (days, context) => {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate ${days} uplifting affirmations for a user.
      User's name: ${context.username || "not provided"}, 
      tone: ${context.tone}, theme: ${context.theme}, style: ${context.style}.`,

      config: {
        systemInstruction: `
          - Always write affirmations in the FIRST PERSON ("I" statements), as if the user is speaking.
          - Do NOT address the user by name directly (e.g., avoid "Benjamin, I ...").
          - If a name is provided, subtly let it guide tone/personality, feel free to include the name if you like but do it in a FIRST PERSON perspective.
          - Each affirmation must be unique and not repeat ideas.
          - Avoid entitlement, arrogance, or unrealistic promises.
          - Each affirmation should inspire action, faith, gratitude, or reflection.
          - Return ONLY a JSON array of strings, each under 50 words.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });

    const affirmations = JSON.parse(response.text);
    if (!Array.isArray(affirmations)) return [];
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

      const username = localStorage.getItem("username") || "";
      const userId = localStorage.getItem("user_id") || "guest";

      // 1️⃣ localStorage
      let cached = JSON.parse(localStorage.getItem("affirmations") || "{}");
      if (cached[key]) {
        setAffirmations(cached[key]);
        setCurrentAffirmation(cached[key][day - 1]);
        setLoading(false);
        return;
      }

      // 2️⃣ Appwrite
      try {
        const docs = await AffirmationService.listAffirmations(userId);
        const monthDoc = docs.find((d) => d.month === key);
        if (monthDoc?.list) {
          cached[key] = monthDoc.list;
          localStorage.setItem("affirmations", JSON.stringify(cached));
          setAffirmations(monthDoc.list);
          setCurrentAffirmation(monthDoc.list[day - 1]);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("AffirmationService.listAffirmations error:", err);
      }

      // 3️⃣ Generate via AI
      const days = getDaysInMonth(today.getFullYear(), today.getMonth());
      const newList = await generateAffirmations(days, {
        username,
        tone: "biblical",
        theme: "faith",
        style: "uplifting",
      });

      try {
        await AffirmationService.createAffirmations({
          user_id: userId,
          month: key,
          days,
          list: newList,
        });
      } catch (err) {
        console.error("AffirmationService.createAffirmations error:", err);
      }

      cached[key] = newList;
      localStorage.setItem("affirmations", JSON.stringify(cached));

      setAffirmations(newList);
      setCurrentAffirmation(newList[day - 1]);
      setLoading(false);
    };

    init();
  }, []);

  const refreshAffirmation = async () => {
    if (!user?.isPremium) return;

    const today = new Date();
    const key = `${today.getFullYear()}-${today.getMonth() + 1}`;
    const userId = localStorage.getItem("user_id") || "guest";
    const username = localStorage.getItem("username") || "";

    let cached = JSON.parse(localStorage.getItem("affirmations") || "{}");
    let list = cached[key] || affirmations;

    const currentIndex = list.indexOf(currentAffirmation);
    if (currentIndex < list.length - 1) {
      setCurrentAffirmation(list[currentIndex + 1]);
    } else {
      const days = getDaysInMonth(today.getFullYear(), today.getMonth());
      const newList = await generateAffirmations(days, {
        username,
        tone: "biblical",
        theme: "faith",
        style: "uplifting",
      });

      try {
        await AffirmationService.createAffirmations({
          user_id: userId,
          month: key,
          days,
          list: newList,
        });
      } catch (err) {
        console.error("AffirmationService.createAffirmations error:", err);
      }

      cached[key] = newList;
      localStorage.setItem("affirmations", JSON.stringify(cached));

      setAffirmations(newList);
      setCurrentAffirmation(newList[0]);
    }
  };

  return { currentAffirmation, refreshAffirmation, loading };
}
