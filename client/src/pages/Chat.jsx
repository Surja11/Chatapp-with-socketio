import React, { useContext, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket";
import axios from "axios";
import { getPreviousChat } from "../api/chatapi";

const Chat = () => {
    const location = useLocation();
    const friend = location.state?.friend;

    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load chat history
    useEffect(() => {
        if (!user || !friend) return;

        const loadHistory = async () => {
            try {
                setIsLoading(true);
                console.log("Friend email:", friend.email);
                console.log("User email:", user.email);

                const response = await getPreviousChat(friend.email);
                console.log("Friend email:", friend.email);
                console.log("User email:", user.email);

                setMessages(response.data.messages);
            } catch (error) {
                console.error("Failed to load chat history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadHistory();
    }, [user, friend]);

    // Socket connection
    useEffect(() => {
        if (!user || !friend) return;

        socket.connect();

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            socket.emit("register", { user_id: user.email });
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        // Handle incoming messages
        socket.on("receive_message", (msg) => {
            console.log("Received message:", msg);
            if (msg.user_id === friend.email) {
                setMessages((prev) => {
                    const exists = prev.some((m) => m._id === msg._id);
                    return exists ? prev : [...prev, msg];
                });
            }
        });

        // Handle message sent confirmation
        socket.on("message_sent", (msg) => {
            console.log("Message sent confirmation:", msg);
            setMessages((prev) => {
                const exists = prev.some((m) => m._id === msg._id);
                return exists ? prev : [...prev, msg];
            });
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("receive_message");
            socket.off("message_sent");
            socket.disconnect();
        };
    }, [user, friend]);

    const sendMessage = () => {
        if (!text.trim()) return;

        // Always send - backend handles online/offline
        socket.emit("send_message", {
            user_id: user.email,
            friend_id: friend.email,
            text: text.trim(),
        });

        setText("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!user) return <div className="p-4">Loading user...</div>;
    if (!friend) return <div className="p-4">No friend selected</div>;

    return (
        <div className="chat-container flex flex-col h-screen max-w-4xl mx-auto p-4">
            {/* Header */}
            <div className="bg-gray-200 p-4 rounded-lg mb-4">
                <h2 className="text-xl font-semibold">{friend.username}</h2>
                <span className="text-sm text-gray-600">{friend.email}</span>
            </div>

            {/* Messages */}
            <div className="messages flex-1 overflow-y-auto space-y-3 mb-4 bg-gray-100 p-4 rounded-lg">
                {isLoading ? (
                    <div className="text-center text-gray-500 mt-8">
                        Loading chat history...
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        No messages yet. Start the conversation! 👋
                    </div>
                ) : (
                    <>
                        {messages.map((m) => (
                            <div
                                key={m._id}
                                className={`flex ${
                                    m.user_id === user.email
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
                                        m.user_id === user.email
                                            ? "bg-[#714a96] text-white rounded-br-none"
                                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                                    }`}
                                >
                                    <p className="break-words">{m.text}</p>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs opacity-75">
                                            {new Date(
                                                m.sent_at,
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                        {m.user_id === user.email && (
                                            <span className="text-xs ml-2">
                                                {m.delivered ? "✓✓" : "✓"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Bar - No disabled state */}
            <div className="input-bar flex gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <button
                    onClick={sendMessage}
                    disabled={!text.trim()}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
