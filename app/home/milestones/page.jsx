"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Card, Modal, Button, List, Typography, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MilestoneCard from "../../components/MilestoneCard";
import supabase from "@/app/supabase";
import { useAuth } from "@/app/contexts/AuthProvider";
import { LoadingScreen } from "@/app/components/LoadingScreen";

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;

export default function MilestoneList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const router = useRouter();

  useEffect(() => {
    const fetchMilestones = async () => {
      if (!currentUser) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("milestone_date", { ascending: true });

      if (error) {
        console.error("Error fetching milestones:", error.message);
      } else {
        setMilestones(data);
      }

      setLoading(false);
    };

    fetchMilestones();
  }, [currentUser]);

  const filtered = milestones.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-6 pb-20 w-full">
      <Search
        variant="filled"
        size="large"
        className="w-full bg-white rounded-full subtle-shadow "
        placeholder="Search milestones..."
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
        allowClear
      />

      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={filtered}
        renderItem={(item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="w-full"
          >
            <List.Item>
              <MilestoneCard
                title={item.title}
                description={item.description}
                date={item.milestone_date}
                onClick={() => {
                  setSelected(item);
                  setModalVisible(true);
                }}
              />
            </List.Item>
          </motion.div>
        )}
      />

      <Modal
        open={modalVisible}
        title={selected?.title}
        centered
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

      <div className="w-full pr-8 flex item cneter justify-end mt-8 mb-10 fixed bottom-0 right-4 z-50">
        <div
          onClick={() => router.push("/home/create-milestone")}
          className="relative flex flex-row items-center justify-center"
        >
          <PlusOutlined className="absolute animate-ping rounded-full bg-white p-4 text-xs shadow-lg" />
          <PlusOutlined className="z-10 absolute rounded-full bg-white p-4 text-xl" />
        </div>
      </div>
    </div>
  );
}
