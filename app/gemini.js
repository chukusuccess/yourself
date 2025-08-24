// lib/gemini.js
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI;

if (!apiKey) {
  throw new Error("Gemini API key is missing. Add it to .env.local");
}

export const genAI = new GoogleGenAI({ apiKey: apiKey });
