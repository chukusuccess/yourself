"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, DatePicker, Upload, Button, message } from "antd";
import {
  AudioFilled,
  AudioOutlined,
  CloseOutlined,
  CloseSquareFilled,
  InboxOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { TextArea } = Input;

const CreateNewTimeCapsule = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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

  const handleFinish = (values) => {
    setLoading(true);
    // Simulate saving to backend
    setTimeout(() => {
      setLoading(false);
      message.success("Time capsule saved!");
      router.push("/time-capsules");
    }, 1000);
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (!isListening) {
      recognition.start();
      setIsListening(true);
    } else {
      recognition.stop();
      setIsListening(false);
    }
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
                className="px-4 py-2 rounded bg-black text-white text-sm"
              >
                Speak
              </Button>
            ) : (
              <Button
                htmlType="button"
                type="primary"
                icon={<CloseOutlined />}
                onClick={stopListening}
                className="px-4 py-2 rounded bg-red-500 text-white text-sm"
              >
                Stop
              </Button>
            )}
            <Button
              htmlType="button"
              type="default"
              onClick={clearText}
              className="px-4 py-2 rounded bg-gray-300 text-black text-sm"
            >
              ❌ Clear
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
            beforeUpload={() => false} // prevent automatic upload
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
            <Button type="default" htmlType="button" icon={<AudioOutlined />}>
              Upload Audio
            </Button>
          </Upload>
        </Form.Item>

        {/* Future: Audio-to-text conversion area can be added here */}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Capsule
          </Button>
        </Form.Item>
      </Form>

      <div className="text-2xl font-bold mt-8 text-center text-gray-700">
        <span className="opacity-50">From</span>{" "}
        <span className="text-black">You</span>
      </div>
    </div>
  );
};

export default CreateNewTimeCapsule;
