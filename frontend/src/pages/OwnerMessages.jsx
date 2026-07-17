import { useState } from "react";
import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import "../styles/ownerMessages.css";

function OwnerMessages() {

    const tenants = [

        {
            id: 1,
            name: "Rahul Sharma",
            role: "Tenant",
            property: "Luxury Apartment",
            online: true,
            avatar: "/default-profile.png"
        },

        {
            id: 2,
            name: "Sneha Das",
            role: "Tenant",
            property: "2 BHK Flat",
            online: false,
            avatar: "/default-profile.png"
        },

        {
            id: 3,
            name: "Amit Kumar",
            role: "Tenant",
            property: "Independent House",
            online: true,
            avatar: "/default-profile.png"
        }

    ];

    const [selectedTenant, setSelectedTenant] = useState(tenants[0]);

    const [messages, setMessages] = useState([

        {
            sender: "tenant",
            text: "Hello Sir."
        },

        {
            sender: "owner",
            text: "Hello Rahul."
        },

        {
            sender: "tenant",
            text: "Can I visit tomorrow?"
        }

    ]);

    const [message, setMessage] = useState("");

    const sendMessage = () => {

        if (message.trim() === "") return;

        setMessages([
            ...messages,
            {
                sender: "owner",
                text: message
            }
        ]);

        setMessage("");

    };

    return (

        <div className="owner-messages-page">

            <OwnerNavbar />

            <div className="messages-container">

                {/* Sidebar */}

                <div className="chat-list">

                    <h2>Messages</h2>

                    <input
                        type="text"
                        className="chat-search"
                        placeholder="Search Tenant..."
                    />

                    {

                        tenants.map((tenant) => (

                            <div

                                key={tenant.id}

                                className={`chat-user ${selectedTenant.id === tenant.id ? "active-user" : ""}`}

                                onClick={() => setSelectedTenant(tenant)}

                            >

                                <img
                                    src={tenant.avatar}
                                    alt=""
                                    className="sidebar-avatar"
                                />

                                <div>

                                    <h4>{tenant.name}</h4>

                                    <p>{tenant.property}</p>

                                </div>

                                <span className={tenant.online ? "online" : "offline"}>

                                    ●

                                </span>

                            </div>

                        ))

                    }

                </div>

                {/* Chat */}

                <div className="chat-window">

                    <div className="chat-header">

                        <div className="chat-header-left">

                            <img

                                src={selectedTenant.avatar}

                                alt=""

                                className="header-profile"

                            />

                            <div>

                                <h2>{selectedTenant.name}</h2>

                                <p>{selectedTenant.role}</p>

                            </div>

                        </div>

                        <span>

                            {selectedTenant.online ? "🟢 Online" : "⚪ Offline"}

                        </span>

                    </div>

                    <div className="chat-body">

                        {

                            messages.map((msg, index) => (

                                <div

                                    key={index}

                                    className={msg.sender === "owner" ? "sent-message" : "received-message"}

                                >

                                    {msg.text}

                                </div>

                            ))

                        }

                    </div>

                    <div className="chat-input">

                        <input

                            type="text"

                            placeholder="Type a message..."

                            value={message}

                            onChange={(e) => setMessage(e.target.value)}

                        />

                        <button onClick={sendMessage}>

                            Send

                        </button>

                    </div>

                </div>

            </div>

            <Footer />

        </div>

    );

}

export default OwnerMessages;