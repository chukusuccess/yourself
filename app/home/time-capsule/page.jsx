"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Drawer } from "antd";
import TimeCapsuleCard from "../../components/TimeCapsuleCard";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "@/app/contexts/AuthProvider";
import { LoadingScreen } from "@/app/components/LoadingScreen";
import Image from "next/image";
import { CapsuleService } from "@/app/services/capsule.service";
import dayjs from "dayjs";

const TimeCapsule = () => {
  const [capsules, setCapsules] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [lockedVisible, setLockedVisible] = useState(false);
  const { currentUser } = useAuth();

  const showDrawer = (date) => {
    const d = dayjs(date);
    const now = dayjs();

    const isFuture = d.isAfter(now, "day");
    if (isFuture) {
      setLockedVisible(true);
    } else {
      setModalVisible(true);
    }
  };
  const onClose = () => {
    setModalVisible(false);
    setLockedVisible(false);
  };

  const router = useRouter();

  useEffect(() => {
    const fetchCapsules = async () => {
      if (!currentUser) return;

      try {
        const data = await CapsuleService.listTimeCapsules(currentUser.id);
        setCapsules(data);
      } catch (err) {
        console.error("Error fetching capsules:", err);
      } finally {
        setLoading(false);
      }
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
                showDrawer(item.delivery_date);
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
          <span className="text-xs opacity-50">{selected?.delivery_date}</span>
          <span className="text-xs opacity-50 first-letter:uppercase">
            {/* name of sender */}
            from {selected?.sender_id}
          </span>
          <span className="text-xs opacity-50 first-letter:uppercase">
            {/* name of receiver */}
            to {selected?.is_private === true ? "Me" : "Others"}
          </span>
          <h1 className="text-xl text-black first-letter:uppercase">
            {selected?.title}
          </h1>
          <p className="opacity-60 text-xs first-letter:capitalize">
            {selected?.message}
          </p>
        </div>
      </Drawer>

      <Drawer
        title=""
        placement={"bottom"}
        size="large"
        onClose={onClose}
        open={lockedVisible}
      >
        <div className="w-full flex flex-col items-start justify-start gap-4">
          <h1 className="text-xl text-black first-letter:uppercase">
            This Message is still Locked.
          </h1>
          <p className="opacity-60 text-xs first-letter:capitalize">
            Wait until {selected?.delivery_date} to view.
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
