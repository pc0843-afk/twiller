"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Enter your email.");
      return;
    }

    try {
      const res = await axiosInstance.post("/forgot-password", {
        email,
      });

 alert(res.data.message);

setGeneratedPassword(res.data.password);

    } catch (error: any) {
      alert(
  error.response?.data?.message ||
  "Something went wrong"
);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="bg-zinc-900 p-8 rounded-xl w-96">

        <h1 className="text-2xl text-white mb-5">
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Registered Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-black text-white border border-gray-700"
        />

        <button
          onClick={handleForgotPassword}
          className="mt-5 w-full bg-blue-600 text-white py-3 rounded"
        >
          Generate Password
        </button>

        {generatedPassword && (
          <div className="mt-6">

            <p className="text-green-400">
              New Password
            </p>

            <div className="bg-black p-3 rounded mt-2 text-white break-all">
              {generatedPassword}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}