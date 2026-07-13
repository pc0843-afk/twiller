"use client";

import { Search } from 'lucide-react';
import React from 'react';
import Link from "next/link";
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';




const suggestions = [
  {
    id: '1',
    username: 'narendramodi',
    displayName: 'Narendra Modi',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true
  },
  {
    id: '2',
    username: 'akshaykumar',
    displayName: 'Akshay Kumar',
    avatar: 'https://images.pexels.com/photos/1382735/pexels-photo-1382735.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true
  },
  {
    id: '3',
    username: 'rashtrapatibhvn',
    displayName: 'President of India',
    avatar: 'https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true
  }
];

export default function RightSidebar() {
  return (
<div className="w-full space-y-6">      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1D9BF0] h-5 w-5" />
        <Input
          placeholder="Search"
className="h-12 rounded-full border border-[#2f3336] bg-[#16181c] pl-12 text-white placeholder:text-gray-500 focus:border-[#1D9BF0] focus:ring-2 focus:ring-[#1D9BF0]/30"        />
      </div>

      {/* Subscribe to Premium */}
<Card className="rounded-3xl border border-[#2f3336] bg-gradient-to-br from-[#111827] via-[#0f172a] to-black shadow-lg shadow-blue-500/10">        <CardContent className="p-4">
          <h3 className="text-white text-xl font-bold mb-2">Subscribe to Premium</h3>
          <p className="text-[#1D9BF0] text-sm mb-4">
            Subscribe to unlock new features and if eligible, receive a share of revenue.
          </p>
          
            <Link href="/subscription">
  <Button className="w-full rounded-full bg-[#1D9BF0] py-6 text-lg font-bold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:bg-[#1484d6]">
    Subscribe
  </Button>
</Link>
        </CardContent>
      </Card>

     <Card className="rounded-3xl border border-[#2f3336] bg-gradient-to-br from-[#111827] via-[#0f172a] to-black">
  <CardContent className="p-5">

    <h3 className="mb-4 text-xl font-bold text-white">
      🔥 Trending
    </h3>

    <div className="space-y-4">

      <div>
        <p className="text-xs text-gray-400">
          Trending in India
        </p>
        <h4 className="font-bold text-white">
          #ArtificialIntelligence
        </h4>
        <p className="text-xs text-gray-400">
          82K posts
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-400">
          Technology
        </p>
        <h4 className="font-bold text-white">
          #NextJS
        </h4>
        <p className="text-xs text-gray-400">
          45K posts
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-400">
          Programming
        </p>
        <h4 className="font-bold text-white">
          #React
        </h4>
        <p className="text-xs text-gray-400">
          31K posts
        </p>
      </div>

    </div>

  </CardContent>
</Card>

      {/* Who to follow */}
<Card className="bg-gray-900 border-gray-800">        <CardContent className="p-4">
          <h3 className="text-white text-xl font-bold mb-4">You might like</h3>
          <div className="space-y-4">
            {suggestions.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-2xl p-2 transition-all duration-300 hover:bg-[#1a1f2e]">
                <div className="flex items-center space-x-3">
<Avatar className="h-12 w-12 border-2 border-[#1D9BF0]">                    <AvatarImage src={user.avatar} alt={user.displayName} />
                    <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="text-white font-semibold">{user.displayName}</span>
                      {user.verified && (
                        <div className="bg-[#1D9BF0] rounded-full p-0.5">
                          <svg className="h-3 w-3 text-white fill-current" viewBox="0 0 20 20">
                            <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="text-[#1D9BF0] text-sm">@{user.username}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
className="rounded-full bg-[#1D9BF0] px-5 text-white hover:bg-[#1484d6]"                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="mt-4 p-0 text-[#1D9BF0] hover:text-cyan-300">
            Show more
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
    <div className="rounded-2xl border border-[#2f3336] bg-[#111827] p-5 text-xs text-gray-500">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Cookie Policy</a>
          <a href="#" className="hover:underline">Accessibility</a>
          <a href="#" className="hover:underline">Ads info</a>
        </div>
        <div>© 2024 X Corp.</div>
      </div>
    </div>
  );
}