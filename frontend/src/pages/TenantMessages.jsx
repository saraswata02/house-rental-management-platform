import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/tenantMessages.css";
import api from "../utils/api";

const BACKEND_URL = "http://localhost:5000";

function TenantMessages() {
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const chatBodyRef = useRef(null);

    // Current logged-in user
    const currentUser = JSON.parse(localStorage.getItem("user"));

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

    // Load messages when a conversation is selected
    useEffect(() => {
        if (!selectedConv) return;
        const fetchMessages = async () => {
            try {
                const { data } = await api.get(`/messages/${selectedConv.partner._id}`);
                setMessages(data);
                setTimeout(() => {
                    chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
                }, 100);
            } catch (err) {
                console.error("Error loading messages:", err);
            }
        };
        fetchMessages();
    }, [selectedConv]);

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
                                        <p>{selectedConv.partner.role === "landlord" ? "Property Owner" : "Tenant"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="chat-body" ref={chatBodyRef}>
                                {messages.map((msg) => (
                                    <div
                                        key={msg._id}
                                        className={msg.sender === currentUser?._id || msg.sender?._id === currentUser?._id
                                            ? "sent-message"
                                            : "received-message"}
                                    >
                                        {msg.text}
                                    </div>
                                ))}
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