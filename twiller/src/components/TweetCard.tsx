"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";

export default function TweetCard({ tweet }: any) {
  const { user } = useAuth();
  const [tweetstate, settweetstate] = useState(tweet);
  const likeTweet = async (tweetId: string) => {
    try {
      const res = await axiosInstance.post(`/like/${tweetId}`, {
        userId: user?._id,
      });
      settweetstate(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const retweetTweet = async (tweetId: string) => {
    try {
      const res = await axiosInstance.post(`/retweet/${tweetId}`, {
        userId: user?._id,
      });
      settweetstate(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };
  const isLiked = tweetstate.likedBy?.includes(user?._id);
  const isRetweet = tweetstate.retweetedBy?.includes(user?._id);
 return (
  <Card className="mb-6 rounded-3xl border border-[#2f3336] bg-gradient-to-br from-[#0f172a] via-[#111827] to-black p-1 shadow-xl shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#1D9BF0] hover:shadow-2xl hover:shadow-blue-500/30">
    <CardContent className="p-6">
      
        <Avatar className="h-14 w-14 rounded-full border-2 border-[#1D9BF0] ring-2 ring-[#0f172a] shadow-lg shadow-blue-500/30">
          <AvatarImage
            src={tweetstate.author.avatar}
            alt={tweetstate.author.displayName}
          />
          <AvatarFallback>
            {tweetstate.author.displayName}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-bold text-lg text-white tracking-wide">
                {tweetstate.author.displayName}
              </span>
              {tweetstate.author.verified && (
                <div className="bg-[#1D9BF0] rounded-full p-0.5">
                  <svg
                    className="h-4 w-4 text-white fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                </div>
              )}
              <span className="text-gray-400">
                @{tweetstate.author.username}
              </span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-400">
                {tweetstate.timestamp &&
                  new Date(tweetstate.timestamp).toLocaleDateString("en-us", {
                    month: "long",
                    year: "numeric",
                  })}
              </span>
              <div className="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 rounded-full hover:bg-[#1D9BF020]"
                >
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            </div>

            <div className="text-white text-lg leading-8 mb-5">
              {tweetstate.content}
            </div>

            {tweetstate.image && (
              <div className="mb-5 overflow-hidden rounded-3xl border border-[#2f3336] shadow-lg">
                <img
                  src={tweetstate.image}
                  alt="Tweet image"
className="w-full max-h-[450px] rounded-2xl object-cover transition-transform duration-500 hover:scale-[1.02]"                />
              </div>
            )}

            <div className="flex items-center justify-between max-w-md">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:bg-[#1D9BF020] text-gray-500 hover:text-blue-400 group"
              >
                <MessageCircle className="h-5 w-5 group-hover:text-blue-400" />
                <span className="text-sm">
                  {formatNumber(tweetstate.comments)}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-2 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:bg-green-500/20 group ${
                  isRetweet
                    ? "text-green-400"
                    : "text-gray-500 hover:text-green-400"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  retweetTweet(tweetstate._id);
                }}
              >
                <Repeat2
                  className={`h-5 w-5 ${
                    tweet.retweeted
                      ? "text-green-400"
                      : "group-hover:text-green-400"
                  }`}
                />
                <span className="text-sm">
                  {formatNumber(tweetstate.retweets)}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
className={`flex items-center space-x-2 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:bg-red-500/20 group ${                  isLiked ? "text-red-500" : "text-gray-500 hover:text-red-400"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  likeTweet(tweetstate._id);
                }}
              >
                <Heart
                  className={`h-5 w-5 ${
                    tweetstate.liked
                      ? "text-red-500 fill-current"
                      : "group-hover:text-red-400"
                  }`}
                />
                <span className="text-sm">
                  {formatNumber(tweetstate.likes)}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:bg-[#1D9BF020] text-gray-500 hover:text-blue-400 group"
              >
                <Share className="h-5 w-5 group-hover:text-blue-400" />
              </Button>
                                </div>   {/* closes flex-1 */}

          </div>     {/* closes flex space-x-3 */}

        </CardContent>

      </Card>
    );
}
