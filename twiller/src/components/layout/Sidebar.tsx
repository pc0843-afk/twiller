"use client";

import React from 'react';

import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  MoreHorizontal,
  Settings,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import TwitterLogo from '../Twitterlogo';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export default function Sidebar({ currentPage = 'home', onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Home', icon: Home, current: currentPage === 'home', page: 'home' },
    { name: 'Explore', icon: Search, current: currentPage === 'explore', page: 'explore' },
    { name: 'Notifications', icon: Bell, current: currentPage === 'notifications', page: 'notifications', badge: true },
    { name: 'Messages', icon: Mail, current: currentPage === 'messages', page: 'messages' },
    { name: 'Bookmarks', icon: Bookmark, current: currentPage === 'bookmarks', page: 'bookmarks' },
    { name: 'Profile', icon: User, current: currentPage === 'profile', page: 'profile' },
    { name: 'More', icon: MoreHorizontal, current: currentPage === 'more', page: 'more' },
  ];

  return (
<div className="sticky top-0 flex flex-col h-screen w-72 bg-black border-r border-[#2f3336] px-4">      <div className="flex justify-center py-6">
        <div className="w-14 h-14 rounded-full hover:bg-[#1d9bf020] flex items-center justify-center transition duration-300 cursor-pointer">
  <TwitterLogo size="lg" className="text-white" />
</div>
      </div>
      
      <nav className="flex-1 px-2">
<ul className="space-y-1 mt-4">
            {navigation.map((item) => (
            <li key={item.name}>
              <Button
                variant="ghost"
className={`w-full h-14 justify-start rounded-full text-xl transition-all duration-300 hover:bg-[#16181c] hover:scale-[1.03] ${                  item.current ? 'font-bold' : 'font-normal'
                } text-white hover:text-white`}
                onClick={() => onNavigate?.(item.page)}
              >
<item.icon className="mr-5 h-8 w-8" />
                {item.name}
                {item.badge && (
                  <span className="ml-2 bg-[#1d9bf0] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                )}
              </Button>
            </li>
          ))}
        </ul>
        
        <div className="mt-8 px-2">
<Button className="w-full h-14 rounded-full bg-[#1d9bf0] hover:bg-[#1484d6] text-white font-bold text-lg shadow-lg hover:shadow-blue-500/40 transition-all duration-300">            Post
          </Button>
        </div>
      </nav>
      
      {user && (
        <div className="p-4 border-t border-gray-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start p-3 rounded-full hover:bg-[#202327]"
              >
<Avatar className="h-14 w-14 border-2 border-[#1d9bf0] shadow-lg shadow-blue-500/30">                  <AvatarImage src={user.avatar} alt={user.displayName} />
                  <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="text-white font-semibold">{user.displayName}</div>
                  <div className="text-gray-400 text-sm">@{user.username}</div>
                </div>
                <MoreHorizontal className="h-5 w-5 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 rounded-2xl border border-[#2f3336] bg-[#16181c] shadow-2xl">
              <DropdownMenuItem className="text-white hover:bg-[#202327]">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#2f3336]" />
              <DropdownMenuItem 
                className="text-white hover:bg-[#202327]"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out @{user.username}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}