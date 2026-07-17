import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/tenantMessages.css";

function TenantMessages() {

    const owners = [

        {
            id: 1,
            name: "Rajesh Kumar",
            role: "Property Owner",
            property: "Luxury Apartment",
            online: true,
            avatar: "/default-profile.png"
        },

        {
            id: 2,
            name: "Anita Das",
            role: "Property Owner",
            property: "2 BHK Flat",
            online: false,
            avatar: "/default-profile.png"
        },

        {
            id: 3,
            name: "Suresh Mohanty",
            role: "Property Owner",
            property: "Independent House",
            online: true,
            avatar: "/default-profile.png"
        }

    ];

    const [selectedOwner, setSelectedOwner] = useState(owners[0]);

    const [messages, setMessages] = useState([

        {
            sender: "owner",
            text: "Hello, are you interested in the property?"
        },

        {
            sender: "tenant",
            text: "Yes, I would like to know more."
        },

        {
            sender: "owner",
            text: "Sure! Feel free to ask."
        }

    ]);

    const [message, setMessage] = useState("");

    const sendMessage = () => {

        if (message.trim() === "") return;

        setMessages([

            ...messages,

            {

                sender: "tenant",

                text: message

            }

        ]);

        setMessage("");

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

                    {

                        owners.map((owner) => (

                            <div

                                key={owner.id}

                                className={`chat-user ${selectedOwner.id === owner.id ? "active-user" : ""}`}

                                onClick={() => setSelectedOwner(owner)}

                            >

                                <img

                                    src={owner.avatar}

                                    alt=""

                                    className="sidebar-avatar"

                                />

                                <div>

                                    <h4>{owner.name}</h4>

                                    <p>{owner.property}</p>

                                </div>

                                <span className={owner.online ? "online" : "offline"}>

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

                                src={selectedOwner.avatar}

                                alt=""

                                className="header-profile"

                            />

                            <div>

                                <h2>{selectedOwner.name}</h2>

                                <p>{selectedOwner.role}</p>

                            </div>

                        </div>

                        <span>

                            {selectedOwner.online ? "🟢 Online" : "⚪ Offline"}

                        </span>

                    </div>

                    <div className="chat-body">

                        {

                            messages.map((msg, index) => (

                                <div

                                    key={index}

                                    className={msg.sender === "tenant" ? "sent-message" : "received-message"}

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

export default TenantMessages;