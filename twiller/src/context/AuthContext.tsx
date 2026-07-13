"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import axiosInstance from "../lib/axiosInstance";
import { UAParser } from "ua-parser-js";

interface User {
  _id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  joinedDate: string;
  email: string;
  website: string;
  location: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => Promise<void>;
  updateProfile: (profileData: {
    displayName: string;
    bio: string;
    location: string;
    website: string;
    avatar: string;
  }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  googlesignin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const unsubcribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser?.email) {
        try {
          const res = await axiosInstance.get("/loggedinuser", {
            params: { email: firebaseUser.email },
          });

          if (res.data) {
  setUser(res.data);
  localStorage.setItem("twitter-user", JSON.stringify(res.data));

  const parser = new UAParser();
  const browserInfo = parser.getResult();

  const ipRes = await fetch("https://api.ipify.org?format=json");
  const ipData = await ipRes.json();

  await axiosInstance.post("/login-history", {
    user: res.data._id,
    browser: browserInfo.browser.name,
os: browserInfo.os.name,
device: browserInfo.device.type || "Desktop",
    ip: ipData.ip,
  });
}
          
        } catch (err) {
          console.log("Failed to fetch user:", err);
        }
      } else {
        setUser(null);
        localStorage.removeItem("twitter-user");
      }
      setIsLoading(false);
    });
    return () => unsubcribe();
  }, []);

  const login = async (email: string, password: string) => {
  setIsLoading(true);
  const ua = navigator.userAgent;

const isChrome =
  ua.includes("Chrome") && !ua.includes("Edg");

const isMobile =
  /Android|iPhone|iPad/i.test(ua);

  const hour = new Date().getHours();

if (isMobile && (hour < 10 || hour >= 13)) {
  alert("Mobile login is allowed only between 10 AM and 1 PM.");
  setIsLoading(false);
  return;
}

  try {
    if (isChrome) {
  await axiosInstance.post("/send-otp", {
    email,
  });

  const otp = prompt("Enter the OTP sent to your email");

  if (!otp) {
    setIsLoading(false);
    return;
  }

  try {
  await axiosInstance.post("/verify-otp", {
    email,
    otp,
  });
} catch {
  alert("Invalid OTP");
  setIsLoading(false);
  return;
}
}

const usercred = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const firebaseuser = usercred.user;

    const res = await axiosInstance.get("/loggedinuser", {
      params: { email: firebaseuser.email },
    });

    if (res.data) {
      setUser(res.data);
      localStorage.setItem("twitter-user", JSON.stringify(res.data));

      try {
        const parser = new UAParser();
        const result = parser.getResult();

        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();

        await axiosInstance.post("/login-history", {
          user: res.data._id,
          browser: result.browser.name,
          os: result.os.name,
          device: result.device.type || "Desktop",
          ip: ipData.ip,
        });

      } catch (err) {
        console.log("Login history failed:", err);
      }
    }

  } catch (error) {
    console.error("Login failed:", error);
    throw error;

  } finally {
    setIsLoading(false);
  }
};
  const signup = async (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => {
    setIsLoading(true);
    // Mock authentication - in real app, this would call an API
    const usercred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = usercred.user;
    const newuser: any = {
      username,
      displayName,
      avatar: user.photoURL || "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=400",
      email: user.email,
    };
    const res = await axiosInstance.post("/register", newuser);
    if (res.data) {
      setUser(res.data);
      localStorage.setItem("twitter-user", JSON.stringify(res.data));
    }
    // const mockUser: User = {
    //   id: '1',
    //   username,
    //   displayName,
    //   avatar: 'https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=400',
    //   bio: '',
    //   joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    // };
    setIsLoading(false);
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
    localStorage.removeItem("twitter-user");
  };

  const updateProfile = async (profileData: {
    displayName: string;
    bio: string;
    location: string;
    website: string;
    avatar: string;
  }) => {
    if (!user) return;

    setIsLoading(true);
    // Mock API call - in real app, this would call an API
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedUser: User = {
      ...user,
      ...profileData,
    };
    const res = await axiosInstance.patch(
      `/userupdate/${user.email}`,
      updatedUser
    );
    if (res.data) {
      setUser(updatedUser);
      localStorage.setItem("twitter-user", JSON.stringify(updatedUser));
    }

    setIsLoading(false);
  };
  const googlesignin = async () => {
  setIsLoading(true);

  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseuser = result.user;

    let userData = null;

    const res = await axiosInstance.get("/loggedinuser", {
      params: { email: firebaseuser.email },
    });

    if (res.data) {
      userData = res.data;
    } else {
      const newuser = {
        username: (firebaseuser.email || "").split("@")[0],
        displayName: firebaseuser.displayName || "User",
        avatar:
          firebaseuser.photoURL ||
          "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg",
        email: firebaseuser.email || "",
      };

      const registerRes = await axiosInstance.post("/register", newuser);
      userData = registerRes.data;
    }

   if (!userData) {
  throw new Error("No user data returned");
}

setUser(userData);
localStorage.setItem("twitter-user", JSON.stringify(userData));

const parser = new UAParser();
const browserInfo = parser.getResult();

const ipRes = await fetch("https://api.ipify.org?format=json");
const ipData = await ipRes.json();

await axiosInstance.post("/login-history", {
  user: userData._id,
  browser: browserInfo.browser.name,
  os: browserInfo.os.name,
  device: browserInfo.device.type || "Desktop",
  ip: ipData.ip,
});
  } catch (error) {
    console.error(error);
    alert("Google Login Failed");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        updateProfile,
        logout,
        isLoading,
        googlesignin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
