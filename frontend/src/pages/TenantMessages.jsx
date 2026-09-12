import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/tenantMessages.css";
import api from "../utils/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

function TenantMessages() {
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const chatBodyRef = useRef(null);

    // Current logged-in user
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const isOwnMessage = (msg) => msg.sender === currentUser?._id || msg.sender?._id === currentUser?._id;

    const refreshConversations = async () => {
        const { data } = await api.get("/messages/conversations");
        setConversations(data);
        setSelectedConv((prev) => {
            if (!prev) return data[0] || null;
            const updated = data.find((conv) => conv.partner._id === prev.partner._id);
            return updated || data[0] || null;
        });
    };

    // Load all conversations on mount
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const { data } = await api.get("/messages/conversations");
                setConversations(data);

                // Auto-select partner if navigated from Chat button on PropertyDetails
                const partnerId = sessionStorage.getItem("chatPartnerId");
                if (partnerId) {
                    sessionStorage.removeItem("chatPartnerId");
                    const existing = data.find((c) => c.partner._id === partnerId);
                    if (existing) {
                        // Existing conversation — select it
                        setSelectedConv(existing);
                    } else {
                        // New conversation — fetch partner's public profile to populate the header
                        try {
                            const { data: partner } = await api.get(`/users/${partnerId}`);
                            setSelectedConv({
                                partner,
                                lastMessage: "",
                            });
                        } catch {
                            // Fallback stub if user lookup fails
                            setSelectedConv({
                                partner: { _id: partnerId, firstName: "Owner", lastName: "", role: "landlord" },
                                lastMessage: "",
                            });
                        }
                    }
                } else if (data.length > 0) {
                    setSelectedConv(data[0]);
                }
            } catch (err) {
                console.error("Error loading conversations:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    // Load messages when a conversation is selected (with polling)
    useEffect(() => {
        if (!selectedConv) return;
        const fetchMessages = async () => {
            try {
                const { data } = await api.get(`/messages/${selectedConv.partner._id}`);
                setMessages(data);
            } catch (err) {
                console.error("Error loading messages:", err);
            }
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [selectedConv]);

    // Auto-scroll on new messages
    useEffect(() => {
        chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
    }, [messages.length]);

    const handleSend = async () => {
        if (!messageText.trim() || !selectedConv) return;
        try {
            setSending(true);
            const { data } = await api.post("/messages/send", {
                receiverId: selectedConv.partner._id,
                text: messageText,
            });
            setMessages((prev) => [...prev, data]);
            setMessageText("");
            // After first message is sent, refresh conversations sidebar so partner shows up
            const { data: convData } = await api.get("/messages/conversations");
            setConversations(convData);
            setTimeout(() => {
                chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
            }, 100);
        } catch (err) {
            console.error("Failed to send message:", err);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (!window.confirm("Delete this message?")) return;
        try {
            await api.delete(`/messages/${messageId}`);
            setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
            await refreshConversations();
        } catch (err) {
            console.error("Failed to delete message:", err);
        }
    };

    const handleUpdateMessage = async (messageId) => {
        if (!editingText.trim()) return;
        try {
            const { data } = await api.put(`/messages/${messageId}`, { text: editingText });
            setMessages((prev) => prev.map((msg) => (msg._id === messageId ? data : msg)));
            setEditingMessageId(null);
            setEditingText("");
        } catch (err) {
            console.error("Failed to edit message:", err);
        }
    };

    const handleDeleteConversation = async () => {
        if (!selectedConv) return;
        if (!window.confirm(`Delete this conversation with ${selectedConv.partner.firstName}?`)) return;
        try {
            await api.delete(`/messages/conversation/${selectedConv.partner._id}`);
            const remaining = conversations.filter((conv) => conv.partner._id !== selectedConv.partner._id);
            setConversations(remaining);
            setMessages([]);
            setSelectedConv(remaining[0] || null);
        } catch (err) {
            console.error("Failed to delete conversation:", err);
        }
    };

    return (
        <div className="tenant-messages-page">
            <Navbar />

            <div className="messages-container">
                {/* Sidebar */}
                <div className="chat-list">
                    <h2>Messages</h2>
                    <input
                        type="text"
                        className="chat-search"
                        placeholder="Search Owner..."
                    />

                    {loading ? (
                        <p style={{ padding: "12px" }}>Loading conversations...</p>
                    ) : conversations.length === 0 && !selectedConv ? (
                        <p style={{ padding: "12px", fontSize: "13px", color: "#888" }}>No conversations yet.</p>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv.partner._id}
                                className={`chat-user ${selectedConv?.partner._id === conv.partner._id ? "active-user" : ""}`}
                                onClick={() => setSelectedConv(conv)}
                            >
                                <img
                                    src={conv.partner.profilePicture?.startsWith("/uploads")
                                        ? BACKEND_URL + conv.partner.profilePicture
                                        : conv.partner.profilePicture || "/default-profile.png"}
                                    alt=""
                                    className="sidebar-avatar"
                                />
                                <div>
                                    <h4>{conv.partner.firstName} {conv.partner.lastName}</h4>
                                    <p style={{ fontSize: "12px", color: "#888" }}>{conv.lastMessage}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Chat Window */}
                <div className="chat-window">
                    {selectedConv ? (
                        <>
                            <div className="chat-header">
                                <div className="chat-header-left">
                                    <img
                                        src={selectedConv.partner.profilePicture?.startsWith("/uploads")
                                            ? BACKEND_URL + selectedConv.partner.profilePicture
                                            : selectedConv.partner.profilePicture || "/default-profile.png"}
                                        alt=""
                                        className="header-profile"
                                    />
                                    <div>
                                        <h2>{selectedConv.partner.firstName} {selectedConv.partner.lastName}</h2>
                                        <p>Property Owner</p>
                                    </div>
                                </div>
                                <button className="delete-conversation-btn" onClick={handleDeleteConversation}>Delete Chat</button>
                            </div>

                            <div className="chat-body" ref={chatBodyRef}>
                                {messages.map((msg) => {
                                    const own = isOwnMessage(msg);
                                    return (
                                        <div
                                            key={msg._id}
                                            className={own ? "sent-message" : "received-message"}
                                        >
                                            {editingMessageId === msg._id ? (
                                                <div className="message-edit-box">
                                                    <input
                                                        value={editingText}
                                                        onChange={(e) => setEditingText(e.target.value)}
                                                        className="message-edit-input"
                                                    />
                                                    <div className="message-edit-actions">
                                                        <button onClick={() => handleUpdateMessage(msg._id)} className="save-message-btn">Save</button>
                                                        <button onClick={() => { setEditingMessageId(null); setEditingText(""); }} className="cancel-message-btn">Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="message-content">{msg.text}</div>
                                                    {own && (
                                                        <div className="message-control-row">
                                                            <button
                                                                className="message-action-btn"
                                                                onClick={() => { setEditingMessageId(msg._id); setEditingText(msg.text); }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="message-action-btn danger"
                                                                onClick={() => handleDeleteMessage(msg._id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="chat-input">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <button onClick={handleSend} disabled={sending}>
                                    {sending ? "..." : "Send"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#888" }}>
                            Select a conversation to start chatting
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default TenantMessages;