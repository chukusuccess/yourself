"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Drawer } from "antd";
import TimeCapsuleCard from "../../components/TimeCapsuleCard";
import { PlusOutlined } from "@ant-design/icons";
import supabase from "@/app/supabase";
import { useAuth } from "@/app/contexts/AuthProvider";
import { LoadingScreen } from "@/app/components/LoadingScreen";
import Image from "next/image";

const TimeCapsule = () => {
  const [capsules, setCapsules] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const { currentUser } = useAuth();

  const showDrawer = () => {
    setModalVisible(true);
  };
  const onClose = () => {
    setModalVisible(false);
  };

  const router = useRouter();

  useEffect(() => {
    const fetchCapsules = async () => {
      if (!currentUser) return;

      const { data, error } = await supabase
        .from("time_capsules")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching capsules:", error.message);
      } else {
        setCapsules(data);
      }

      setLoading(false);
    };

    fetchCapsules();
  }, [currentUser]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-6 w-full">
      <p className="w-full mb-4 px-8 text-center text-xs font-semibold">
        Messages from you to your future self
      </p>
      {!capsules.length && (
        <p className="text-center text-gray-300 text-2xl">
          You haven’t created any time capsules yet.
        </p>
      )}
      <div className="space-y-4 text-xs font-normal flex flex-col relative noscroll h-[75vh] sm:h-full pb-16 w-full">
        {capsules.map((item, index) => {
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="w-full"
              onClick={() => {
                setSelected(item);
                showDrawer();
              }}
            >
              <TimeCapsuleCard key={index} capsule={item} />
            </motion.div>
          );
        })}
      </div>

      <Drawer
        title=""
        placement={"bottom"}
        size="large"
        onClose={onClose}
        open={modalVisible}
      >
        <div className="w-full flex flex-col items-start justify-start gap-4">
          <Image
            src={"/defaultforest.jpg"}
            width={1000}
            height={1000}
            quality={100}
            alt="mtn"
            className="rounded-xl"
          />
          <span className="text-xs opacity-50">{selected?.unlock_date}</span>
          <span className="text-xs opacity-50 first-letter:uppercase">
            {/* name of sender */}
            from {selected?.user_id}
          </span>
          <span className="text-xs opacity-50 first-letter:uppercase">
            {/* name of receiver */}
            to {selected?.to_name}
          </span>
          <h1 className="text-xl text-black first-letter:uppercase">
            {selected?.title}
          </h1>
          <p className="opacity-60 text-xs first-letter:capitalize">
            {selected?.content}
          </p>
        </div>
      </Drawer>

      <div className="w-full pr-8 flex item cneter justify-end mt-8 mb-10 fixed bottom-0 right-4 z-50">
        <div
          onClick={() => router.push("/home/create-time-capsule")}
          className="relative flex flex-row items-center justify-center"
        >
          <PlusOutlined className="absolute animate-ping rounded-full bg-white p-4 text-xs" />
          <PlusOutlined className="z-10 absolute rounded-full bg-white p-4 text-xl shadow-lg" />
        </div>
      </div>
    </div>
  );
};

export default TimeCapsule;
