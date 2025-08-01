"use client";

import { useState, useEffect } from "react";
import supabase from "@/app/supabase";
import { useAuth } from "@/app/contexts/AuthProvider";
import { Input, Button, Switch, Select, message, Tooltip, Form } from "antd";
import { UsergroupAddOutlined, PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

export default function CreateHabitPage() {
  //   const supabase = useSupabaseClient();
  const { currentUser } = useAuth();
  const [isHabit, setIsHabit] = useState(true);
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
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold h-20 text-center">
          {isHabit
            ? "Build a Habit"
            : "What Addiction are you trying to break?"}
        </h1>
        <div className="flex items-center gap-2">
          <span>Habit</span>
          <Switch
            checked={!isHabit}
            onChange={() => setIsHabit((prev) => !prev)}
          />
          <span>Addiction</span>
        </div>
      </div>
      <Form layout="vertical" className="w-full flex flex-col" size="large">
        <Form.Item
          label="Title"
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

        <Form.Item label="Description">
          <TextArea
            size="large"
            rows={4}
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-4"
          />
        </Form.Item>

        <Form.Item
          label="Add Witnesses (optional)"
          tooltip="Witnesses must confirm your habit daily before streaks count. If none added, you are your own witness."
        >
          <Select
            size="large"
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Select witnesses from your family"
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
        </Form.Item>

        <Button
          size="large"
          type="primary"
          icon={<PlusOutlined />}
          loading={loading}
          onClick={handleSubmit}
          className="w-full"
        >
          {isHabit ? "Add Habit" : "Add Addiction"}
        </Button>
      </Form>
    </div>
  );
}
