import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";



import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="573510406790-9o2cefg53o2s2hd0jf5k454kcrauompq.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>
);
