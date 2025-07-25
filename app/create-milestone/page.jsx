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

const { Title } = Typography;
const { TextArea } = Input;

const CreateMilestone = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);

    const payload = {
      title: values.title,
      description: values.description,
      date: values.date.toISOString(),
      location: values.location || "",
      image: values.image?.fileList || [],
    };

    console.log("Milestone Data:", payload);
    // Simulate submit delay
    setTimeout(() => {
      message.success("Milestone created successfully!");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full p-6">
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
