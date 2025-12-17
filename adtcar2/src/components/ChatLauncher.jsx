import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import ChatWidget from "./ChatWidget";
import { useChatStore } from "../store/chat.store";

const CHAT_KEY_PREFIX = "adtcar_chat_v1";

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function getCurrentUser() {
  return safeParse(localStorage.getItem("user"), null);
}

function getRole(user) {
  return (user?.role || user?.Role || user?.user_role || "").toLowerCase();
}

function shouldShowLauncher(user) {
  if (!user) return true;
  const role = getRole(user);
  return !(role === "admin" || role === "editor");
}

function getChatKey(user) {
  const id = user?.id || user?._id || user?.email || "guest";
  return `${CHAT_KEY_PREFIX}:${id}`;
}

export default function ChatLauncher() {
  const location = useLocation();
  const user = useMemo(() => getCurrentUser(), []);
  const visible = useMemo(() => shouldShowLauncher(user), [user]);

  const chatKey = useMemo(() => getChatKey(user), [user]);
  const [unread, setUnread] = useState(0);

  const open = useChatStore((s) => s.open);
  const setOpen = useChatStore((s) => s.setOpen);
  const init = useChatStore((s) => s.init);

  const hiddenOnChatPage = useMemo(
    () => location.pathname.startsWith("/chat"),
    [location.pathname]
  );

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!visible) return;

    const lastSeenKey = `${chatKey}:lastSeen`;

    const calcUnread = () => {
      if (open) {
        setUnread(0);
        return;
      }
      const lastSeen = Number(localStorage.getItem(lastSeenKey) || "0");
      const msgs = safeParse(localStorage.getItem(chatKey), []);
      const botCountAfter = msgs.filter(
        (m) => m?.role === "bot" && new Date(m.createdAt).getTime() > lastSeen
      ).length;
      setUnread(botCountAfter);
    };

    calcUnread();

    const onStorage = (e) => {
      if (e.key === chatKey || e.key === lastSeenKey) calcUnread();
    };
    window.addEventListener("storage", onStorage);
    const t = setInterval(calcUnread, 1200);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(t);
    };
  }, [chatKey, visible, open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      localStorage.setItem(`${chatKey}:lastSeen`, String(Date.now()));
      setUnread(0);
    }
  };

  if (!visible || hiddenOnChatPage) return null;

  return (
    <>
      <button
        onClick={toggle}
        className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 active:scale-[0.98] transition"
        aria-label="Mở chat"
        title="Chat"
      >
        <MessageCircle size={22} />
        {unread > 0 && !open && (
          <span className="absolute -top-2 -right-2 min-w-6 h-6 px-2 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center shadow">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      <ChatWidget />
    </>
  );
}
