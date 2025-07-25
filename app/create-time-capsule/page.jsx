"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, DatePicker, Upload, Button, message } from "antd";
import {
  AudioFilled,
  AudioOutlined,
  CloseOutlined,
  InboxOutlined,
  PauseCircleFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { TextArea } = Input;

let lastFinalTranscript = ""; // outside the function (global within the component)

const CreateNewTimeCapsule = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef(null);
  const isRecognizing = useRef(false);

  const isMobile = () =>
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const autoPunctuate = (input) => {
    let result = input.trim();
    if (!/[.?!]$/.test(result)) result += ".";
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const initSpeechRecognition = () => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    // let lastFinalTranscript = "";

    // recognition.onresult = (event) => {
    //   let interim = "";
    //   let finalTranscript = "";

    //   for (let i = event.resultIndex; i < event.results.length; i++) {
    //     const result = event.results[i];
    //     const transcript = result[0].transcript.trim();

    //     if (result.isFinal) {
    //       finalTranscript += autoPunctuate(transcript) + " ";
    //     } else {
    //       if (!isMobile()) interim += transcript;
    //     }
    //   }

    //   if (
    //     finalTranscript.trim() &&
    //     finalTranscript.trim() !== lastFinalTranscript.trim()
    //   ) {
    //     setText((prev) => (prev + " " + finalTranscript.trim()).trim());
    //     lastFinalTranscript = finalTranscript.trim();
    //   }

    //   setInterimTranscript(interim);
    // };

    // recognition.onresult = (event) => {
    //   let finalTranscript = "";
    //   let interim = "";

    //   console.log("👂 New result event:", event.results);
    //   alert(`Event results before loop: ${event.results}`);

    //   for (let i = event.resultIndex; i < event.results.length; i++) {
    //     const result = event.results[i];
    //     const transcript = result[0].transcript.trim();
    //     const isFinal = result.isFinal;

    //     console.log(`Result ${i}:`, {
    //       transcript,
    //       isFinal,
    //     });

    //     alert(
    //       `Transcript in the loop: ${transcript} | Final in the loop: ${isFinal}`
    //     );

    //     if (isFinal) {
    //       finalTranscript += autoPunctuate(transcript) + " ";
    //     } else {
    //       if (!isMobile()) interim += transcript;
    //     }
    //   }

    //   if (finalTranscript.trim()) {
    //     console.log("✅ Final transcript:", finalTranscript);
    //     alert(`Final transcript after loop: ${finalTranscript}`);
    //     setText((prev) => (prev + " " + finalTranscript.trim()).trim());
    //   }

    //   setInterimTranscript(interim);
    // };

    // recognition.onresult = (event) => {
    //   let finalTranscript = "";
    //   let interim = "";

    //   for (let i = event.resultIndex; i < event.results.length; i++) {
    //     const result = event.results[i];
    //     const transcript = result[0].transcript.trim();
    //     const isFinal = result.isFinal;

    //     if (isFinal) {
    //       // Only handle if it's truly new (not a duplicate extension)
    //       if (!transcript.startsWith(lastFinalTranscript)) {
    //         lastFinalTranscript = transcript;
    //         finalTranscript += autoPunctuate(transcript) + " ";
    //       }
    //     } else {
    //       if (!isMobile()) interim += transcript;
    //     }
    //   }

    //   if (finalTranscript.trim()) {
    //     setText((prev) => (prev + " " + finalTranscript.trim()).trim());
    //   }

    //   setInterimTranscript(interim);
    // };

    const lastHandledRef = useRef("");

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript.trim();
        const isFinal = result.isFinal;

        if (isFinal) {
          if (transcript !== lastHandledRef.current) {
            lastHandledRef.current = transcript;
            finalTranscript += autoPunctuate(transcript) + " ";
          }
        } else {
          if (!isMobile()) interim += transcript;
        }
      }

      if (finalTranscript.trim()) {
        setText((prev) => (prev + " " + finalTranscript.trim()).trim());
      }

      setInterimTranscript(interim);
    };

    recognition.onend = () => {
      isRecognizing.current = false;
      setIsListening(false);
      setInterimTranscript("");
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      isRecognizing.current = false;
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  };

  const startListening = () => {
    if (!recognitionRef.current) initSpeechRecognition();
    if (isRecognizing.current) return;

    try {
      recognitionRef.current?.start();
      isRecognizing.current = true;
      setIsListening(true);
    } catch (e) {
      console.warn("Recognition already started:", e);
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      console.warn("Recognition already stopped:", e);
    }
    isRecognizing.current = false;
    setIsListening(false);
    setInterimTranscript("");
  };

  const clearText = () => {
    stopListening();
    setText("");
    setInterimTranscript("");
  };

  const handleFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Time capsule saved!");
      router.push("/time-capsules");
    }, 1000);
  };

  return (
    <div className="p-6 sm:w-1/2 w-full mx-auto">
      <p className="w-full mb-4 px-4 text-center text-sm font-medium text-gray-700">
        Capture a message for the future — write it, record it, or draw it.
      </p>

      <Form
        layout="vertical"
        size="large"
        form={form}
        onFinish={handleFinish}
        className="space-y-6"
      >
        <Form.Item
          label="Who is it from?"
          name="from"
          rules={[{ required: true, message: "Enter sender's name" }]}
        >
          <Input placeholder="e.g. Dad, Me, Future CEO" />
        </Form.Item>

        <Form.Item
          label="Who is it for?"
          name="to"
          rules={[{ required: true, message: "Enter recipient" }]}
        >
          <Input placeholder="e.g. Myself, My daughter, Future partner" />
        </Form.Item>

        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Enter a title" }]}
        >
          <Input placeholder="e.g. Lessons from 2025" />
        </Form.Item>

        <Form.Item
          label="Your Message"
          name="message"
          rules={[{ required: true, message: "Enter a message" }]}
          className="flex flex-col gap-2 text-sm w-full"
        >
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-md p-3 resize-none"
            placeholder="Type or speak your message here..."
          />
          {interimTranscript && (
            <p className="italic text-gray-500">
              Listening: {interimTranscript}
            </p>
          )}
          {isListening && (
            <div className="flex items-center gap-1 mt-2">
              <AudioFilled />
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-1 w-1 rounded-full bg-black animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          )}
          <div className="flex gap-2 mt-3">
            {!isListening ? (
              <Button
                htmlType="button"
                type="primary"
                icon={<AudioFilled />}
                onClick={startListening}
                className="px-4 py-2 bg-black text-white text-sm"
              >
                Speak
              </Button>
            ) : (
              <Button
                htmlType="button"
                danger
                type="primary"
                icon={<PauseCircleFilled />}
                onClick={stopListening}
                className="px-4 py-2 rounded bg-red-500 text-white text-sm"
              >
                Stop
              </Button>
            )}
            <Button
              htmlType="button"
              icon={<CloseOutlined />}
              type="default"
              onClick={clearText}
              className="px-4 py-2 rounded bg-gray-300 text-black text-sm"
            >
              Clear
            </Button>
          </div>
        </Form.Item>

        <Form.Item
          label="Unlock Date"
          name="unlockDate"
          rules={[{ required: true, message: "Select a date in the future" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current < dayjs().endOf("day")
            }
          />
        </Form.Item>

        <Form.Item label="Add an image (optional)" name="image">
          <Upload.Dragger
            accept="image/*"
            beforeUpload={() => false}
            maxCount={1}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag to upload image</p>
          </Upload.Dragger>
        </Form.Item>

        <Form.Item label="Add a voice message (optional)" name="audio">
          <Upload
            accept="audio/*"
            beforeUpload={() => false}
            maxCount={1}
            listType="text"
          >
            <Button
              className="w-full"
              type="default"
              htmlType="button"
              icon={<AudioOutlined />}
            >
              Upload Audio
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Save Capsule
          </Button>
        </Form.Item>
      </Form>

      {/* remove this debuging ui div */}
      <div className="mt-10 p-4 bg-gray-100 rounded text-sm text-gray-800">
        <p>
          <strong>Debug Logs</strong>
        </p>
        <p>
          <strong>Text:</strong> {text}
        </p>
        <p>
          <strong>Interim:</strong> {interimTranscript}
        </p>
      </div>

      <div className="text-2xl font-bold mt-8 text-center text-gray-700">
        <span className="opacity-50">From</span>{" "}
        <span className="text-black">You</span>
      </div>
    </div>
  );
};

export default CreateNewTimeCapsule;
