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
import supabase from "../supabase";
import { LoadingScreen } from "../components/LoadingScreen";

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
        const { data, error } = await supabase.auth.getSession();
        const session = data?.session;

        if (error) throw error;

        if (session?.user) {
          setCurrentUser(session.user);
          setIsAuthenticated(true);
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
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentUser(null);
    router.replace("/");
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
