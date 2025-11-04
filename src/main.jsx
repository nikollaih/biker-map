import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "leaflet/dist/leaflet.css"; // important for marker icons & styling
import "./index.css";
import {AuthProvider} from "./context/AuthContext.jsx"; // your global styles (optional)

createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <App />
    </AuthProvider>
    );
