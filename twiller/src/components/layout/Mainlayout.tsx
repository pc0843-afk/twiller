"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import LoadingSpinner from "../loading-spinner";
import Sidebar from "./Sidebar";
import RightSidebar from "./Rightsidebar";
import ProfilePage from "../ProfilePage";

const Mainlayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState("home");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6 text-6xl font-black text-[#1D9BF0]">
X
</div>
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  // If user is not logged in → show children (like login/signup pages)
  if (!user) {
    return <>{children}</>;
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-black via-[#08152b] to-black text-white flex justify-center">
  <div className="flex w-full max-w-[1600px]">        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>
<main className="flex-1 min-h-screen border-x border-[#2f3336] bg-black/40 backdrop-blur-xl">        {currentPage ==="profile" ? <ProfilePage/> :children}
      </main>
<div className="hidden lg:block w-[360px] border-l border-[#2f3336] bg-black/70 p-6 backdrop-blur-xl">        <RightSidebar />
      </div>
    </div>
  );
};

export default Mainlayout;
