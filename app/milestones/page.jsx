"use client";

import { useState } from "react";
import { Input, Card, Modal, Button, List, Typography, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MilestoneCard from "../components/MilestoneCard";

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;

const dummyMilestones = [
  {
    id: 1,
    title: "Graduation Day",
    date: "2020-07-20",
    description:
      "I graduated from university. Felt proud and scared of the future.",
    visibility: ["Mum", "Dad", "Tolu", "Sarah", "Ben"],
  },
  {
    id: 2,
    title: "First Kiss",
    date: "2016-02-14",
    description: "It was awkward but memorable, under the mango tree lol.",
    visibility: ["Tolu", "Sarah"],
  },
];

export default function MilestoneList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filtered = dummyMilestones.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 pb-20 w-full">
      <Search
        size="large"
        className="w-full"
        placeholder="Search milestones..."
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
        allowClear
      />

      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={filtered}
        renderItem={(item) => (
          <List.Item>
            <MilestoneCard
              title={item.title}
              description={item.description}
              date={item.date}
              onClick={() => {
                setSelected(item);
                setModalVisible(true);
              }}
            />
          </List.Item>
        )}
      />

      <Modal
        open={modalVisible}
        title={selected?.title}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <Space direction="vertical">
          <Text type="secondary">{selected?.date}</Text>
          <Paragraph>{selected?.description}</Paragraph>
          <Text strong>Visible to:</Text>
          <Text>
            {selected?.visibility?.slice(0, 3).join(", ")}
            {selected?.visibility?.length > 3 &&
              `, +${selected.visibility.length - 3} others`}
          </Text>
          <Button type="link">Manage who can see</Button>
        </Space>
      </Modal>

      <div className="w-full pr-8 flex item cneter justify-end mt-8 mb-10 fixed bottom-0 right-4">
        <div
          onClick={() => console.log("add milestone")}
          className="relative flex flex-row items-center justify-center"
        >
          <PlusOutlined className="absolute animate-ping rounded-full bg-white p-4 text-xs" />
          <PlusOutlined className="z-10 absolute rounded-full bg-white p-4 text-xl" />
        </div>
      </div>
    </div>
  );
}
