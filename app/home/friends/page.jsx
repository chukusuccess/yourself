"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Modal, List, message, Empty, Avatar } from "antd";
import { CopyOutlined, PlusOutlined } from "@ant-design/icons";
import supabase from "@/app/supabase";
import { useAuth } from "@/app/contexts/AuthProvider";
import { LoadingScreen } from "@/app/components/LoadingScreen";

const { Search } = Input;

export default function FriendsAndFamily() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviter, setInviter] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const { currentUser } = useAuth();

  const router = useRouter();
  const searchParams = useSearchParams();

  const refCode = searchParams.get("ref");

  const showModal = () => {
    setIsInviteModalOpen(true);
  };

  const handleCancel = () => {
    setIsInviteModalOpen(false);
  };

  const handleOk = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      messageApi.success("Link copied to clipboard!");
      setIsInviteModalOpen(false);
    } catch (err) {
      messageApi.error("Failed to copy.");
    }
  };

  useEffect(() => {
    const fetchFriends = async () => {
      if (!currentUser?.id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("friends")
        .select("*")
        .eq("user_id", currentUser?.id)
        .order("created_at", { ascending: false });

      if (error) {
        messageApi.error("Unable to fetch friends.");
      } else {
        setFriends(data);
      }

      setLoading(false);
    };

    const fetchRefCode = async () => {
      if (!currentUser) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("ref_code")
        .eq("id", currentUser.id)
        .single();

      if (error) {
        console.error("Error fetching ref_code:", error);
        messageApi.error("Could not load invite link.");
      } else {
        const url = `https://yourself-virid.vercel.app/home/friends?ref=${data.ref_code}`;
        setInviteLink(url);
      }

      setLoading(false);
    };

    if (isInviteModalOpen) {
      fetchRefCode();
    }

    fetchFriends();
  }, [isInviteModalOpen, currentUser]);

  // 🔍 Get inviter based on ref_code
  useEffect(() => {
    const fetchInviter = async () => {
      if (!refCode) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name,")
        .eq("ref_code", refCode)
        .single();

      if (error || !data) {
        messageApi.error("Invalid or expired invite link.");
        router.replace("/home/friends"); // Clean URL
        return;
      }

      setInviter(data);
      setIsModalOpen(true);
    };

    fetchInviter();
  }, [refCode]);

  // ✅ Handle accepting the invite
  const handleAccept = async () => {
    if (!currentUser?.id || !inviter?.id) return;

    const { error } = await supabase.rpc("add_mutual_friend", {
      a_id: currentUser.id,
      a_name: currentUser.user_metadata.full_name || "Unnamed",
      a_email: currentUser.email,
      a_image: currentUser.user_metadata.avatar_url || null,

      b_id: inviter.id,
      b_name: inviter.full_name || "Unnamed",
      b_email: inviter.email || null,
      b_image: inviter.image_url || null,
    });

    if (error) {
      console.error(error);
      messageApi.error("Failed to accept invite.");
      return;
    }

    messageApi.success("You're now friends!");
    setIsModalOpen(false);
    router.replace("/home/friends");
  };

  const handleIgnore = () => {
    setIsModalOpen(false);
    router.replace("/home/friends"); // Clean URL
  };

  const filtered = friends.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-6 pb-20 w-full">
      {contextHolder}
      <Search
        variant="filled"
        size="large"
        className="w-full bg-white rounded-full subtle-shadow "
        placeholder="Search friends & family..."
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
        allowClear
      />
      {friends.length === 0 ? (
        <Empty description="You have no friends yet." />
      ) : (
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
                <List.Item.Meta
                  avatar={
                    <Avatar src={item.image_url}>
                      {item.name?.[0]?.toUpperCase()}
                    </Avatar>
                  }
                  title={item.name}
                  description={item.email}
                />
              </List.Item>
            </motion.div>
          )}
        />
      )}

      <Modal
        title="Friend Invite"
        centered
        open={isModalOpen}
        onOk={handleAccept}
        okText="Accept"
        cancelText="Ignore"
        onCancel={handleIgnore}
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <Avatar size={64}>
            {inviter?.full_name?.[0]?.toUpperCase() || "?"}
          </Avatar>
          <p>
            <strong>{inviter?.full_name}</strong> has invited you to connect as
            a friend. Would you like to accept?
          </p>
        </div>
      </Modal>

      <Modal
        title="Share your invite link"
        centered
        open={isInviteModalOpen}
        onOk={handleOk}
        okText="Copy"
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <div className="space-y-2">
          <p>Send this link to someone you'd like to invite:</p>
          <Input value={inviteLink} addonAfter={<CopyOutlined />} readOnly />
        </div>
      </Modal>

      <div className="w-full pr-8 flex item cneter justify-end mt-8 mb-10 fixed bottom-0 right-4 z-50">
        <div
          onClick={showModal}
          className="relative flex flex-row items-center justify-center"
        >
          <PlusOutlined className="absolute animate-ping rounded-full bg-white p-4 text-xs shadow-lg" />
          <PlusOutlined className="z-10 absolute rounded-full bg-white p-4 text-xl" />
        </div>
      </div>
    </div>
  );
}
