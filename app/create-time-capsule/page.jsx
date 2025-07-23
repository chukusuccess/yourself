"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button, DatePicker, Form, Input } from "antd";

const CreateNewTimeCapsule = () => {
  const router = useRouter();
  return (
    <div className="p-6 sm:w-1/3 w-full">
      <p className="w-full mb-4 px-8 text-center text-xs font-semibold">
        Capture a past moment for the future.
      </p>
      <div className="space-y-4 text-xs text-white font-normal flex flex-col relative overflow-y-auto noscroll h-[75vh] sm:h-full pb-16 w-full">
        <Form size="large" layout="vertical">
          <Form.Item label="Title" name="title">
            <Input placeholder="What's this about?" />
          </Form.Item>
          <Form.Item label="Message to future self" name="message">
            <Input.TextArea rows={5} placeholder="Dear future me..." />
          </Form.Item>
          <Form.Item label="When should it unlock?" name="unlockDate">
            <DatePicker className="w-full" />
          </Form.Item>
          <Button type="primary" block>
            Save Capsule
          </Button>
        </Form>
      </div>

      <div className="flex flex-col gap-2 fixed bottom-10 text-4xl font-bold bg-[#f0f0f0] pt-6 w-full">
        <span className="opacity-50">Write a</span>
        <span>Message.</span>
      </div>
    </div>
  );
};

export default CreateNewTimeCapsule;
