import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Image,
  Smile,
  Calendar,
  MapPin,
  BarChart3,
  Globe,
  Mic
} from "lucide-react";
import { Separator } from "./ui/separator";
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import * as toxicity from "@tensorflow-models/toxicity";
import "@tensorflow/tfjs";
const TweetComposer = ({ onTweetPosted }: any) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageurl, setimageurl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [model, setModel] = useState<any>(null);
  useEffect(() => {
  if ("Notification" in window) {
    Notification.requestPermission();
  }
}, []);
useEffect(() => {
  const labels = [
    "toxicity",
    "insult",
    "threat",
    "identity_attack",
    "obscene",
    "sexual_explicit",
    "severe_toxicity",
  ];

  toxicity.load(0.9, labels).then((loadedModel) => {
    setModel(loadedModel);
  });
}, []);
  const maxLength = 200;
  const handleSubmit = async (e: any) => {
  e.preventDefault();

  if (model) {
    const predictions = await model.classify([content]);

    const toxic = predictions.some(
      (prediction: any) => prediction.results[0].match
    );

    if (toxic) {
      alert("❌ Toxic or abusive content detected! Please edit your tweet.");
      return;
    }
  }

  if (!user || !content.trim()) return;

  try {
    const tweetdata = {
      author: user._id,
      content,
      image: imageurl,
      audio: audioUrl,
    };

    const res = await axiosInstance.post("/post", tweetdata);

    onTweetPosted(res.data);

    const text = content.toLowerCase();

    if (
      Notification.permission === "granted" &&
      (text.includes("cricket") || text.includes("science"))
    ) {
      new Notification("Twiller Alert", {
        body: content,
      });
    }

    setContent("");
    setimageurl("");
    setAudioUrl("");

  } catch (error: any) {
  console.log(error);

  alert(
    error.response?.data?.message ||
    "Something went wrong"
  );
} finally {
  setIsLoading(false);
}
};
  const characterCount = content.length;
  const isOverLimit = characterCount > maxLength;
  const isNearLimit = characterCount > maxLength * 0.8;
  if (!user) return null;
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsLoading(true);
    const image = e.target.files[0];
    const formdataimg = new FormData();
    formdataimg.set("image", image);
    try {
      const res = await axios.post(
        "https://api.imgbb.com/1/upload?key=97f3fb960c3520d6a88d7e29679cf96f",
        formdataimg
      );
      const url = res.data.data.display_url;
      if (url) {
        setimageurl(url);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAudioUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {

  const hour = new Date().getHours();

  if (hour < 14 || hour >= 19) {
    alert("Audio uploads are allowed only between 2 PM and 7 PM.");
    return;
  }

  if (!user?.email) {
    alert("Please login first.");
    return;
  }

  await axiosInstance.post("/send-otp", {
    email: user.email,
  });

  const otp = prompt("Enter the OTP sent to your email");

  if (!otp) return;

  try {
  await axiosInstance.post("/verify-otp", {
    email: user.email,
    otp,
  });
} catch {
  alert("Invalid OTP");
  return;
}

 if (!e.target.files?.length) return;

  const file = e.target.files[0];

  if (file.size > 100 * 1024 * 1024) {
    alert("Audio must be less than 100 MB");
    return;
  }

  const url = URL.createObjectURL(file);

  const audio = document.createElement("audio");
  audio.src = url;

  audio.onloadedmetadata = () => {
    if (audio.duration > 300) {
      alert("Audio must be less than 5 minutes");
      return;
    }

    setAudioUrl(url);
URL.revokeObjectURL(url);
  };
};
return (
<Card className="mb-6 rounded-3xl border border-[#2f3336] bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#000000] shadow-2xl shadow-blue-500/10 hover:border-[#1D9BF0] transition-all duration-300">      <CardContent className="p-6">
        <div className="flex space-x-4">
<Avatar className="h-14 w-14 border-2 border-[#1D9BF0] shadow-lg shadow-blue-500/30">            <AvatarImage src={user.avatar} alt={user.displayName} />
            <AvatarFallback>{user.displayName[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <Textarea
                placeholder="What's happening?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                 className="bg-transparent border-none text-xl text-white placeholder:text-gray-500 resize-none min-h-[140px] focus-visible:ring-0 focus-visible:ring-offset-0 leading-8"
/>

{imageurl && (
  <div className="mt-4 overflow-hidden rounded-3xl border border-[#2f3336] shadow-lg">
    <img
      src={imageurl}
      alt="Preview"
      className="w-full max-h-[420px] object-cover transition duration-500 hover:scale-105"
    />
  </div>
)}

              {/* 👇 KEEP YOUR AUDIO PREVIEW AFTER THE IMAGE */}
              {audioUrl && (
<div className="mt-4 rounded-2xl border border-[#2f3336] p-3 bg-[#111827]"><audio controls className="w-full rounded-xl border border-[#2f3336]">      <source src={audioUrl} />
      Your browser does not support audio.
    </audio>
  </div>
)}


              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4 text-[#1D9BF0]">
                  <label
                    htmlFor="tweetImage"
                    className="p-2 rounded-full hover:bg-[#1D9BF020] hover:scale-110 transition-all duration-300 cursor-pointer"
                  >
                    <Image className="h-5 w-5" />
                    <input
                      type="file"
                      accept="image/*"
                      id="tweetImage"
                      className="hidden"
                      onChange={handlePhotoUpload}
                      disabled={isLoading}
                    />
                  </label>

<label
  htmlFor="audioUpload"
  className="p-2 rounded-full hover:bg-[#1D9BF020] hover:scale-110 transition-all duration-300 cursor-pointer"
>
  <Mic className="h-5 w-5" />

  <input
    id="audioUpload"
    type="file"
    accept="audio/*"
    className="hidden"
    onChange={handleAudioUpload}
  />
</label>

<Button
  variant="ghost"
  size="sm"
  className="p-2 rounded-full hover:bg-[#1D9BF020] hover:scale-110 transition-all duration-300"
>
  <BarChart3 className="h-5 w-5" />
</Button>

                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 rounded-full hover:bg-[#1D9BF020] hover:scale-110 transition-all duration-300"
                  >
                    <Smile className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 rounded-full hover:bg-[#1D9BF020] hover:scale-110 transition-all duration-300"
                  >
                    <Calendar className="h-5 w-5" />
                  </Button>
                  
                  <Button
  variant="ghost"
  size="sm"
  className="p-2 rounded-full hover:bg-[#1D9BF020] hover:scale-110 transition-all duration-300"
>
  <MapPin className="h-5 w-5" />
</Button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-[#1D9BF0]" />
                    <span className="text-sm text-[#1D9BF0] font-semibold">
                      Everyone can reply
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {characterCount > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="relative w-8 h-8">
                          <svg className="w-8 h-8 transform -rotate-90">
                            <circle
                              cx="16"
                              cy="16"
                              r="14"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              className="text-gray-700"
                            />
                            <circle
                              cx="16"
                              cy="16"
                              r="14"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 14}`}
                              strokeDashoffset={`${
                                2 *
                                Math.PI *
                                14 *
                                (1 - characterCount / maxLength)
                              }`}
                              className={
                                isOverLimit
                                  ? "text-red-500"
                                  : isNearLimit
                                  ? "text-yellow-500"
                                  : "text-[#1D9BF0]"
                              }
                            />
                          </svg>
                        </div>
                        {isNearLimit && (
                          <span
                            className={`text-sm ${
                              isOverLimit ? "text-red-500" : "text-yellow-500"
                            }`}
                          >
                            {maxLength - characterCount}
                          </span>
                        )}
                      </div>
                    )}
                   <Separator
  orientation="vertical"
  className="h-7 bg-[#2f3336]"
/>

                    <Button
                      type="submit"
                      disabled={!content.trim() || isOverLimit|| isLoading}
className="rounded-full bg-[#1D9BF0] px-8 py-6 font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:bg-[#1484d6] disabled:bg-gray-700 disabled:text-gray-500"                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TweetComposer;
