'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) {
    router.push('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-56 border-r border-gray-200 bg-white flex flex-col">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">△</span>
            </div>
            <span className="text-xl font-bold text-black">Pyramid</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <button className="w-full flex items-center gap-3 hover:bg-gray-50 p-2 rounded">
            <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-semibold text-black">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <span className="text-gray-400">⋮</span>
          </button>
        </div>

        {/* Workspace */}
        <div className="p-4 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-600 mb-2">WORKSPACE</p>
          <button className="text-sm text-gray-700 hover:text-black">▼ Workspace</button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <Link
              href="/dashboard/tasks"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-black"
            >
              <span className="text-lg">☰</span>
              <span className="text-sm font-medium">Tasks</span>
            </Link>
            <Link
              href="/dashboard/projects"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
            >
              <span className="text-lg">📁</span>
              <span className="text-sm font-medium">Projects</span>
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-gray-700 hover:text-black px-3 py-2"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}