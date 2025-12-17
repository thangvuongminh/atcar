
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../store/axiosClient";


const INITIAL_MESSAGES = [
    {
        id: 1,
        text: "Xin chào! Tôi là AI hỗ trợ. Bạn cần giúp gì không?",
        sender: "bot",
    },
];

const AIChatWidget = ({ isLoggedIn, roleName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const isUser = roleName === "USER";

    
    useEffect(() => {
        if (isOpen && isLoggedIn) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen, isLoggedIn]);

    
    useEffect(() => {
        if (!isLoggedIn) {
            setIsOpen(false);
            setMessages(INITIAL_MESSAGES);
            setInputText("");
            setIsLoading(false);
        }
    }, [isLoggedIn]);

    const handleToggleChat = () => {
        setIsOpen((prev) => !prev);
    };

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userText = inputText.trim();
        const userMsg = { id: Date.now(), text: userText, sender: "user" };
        setMessages((prev) => [...prev, userMsg]);
        setInputText("");

        if (!isLoggedIn) return;

        setIsLoading(true);

        try {
            let res;
            if (isUser) {
                
                res = await axiosClient.get("/user/chat", {
                    params: { message: userText },
                });
            } else {
                
                res = await axiosClient.get("/super/user/chat", {
                    params: { message: userText },
                });
            }

            const data = res.data?.data;
            let reply = "Dạ, hiện em chưa có thông tin phù hợp ạ.";

            if (isUser) {
               
                if (Array.isArray(data) && data.length > 0) {
                    reply = data
                        .map((item) => {
                            const title = item.title || "";
                            const descArr = Array.isArray(item.description)
                                ? item.description
                                : item.description
                                ? [item.description]
                                : [];
                            const descText = descArr
                                .map((d) => `- ${d}`)
                                .join("\n");

                            if (title && descText) {
                                return `${title}:\n${descText}`;
                            }
                            return title || descText;
                        })
                        .filter(Boolean)
                        .join("\n\n");
                }
            } else {
                
                if (typeof data === "string") {
                    reply = data;
                } else if (Array.isArray(data)) {
                    reply = data.join("\n");
                } else if (data) {
                    reply = JSON.stringify(data, null, 2);
                }
            }

            const botMsg = {
                id: Date.now() + 1,
                text: reply,
                sender: "bot",
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            console.error("CHAT API ERROR:", err);
            const botMsg = {
                id: Date.now() + 1,
                text: "Xin lỗi, hệ thống đang gặp lỗi. Bạn vui lòng thử lại sau nhé.",
                sender: "bot",
            };
            setMessages((prev) => [...prev, botMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
            
            {isOpen && (
                <div className="mb-4 w-[350px] h-[450px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
                 
                    <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <Bot size={24} />
                            <span className="font-bold">Trợ lý AI</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-indigo-700 p-1 rounded"
                        >
                            <X size={20} />
                        </button>
                    </div>

                   
                    {!isLoggedIn ? (
                        
                        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white">
                            <Bot size={60} className="text-gray-300 mb-3" />
                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                Bạn chưa đăng nhập
                            </h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Đăng nhập để sử dụng trợ lý AI và nhận hỗ trợ
                                ngay lập tức.
                            </p>

                            <button
                                onClick={() => navigate("/login")}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full shadow transition active:scale-95"
                            >
                                <LogIn size={18} />
                                Đăng nhập ngay
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${
                                            msg.sender === "user"
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[80%] whitespace-pre-line p-3 rounded-lg text-sm ${
                                                msg.sender === "user"
                                                    ? "bg-indigo-600 text-white rounded-tr-none"
                                                    : "bg-white text-gray-800 shadow-sm border rounded-tl-none"
                                            }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="text-xs text-gray-500 ml-2">
                                        AI đang phản hồi...
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            
                            <div className="p-3 bg-white border-t flex gap-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) =>
                                        setInputText(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && handleSendMessage()
                                    }
                                    placeholder="Nhập câu hỏi..."
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-400"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isLoading}
                                    className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            
            <button
                onClick={handleToggleChat}
                className="transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-xl"
                title="Trò chuyện với trợ lý AI"
            >
                <MessageCircle size={32} />
            </button>
        </div>
    );
};

export default AIChatWidget;
