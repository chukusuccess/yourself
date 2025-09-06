"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Result } from "antd";
import { LoadingScreen } from "../components/LoadingScreen";
import { AuthService } from "../services/auth.service";

const AuthContext = createContext({
  currentUser: null,
  logout: () => {},
});

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const getAuthUser = async () => {
      setLoading(true);
      try {
        const res = await AuthService.getUser();
        if (res.status === true) {
          const fullName = res.name || "";
          const firstName = fullName.split(" ")[0]; // ✅ take only first word

          setCurrentUser({ id: res.$id, fullname: fullName, email: res.email });
          setIsAuthenticated(true);

          if (typeof window !== "undefined") {
            localStorage.setItem("username", firstName); // ✅ save trimmed name
            localStorage.setItem("user_id", res.$id);
          }
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } catch (e) {
        console.error("Auth Check Failed:", e.message);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    getAuthUser();
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    await AuthService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    router.replace("/auth");
    setLoading(false);
  }, [router]);

  const value = useMemo(() => ({ currentUser, logout }), [currentUser, logout]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <div className="w-screen h-full max-h-screen">
        <Result
          status="403"
          title="Oops!"
          subTitle="Sorry, you have to be logged in to view this page."
          extra={
            <Link
              className="bg-[#f0f0f0] py-2 px-6 rounded-full"
              replace
              href={"/auth"}
            >
              Login
            </Link>
          }
        />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth() MUST BE USED WITHIN AN <AuthProvider/> !!!");
  }

  return context;
};

export { AuthProvider, useAuth };
