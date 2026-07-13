"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import {
  LogOut, Sun, Moon, Code2, User, Mail, MessageSquare,
  ExternalLink, Download, Eye, CheckCircle, Clock,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-st9i.onrender.com";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const { user, token, logout, isLoggedIn } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "messages">("overview");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.replace("/");
    }
  }, [mounted, isLoggedIn, router]);

  // Load messages for admin
  useEffect(() => {
    if (isLoggedIn && user?.role === "ADMIN" && token && activeTab === "messages") {
      fetchMessages();
    }
  }, [isLoggedIn, user, token, activeTab]);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoadingMessages(false);
    }
  };

  const markRead = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/contact/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m));
    } catch {
      //
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!mounted || !isLoggedIn) return null;

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col z-30">
        {/* Logo */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Code2 size={16} className="text-white" />
            </div>
            <span className="font-bold text-base">
              Michael<span className="text-indigo-500">.</span>
            </span>
          </a>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "overview"
                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <User size={16} />
            Overview
          </button>

          {user?.role === "ADMIN" && (
            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === "messages"
                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <MessageSquare size={16} />
              Messages
              {unreadCount > 0 && (
                <span className="ml-auto px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          <a
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all"
          >
            <ExternalLink size={16} />
            View Portfolio
          </a>

          <a
            href="/resume.pdf"
            download="Michael_Bassey_Resume.pdf"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all"
          >
            <Download size={16} />
            Download Resume
          </a>
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold capitalize text-zinc-900 dark:text-white">{activeTab}</h1>
            <p className="text-xs text-zinc-400">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div>
                <p className="text-xs font-semibold leading-none">{user?.name}</p>
                <p className="text-xs text-zinc-400 capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 p-8">
          {activeTab === "overview" && <OverviewTab user={user} />}
          {activeTab === "messages" && (
            <MessagesTab
              messages={messages}
              loading={loadingMessages}
              onMarkRead={markRead}
              onRefresh={fetchMessages}
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* ─── Overview Tab ─── */
function OverviewTab({ user }: { user: { name: string; email: string; role: string } | null }) {
  const stats = [
    { label: "Projects Built", value: "3", icon: <Code2 size={20} />, color: "indigo" },
    { label: "Skills", value: "10+", icon: <User size={20} />, color: "violet" },
    { label: "Availability", value: "Open", icon: <CheckCircle size={20} />, color: "emerald" },
    { label: "Experience", value: "Active", icon: <Clock size={20} />, color: "cyan" },
  ];

  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-500/10 text-indigo-500",
    violet: "bg-violet-500/10 text-violet-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    cyan: "bg-cyan-500/10 text-cyan-500",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Welcome card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-8 mb-8 text-white">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="relative">
          <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back</p>
          <h2 className="text-3xl font-bold mb-2">{user?.name ?? "Developer"}</h2>
          <p className="text-indigo-200 text-sm flex items-center gap-1.5">
            <Mail size={13} />
            {user?.email}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${colorMap[s.color]} flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold mb-0.5 text-zinc-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "View Portfolio", href: "/", icon: <ExternalLink size={15} /> },
            { label: "Download Resume", href: "/resume.pdf", icon: <Download size={15} />, download: true },
            { label: "GitHub Profile", href: "https://github.com/Slekie", icon: <Code2 size={15} />, external: true },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/michaelbassey", icon: <User size={15} />, external: true },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              download={link.download ? "Michael_Bassey_Resume.pdf" : undefined}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-sm font-medium text-zinc-700 dark:text-zinc-400 group"
            >
              <span className="text-indigo-500">{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Messages Tab ─── */
function MessagesTab({
  messages,
  loading,
  onMarkRead,
  onRefresh,
}: {
  messages: Message[];
  loading: boolean;
  onMarkRead: (id: string) => void;
  onRefresh: () => void;
}) {
  const [selected, setSelected] = useState<Message | null>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Inbox</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{messages.filter(m => !m.read).length} unread</p>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 dark:text-zinc-400">
          <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No messages yet</p>
          <p className="text-sm mt-1">Messages from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Message list */}
          <div className="space-y-2">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  setSelected(msg);
                  if (!msg.read) onMarkRead(msg.id);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selected?.id === msg.id
                    ? "border-indigo-500 bg-indigo-500/5"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-500/40"
                }`}              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1" />
                    )}
                    <span className="font-semibold text-sm text-zinc-900 dark:text-white">{msg.name}</span>
                  </div>
                  <span className="text-xs text-zinc-400 flex-shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-indigo-400 mb-1">{msg.email}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{msg.message}</p>
              </button>
            ))}
          </div>

          {/* Message detail */}
          <div className="sticky top-24">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold text-sm">
                      {selected.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-white">{selected.name}</p>
                      <a href={`mailto:${selected.email}`} className="text-xs text-indigo-400 hover:text-indigo-500">
                        {selected.email}
                      </a>
                    </div>
                  </div>
                  {selected.read && (
                    <span className="flex items-center gap-1 text-xs text-emerald-500">
                      <CheckCircle size={12} /> Read
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-300 leading-relaxed mb-4">
                  {selected.message}
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{new Date(selected.createdAt).toLocaleString()}</span>
                  <a
                    href={`mailto:${selected.email}?subject=Re: Your message`}
                    className="flex items-center gap-1 text-indigo-500 hover:text-indigo-400 font-medium"
                  >
                    <Mail size={12} /> Reply
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 text-center text-zinc-500 dark:text-zinc-400">
                <Eye size={28} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a message to read it</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
