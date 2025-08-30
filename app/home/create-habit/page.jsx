"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthProvider";
import { Input, Button, Switch, Select, message, Form, Radio } from "antd";
import {
  UsergroupAddOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { UserService } from "@/app/services/user.service";
import { HabitService } from "@/app/services/habit.service";

const { TextArea } = Input;
const { Option } = Select;

export default function CreateHabitPage() {
  const { currentUser } = useAuth();
  const [isHabit, setIsHabit] = useState(true);
  const [useGPS, setUseGPS] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [witnesses, setWitnesses] = useState([]);
  const [familyList, setFamilyList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const fetchFriends = async () => {
    try {
      const list = await UserService.listFriends(currentUser?.id);
      setFamilyList(list);
    } catch (err) {
      messageApi.error("Failed to fetch family");
    }
  };

  useEffect(() => {
    if (currentUser) fetchFriends();
  }, [currentUser]);

  const handleSubmit = async () => {
    if (!title.trim()) return messageApi.warning("Please enter a title");
    if (!currentUser?.id) return;

    setLoading(true);

    try {
      await HabitService.createHabit(
        {
          user_id: currentUser.id,
          title,
          description,
          type: isHabit ? "habit" : "addiction",
          location_based: useGPS,
        },
        witnesses
      );

      messageApi.success(`${isHabit ? "Habit" : "Addiction"} created!`);
      setTitle("");
      setDescription("");
      setWitnesses([]);
    } catch (err) {
      console.error(err);
      messageApi.error("Failed to create");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 mx-auto px-4 py-10">
      {contextHolder}
      <div className="w-full flex flex-col">
        <h1 className="text-xl font-bold h-20 text-center">
          {isHabit
            ? "Build a Habit"
            : "What Addiction are you trying to break?"}
        </h1>
        <div className="w-full flex items-center gap-2">
          <Radio.Group
            block
            size="large"
            options={[
              { label: "Build Habit", value: true },
              { label: "Break Addiction", value: false },
            ]}
            value={isHabit}
            checked={!isHabit}
            onChange={(e) => setIsHabit(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            className="w-full text-sm"
          />
        </div>
      </div>
      <Form layout="vertical" className="w-full flex flex-col" size="large">
        <div className="bg-white p-6 mb-5 rounded-lg">
          <Form.Item
            label={
              <span className="text-lg font-semibold">
                <EditOutlined /> Title
              </span>
            }
            rules={[
              {
                required: true,
                message: "Please input a title!",
                whitespace: true,
              },
            ]}
          >
            <Input
              size="large"
              placeholder={
                isHabit
                  ? "e.g. Drink 8 glasses of water 💧"
                  : "e.g. Quit smoking 🚭"
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-4"
            />
          </Form.Item>

          <Form.Item label="Description (optional)">
            <TextArea
              size="large"
              rows={4}
              placeholder="Describe your goals and motivations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mb-4"
            />
          </Form.Item>
        </div>

        <div className="bg-white p-6 mb-5 rounded-lg">
          <Form.Item
            label={
              <span className="text-lg font-semibold">
                <UsergroupAddOutlined /> Witnesses (optional)
              </span>
            }
            tooltip="Witnesses must confirm your habit daily before streaks count. If none added, you are your own witness."
          >
            <Select
              size="large"
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select witnesses from your friend group"
              value={witnesses}
              onChange={setWitnesses}
              className="mb-6"
              optionLabelProp="label"
            >
              {familyList.map((fam) => (
                <Option key={fam.value} value={fam.value} label={fam.label}>
                  {fam.label}
                </Option>
              ))}
            </Select>
            <span className="opacity-30 text-xs">
              Witnesses will verify your progress and help keep you accountable
            </span>
          </Form.Item>
        </div>

        <div className="bg-white p-6 mb-5 rounded-lg">
          <Form.Item
            label={
              <span className="text-lg font-semibold">
                <EnvironmentOutlined /> Location Verification
              </span>
            }
          >
            <div className="w-full flex items-center justify-between">
              <div className="flex flex-col space-y-2">
                <span>Require GPS Verification</span>
                <span className="opacity-30 text-xs">
                  Verify location for habits like gym visits
                </span>
              </div>
              <Switch
                checked={false}
                value={useGPS}
                onChange={() => setUseGPS((prev) => !prev)}
              />
            </div>
          </Form.Item>
        </div>

        <Button
          size="large"
          type="primary"
          icon={<PlusOutlined />}
          loading={loading}
          onClick={handleSubmit}
          className="w-full"
        >
          {isHabit ? "Create Habit" : "Create Addiction"}
        </Button>
      </Form>
    </div>
  );
}
