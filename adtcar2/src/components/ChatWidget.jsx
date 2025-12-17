import React, { useEffect, useRef, useState } from "react";
import { X, MessageCircle, Send } from "lucide-react";
import { useChatStore } from "../store/chat.store";

export default function ChatWidget() {
  const open = useChatStore((s) => s.open);
  const setOpen = useChatStore((s) => s.setOpen);
  const init = useChatStore((s) => s.init);

  const messages = useChatStore((s) => s.messages);
  const sendMsg = useChatStore((s) => s.send);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false); 
  const listRef = useRef(null);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, messages]);

  const send = (text) => {
    const trimmed = (text || "").trim();
    if (!trimmed || sending) return;
    setSending(true);
    sendMsg(trimmed);
    setInput("");
    setTimeout(() => setSending(false), 350); 
  };

  const quick = (txt) => send(txt);

  if (!open) return null;

  return (
    <div className="fixed bottom-24 right-5 z-[70] w-[92vw] max-w-[360px]">
      <div className="bg-white border rounded-2xl shadow-xl overflow-hidden">
        <div className="px-4 py-3 bg-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} />
            <div className="font-semibold text-sm">ADTcar Chat</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-white/15"
            aria-label="Đóng"
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-3 py-2 bg-gray-50 border-b flex flex-wrap gap-2">
          <button onClick={() => quick("Giờ làm việc?")} className="text-xs px-2 py-1 rounded-full border bg-white hover:bg-gray-50">
            Giờ làm việc
          </button>
          <button onClick={() => quick("Chi nhánh ở đâu?")} className="text-xs px-2 py-1 rounded-full border bg-white hover:bg-gray-50">
            Chi nhánh
          </button>
          <button onClick={() => quick("Tôi muốn đặt lịch")} className="text-xs px-2 py-1 rounded-full border bg-white hover:bg-gray-50">
            Đặt lịch
          </button>
        </div>

        <div ref={listRef} className="h-[360px] overflow-y-auto p-3 space-y-2 bg-gray-50">
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={[
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm whitespace-pre-line",
                    isUser ? "bg-blue-600 text-white rounded-br-sm" : "bg-white border text-gray-900 rounded-bl-sm",
                  ].join(" ")}
                >
                  {m.content}
                  <div className={`mt-1 text-[10px] ${isUser ? "text-blue-100" : "text-gray-400"}`}>
                    {new Date(m.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-2xl px-3 py-2 text-sm text-gray-700 shadow-sm">
                Bot đang trả lời...
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="p-3 border-t bg-white flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tin nhắn..."
          />
          <button
            type="submit"
            disabled={sending}
            className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-60"
            aria-label="Gửi"
            title="Gửi"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
