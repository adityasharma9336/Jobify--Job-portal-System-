import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';

const MessagesPage = () => {
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
        fetchConversations();
    }, []);

    useEffect(() => {
        if (activeChat) {
            // Only fetch messages if it's an existing chat (not a temporary new one without ID if we want to support that, 
            // but here we just fetching by user ID so it's fine even if empty)
            fetchMessages(activeChat.user._id);
        }
    }, [activeChat]);

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/messages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setConversations(data);

                // Handle starting a new chat if requested via navigation state
                if (location.state?.startChatWith) {
                    const targetUserId = location.state.startChatWith;
                    const existingChat = data.find(c => c.user._id === targetUserId);

                    if (existingChat) {
                        setActiveChat(existingChat);
                    } else {
                        // Fetch user details to start a new chat
                        const userRes = await fetch(`/api/users/${targetUserId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (userRes.ok) {
                            const userData = await userRes.json();
                            const newChat = {
                                user: userData,
                                lastMessage: null
                            };
                            setConversations(prev => [newChat, ...prev]);
                            setActiveChat(newChat);
                        }
                    }
                    // Clear state to avoid reopening on refresh (optional, but good UX)
                    window.history.replaceState({}, document.title);
                } else if (data.length > 0 && !activeChat) {
                    setActiveChat(data[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/messages/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiverId: activeChat.user._id,
                    content: newMessage
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessages([...messages, data]);
                setNewMessage('');
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="bg-jobify text-white font-display min-h-screen flex overflow-hidden relative">
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] orb-glow-1"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[700px] h-[700px] orb-glow-2"></div>
            </div>

            <main className="flex-1 p-6 lg:p-10 h-screen overflow-y-auto relative z-10 custom-scrollbar flex flex-col">
                <DashboardHeader />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 flex gap-6 max-h-[calc(100vh-140px)]"
                >
                    {/* Conversations List */}
                    <div className="w-80 glass-panel rounded-2xl flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-white/10">
                            <h2 className="font-bold text-lg">Messages</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                            {conversations.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 text-sm">No conversations yet</div>
                            ) : (
                                conversations.map((chat) => (
                                    <div
                                        key={chat.user._id}
                                        onClick={() => setActiveChat(chat)}
                                        className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-all ${activeChat?.user._id === chat.user._id ? 'bg-primary/20 border border-primary/30' : 'hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <div className="size-10 rounded-full bg-gradient-to-br from-primary to-secondary p-[1px]">
                                            <img
                                                src={chat.user.avatar || "https://ui-avatars.com/api/?name=" + chat.user.name}
                                                alt={chat.user.name}
                                                className="rounded-full w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm truncate">{chat.user.name}</h4>
                                            <p className="text-xs text-gray-400 truncate">{chat.lastMessage?.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden">
                        {activeChat ? (
                            <>
                                <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                                    <div className="size-10 rounded-full bg-gradient-to-br from-primary to-secondary p-[1px]">
                                        <img
                                            src={activeChat.user.avatar || "https://ui-avatars.com/api/?name=" + activeChat.user.name}
                                            alt={activeChat.user.name}
                                            className="rounded-full w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{activeChat.user.name}</h3>
                                        <p className="text-xs text-green-400">Online</p>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 flex flex-col">
                                    {messages.map((msg) => {
                                        const isMe = msg.sender === user?._id;
                                        return (
                                            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] p-3 rounded-2xl ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none'
                                                    }`}>
                                                    <p className="text-sm">{msg.content}</p>
                                                    <span className="text-[10px] opacity-50 block text-right mt-1">
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5 flex gap-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-primary hover:bg-primary/80 text-white rounded-xl px-4 py-2 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">send</span>
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                <span className="material-symbols-outlined text-6xl mb-4 text-gray-700">chat</span>
                                <p>Select a conversation to start messaging</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default MessagesPage;
