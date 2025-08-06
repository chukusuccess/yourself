"use client";

import { useState, useEffect } from "react";
import supabase from "@/app/supabase";
import { useAuth } from "@/app/contexts/AuthProvider";
import { Input, Button, Switch, Select, message, Form, Radio } from "antd";
import {
  UsergroupAddOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

export default function CreateHabitPage() {
  //   const supabase = useSupabaseClient();
  const { currentUser } = useAuth();
  const [isHabit, setIsHabit] = useState(true);
  const [useGPS, setUseGPS] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [witnesses, setWitnesses] = useState([]);
  const [familyList, setFamilyList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const fetchFamily = async () => {
    const { data, error } = await supabase
      .from("friends")
      .select("id, name")
      .eq("user_id", currentUser.id);

    if (error) {
      messageApi.error("Failed to fetch family");
    } else {
      setFamilyList(data);
    }
  };

  useEffect(() => {
    if (currentUser) fetchFamily();
  }, [currentUser]);

  const handleSubmit = async () => {
    if (!title.trim()) return messageApi.warning("Please enter a title");

    setLoading(true);

    const id = await currentUser.id;

    const { data: habit, error } = await supabase
      .from("habits")
      .insert({
        user_id: id,
        title,
        description,
        type: isHabit ? "habit" : "addiction",
        witness_required: witnesses.length > 0,
      })
      .select()
      .single();

    if (error) {
      messageApi.error("Failed to create");
      setLoading(false);
      return;
    }

    if (witnesses.length > 0) {
      const witnessRows = witnesses.map((wid) => ({
        habit_id: habit.id,
        witness_id: wid,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
      }));
      await supabase.from("habit_witnesses").insert(witnessRows);
    }

    messageApi.success(`${isHabit ? "Habit" : "Addiction"} created!`);
    setTitle("");
    setDescription("");
    setWitnesses([]);
    setLoading(false);
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
            defaultValue="habit"
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
                <Option key={fam.id} value={fam.id} label={fam.name}>
                  {fam.name}
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
