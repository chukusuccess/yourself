"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  message,
  Switch,
  Select,
} from "antd";
import {
  AudioFilled,
  AudioOutlined,
  CalendarOutlined,
  CloseOutlined,
  DownOutlined,
  InboxOutlined,
  PauseCircleFilled,
  PictureOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuth } from "@/app/contexts/AuthProvider";
import { CapsuleService } from "@/app/services/capsule.service";
import { UserService } from "@/app/services/user.service";

const { TextArea } = Input;

const CreateNewTimeCapsule = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef(null);
  const isRecognizing = useRef(false);

  const [friends, setFriends] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [privateCapsule, setPrivateCapsule] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const { currentUser } = useAuth();

  // ✅ Fetch friends from DB
  useEffect(() => {
    const fetchFriends = async () => {
      if (!currentUser) return;
      const formatted = await UserService.listFriends(currentUser.id);

      setFriends(formatted);
    };

    fetchFriends();
  }, [currentUser]);

  // 🎤 Speech Recognition Setup (unchanged)
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
    recognition.interimResults = false;
    recognition.continuous = false;

    let lastFinalTranscript = "";

    recognition.onresult = (event) => {
      let interim = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript.trim();

        if (result.isFinal) {
          finalTranscript += autoPunctuate(transcript) + " ";
        } else {
          if (!isMobile()) interim += transcript;
        }
      }

      if (
        finalTranscript.trim() &&
        finalTranscript.trim() !== lastFinalTranscript.trim()
      ) {
        setText((prev) => (prev + " " + finalTranscript.trim()).trim());
        lastFinalTranscript = finalTranscript.trim();
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

  // ✅ Handle submit
  const handleFinish = async (values) => {
    if (!currentUser) {
      messageApi.error("You must be signed in to create a time capsule.");
      return;
    }

    setLoading(true);

    const { title, unlockDate } = values;

    // 👇 Decide private/fallback
    const effectivePrivate =
      privateCapsule || selectedRecipients.length === 0 ? true : false;

    try {
      const formData = {
        sender_id: currentUser.id,
        title,
        message: text,
        delivery_date: dayjs(unlockDate).format("YYYY-MM-DD"),
        is_private: effectivePrivate,
        audio_url: "",
        image_url: "",
      };

      const capsule = await CapsuleService.createTimeCapsule(
        formData,
        selectedRecipients
      );

      messageApi.success("Time capsule saved!");
      router.push("/home/time-capsule");
    } catch (err) {
      console.error("Error saving capsule:", err);
      messageApi.error("Failed to save capsule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const MAX_COUNT = 3;
  const suffix = (
    <>
      <span>
        {selectedRecipients.length} / {MAX_COUNT}
      </span>
      <DownOutlined />
    </>
  );

  return (
    <div className="p-6 sm:w-1/2 w-full mx-auto">
      {contextHolder}
      <p className="w-full mb-4 px-4 text-center text-sm font-medium text-gray-700">
        Send a message to your future self or others — write it, record it, or
        draw it.
      </p>

      <Form
        layout="vertical"
        size="large"
        form={form}
        onFinish={handleFinish}
        className="space-y-6"
      >
        <div className="bg-white p-6 mb-5 rounded-lg">
          <Form.Item
            label={
              <span className="text-lg font-semibold">
                <TeamOutlined /> Recipients
              </span>
            }
            name="to"
          >
            <div>
              <div className="w-full flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                  <span>Private Capsule</span>
                  <span className="opacity-30 text-xs">
                    Only deliver to yourself
                  </span>
                </div>
                <Switch
                  checked={privateCapsule}
                  onChange={() => setPrivateCapsule((prev) => !prev)}
                />
              </div>
              {!privateCapsule ? (
                <Select
                  mode="multiple"
                  maxCount={MAX_COUNT}
                  value={selectedRecipients}
                  style={{ width: "100%", marginTop: "24px" }}
                  suffixIcon={suffix}
                  placeholder="Please select"
                  options={friends}
                  maxTagCount={"responsive"}
                  onChange={(values) => setSelectedRecipients(values)}
                />
              ) : null}
            </div>
          </Form.Item>
        </div>

        <div className="bg-white p-6 mb-5 rounded-lg">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Enter a title" }]}
          >
            <Input placeholder="e.g. My thoughts for 2030" />
          </Form.Item>

          <Form.Item
            label="Your Message"
            // name="message"
            // rules={[{ required: true, message: "Enter a message" }]}
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
        </div>

        <div className="bg-white p-6 mb-5 rounded-lg">
          <Form.Item
            label={
              <span className="text-lg font-semibold">
                <CalendarOutlined /> Delivery Date
              </span>
            }
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
        </div>

        <div className="bg-white p-6 mb-5 rounded-lg">
          <Form.Item
            label={
              <span className="text-lg font-semibold">
                <PictureOutlined /> Attachments
              </span>
            }
            name="image"
          >
            <p className="mb-2">Add an image (optional)</p>
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
                Include Voice Note
              </Button>
            </Upload>
          </Form.Item>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
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
