"use client";
import React, { useState, useRef } from "react";

const SpeechToTextTextarea = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef(null);

  const initSpeechRecognition = () => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += autoPunctuate(transcript.trim()) + " ";
        } else {
          interim += transcript;
        }
      }

      if (finalTranscript) {
        setText((prev) => (prev + " " + finalTranscript).trim());
      }
      setInterimTranscript(interim);
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  };

  const autoPunctuate = (input) => {
    // Very naive auto-punctuation
    let result = input.trim();
    if (!/[.?!]$/.test(result)) result += ".";
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const startListening = () => {
    if (!recognitionRef.current) initSpeechRecognition();
    recognitionRef.current.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimTranscript("");
  };

  const clearText = () => {
    stopListening();
    setText("");
    setInterimTranscript("");
  };

  return (
    <div className="flex flex-col gap-2 text-sm w-full">
      <label className="text-gray-600 font-medium">Your Message</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="w-full border border-gray-300 rounded-md p-3 resize-none"
        placeholder="Type or speak your message here..."
      />
      {interimTranscript && (
        <p className="italic text-gray-500">Listening: {interimTranscript}</p>
      )}
      {isListening && (
        <div className="flex gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-4 w-1 bg-blue-500 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}
      <div className="flex gap-2 mt-3">
        {!isListening ? (
          <button
            onClick={startListening}
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
          >
            🎙️ Start Speaking
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="px-4 py-2 rounded bg-red-500 text-white text-sm"
          >
            ⏹ Stop Listening
          </button>
        )}
        <button
          onClick={clearText}
          className="px-4 py-2 rounded bg-gray-300 text-black text-sm"
        >
          ❌ Clear
        </button>
      </div>
    </div>
  );
};

export default SpeechToTextTextarea;
