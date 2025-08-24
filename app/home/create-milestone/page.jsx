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
import {
  BulbOutlined,
  PictureOutlined,
  PlusOutlined,
  TrophyOutlined,
  UploadOutlined,
} from "@ant-design/icons";
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

    const formData = await values;

    const selectedDate = dayjs(values.date);

    const payload = {
      // user_id: currentUser.id,
      title: formData.title,
      description: formData.description,
      milestone_date: selectedDate.format("YYYY-MM-DD"), // matches column type
      location: formData.location || "",
      image_url: "",
      reflection: formData.reflection || "",
    };

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
      <Title level={4}>Create a New Milestone</Title>
      <Form
        size="large"
        className="w-full"
        layout="vertical"
        onFinish={onFinish}
      >
        <div className="bg-white p-6 mb-5 rounded-lg">
          <Form.Item
            name="title"
            label={
              <span className="text-lg font-semibold">
                <TrophyOutlined /> Milestone Title
              </span>
            }
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Got promoted, First kiss, etc." />
          </Form.Item>

          <Form.Item
            name="description"
            label="Goal / Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea
              rows={3}
              placeholder="Describe what happened and why it's important..."
            />
          </Form.Item>

          <div className="w-full flex items-center gap-5">
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select a date" }]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="location" label="Location">
              <Input placeholder="e.g. Lagos, Nigeria" />
            </Form.Item>
          </div>
        </div>

        <div className="bg-white p-6 mb-5 rounded-lg">
          <Form.Item
            name="image"
            label={
              <span className="text-lg font-semibold">
                <PictureOutlined /> Photo (optional)
              </span>
            }
          >
            <Upload beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>
        </div>

        <div className="bg-white p-6 mb-5 rounded-lg">
          <Form.Item
            name="reflection"
            label={
              <span className="text-lg font-semibold">
                <BulbOutlined /> Personal Reflection
                <br />
                <p className="text-xs font-normal w-full mb-1">
                  How did this impact your life?
                </p>
              </span>
            }
          >
            <TextArea
              rows={3}
              placeholder="Reflect on the lessons learnt, emotions felt, and how this milestone changed you..."
            />
          </Form.Item>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            loading={loading}
            block
          >
            Create Milestone
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateMilestone;
