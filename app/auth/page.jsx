"use client";
import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { generateReferralCode } from "../resources/utils";

const { Title, Text, Link } = Typography;

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const router = useRouter();

  const toggleMode = () => setIsSignUp(!isSignUp);

  const handleSubmit = async (values) => {
    setLoading(true);

    const { email, password, name } = await values;

    try {
      if (isSignUp === true) {
        // 1) create user
        const createdUser = await AuthService.createUser({
          email: email,
          password: password,
          fullName: name,
        });

        if (createdUser.$id) {
          // 2) generate referral code
          const refCode = generateReferralCode(createdUser.$id);

          // 3) login
          const session = await AuthService.login({
            email,
            password,
          });

          if (session) {
            // 4) create profile
            const profile = await UserService.createUserProfile({
              user_id: createdUser.$id,
              full_name: name,
              avatar_url: "",
              ref_code: refCode,
            });

            if (profile) {
              messageApi.success("Account created!");
              router.replace("/");
              return;
            }
          }
        }
      } else {
        const session = await AuthService.login({
          email,
          password,
        });
        if (session) {
          setLoading(true);
          router.replace("/");
          return;
        }
      }
    } catch (error) {
      messageApi.error("An error occured");
      console.log("appwrite auth error", error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    handleSubmit(values);
  };

  return (
    <div className="h-[80vh] flex flex-col items-center justify-center bg-gray-100 px-4 w-full">
      {contextHolder}
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <Title level={3} className="text-center mb-6">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Title>

        <AnimatePresence mode="wait">
          <motion.div
            key={isSignUp ? "signup" : "signin"}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <Form
              size="large"
              name={isSignUp ? "signupForm" : "signinForm"}
              layout="vertical"
              onFinish={onFinish}
            >
              {isSignUp && (
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    { required: true, message: "Please enter your name" },
                  ]}
                >
                  <Input placeholder="John Doe" />
                </Form.Item>
              )}

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input placeholder="you@example.com" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  placeholder="••••••••"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  loading={loading}
                  size="large"
                >
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
              </Form.Item>
            </Form>

            <div className="text-center mt-4">
              <Text>
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <Link onClick={toggleMode}>
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Link>
              </Text>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;
