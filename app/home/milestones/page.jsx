"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Drawer, List, Typography, Space } from "antd";
import { PlusOutlined, ShareAltOutlined } from "@ant-design/icons";
import MilestoneCard from "../../components/MilestoneCard";
import supabase from "@/app/supabase";
import { useAuth } from "@/app/contexts/AuthProvider";
import { LoadingScreen } from "@/app/components/LoadingScreen";
import Image from "next/image";

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

  const showDrawer = () => {
    setModalVisible(true);
  };
  const onClose = () => {
    setModalVisible(false);
  };

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
        className="w-full bg-white rounded-md subtle-shadow"
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
                  showDrawer();
                }}
              />
            </List.Item>
          </motion.div>
        )}
      />

      <Drawer
        title=""
        placement={"bottom"}
        size="large"
        onClose={onClose}
        open={modalVisible}
      >
        <div className="w-full flex flex-col items-start justify-start gap-4">
          <Image
            src={"/defaultmountain.jpg"}
            width={1000}
            height={1000}
            quality={100}
            alt="mtn"
            className="rounded-xl"
          />
          <span className="text-xs opacity-50">{selected?.milestone_date}</span>
          <span className="text-xs opacity-50 first-letter:uppercase">
            in {selected?.location}
          </span>
          <h1 className="text-xl capitalize text-black">{selected?.title}</h1>
          <p className="opacity-60 text-xs first-letter:capitalize">
            {selected?.description}
          </p>
          <div className="w-full flex items-center justify-center opacity-60">
            <hr className="w-full" />
            <span className="flex items-center justify-center w-full text-xs">
              My reflection
            </span>
            <hr className="w-full" />
          </div>
          <p className="opacity-80 text-xs italic first-letter:capitalize">
            {selected?.reflection}
          </p>
        </div>
      </Drawer>

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
