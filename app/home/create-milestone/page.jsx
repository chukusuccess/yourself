"use client";

import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Upload,
  message,
  Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import supabase from "@/app/supabase";
import { useAuth } from "@/app/contexts/AuthProvider";

const { Title } = Typography;
const { TextArea } = Input;

const CreateMilestone = () => {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);

    if (!currentUser) {
      messageApi.error("You must be logged in.");
      setLoading(false);
      return;
    }

    const selectedDate = dayjs(values.date);
    const now = dayjs();

    const payload = {
      user_id: currentUser.id,
      title: values.title,
      description: values.description,
      milestone_date: selectedDate.toISOString(),
      location: values.location || "",
    };

    // Only include is_future if the selected date is in the future
    if (selectedDate.isAfter(now)) {
      payload.is_future = true;
    }

    console.log("Milestone Data:", payload);

    const { error } = await supabase.from("milestones").insert(payload);

    if (error) {
      messageApi.error("Error creating milestone: " + error.message);
    } else {
      messageApi.success("Milestone created successfully!");
    }

    setLoading(false);
  };

  return (
    <div className="w-full p-6">
      {contextHolder}
      <Title level={3}>Create a New Milestone</Title>
      <Form
        size="large"
        className="w-full"
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="e.g. First Kiss, 10000th Day" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Goal / Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <TextArea
            rows={3}
            placeholder="Write about what this milestone means..."
          />
        </Form.Item>

        <Form.Item
          name="date"
          label="Date & Time"
          rules={[{ required: true, message: "Please select a date and time" }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item name="location" label="Location (optional)">
          <Input placeholder="e.g. Lagos, Nigeria" />
        </Form.Item>

        <Form.Item name="image" label="Image (optional)">
          <Upload beforeUpload={() => false} listType="picture">
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create Milestone
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateMilestone;
