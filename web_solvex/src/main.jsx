import React from "react";
import ReactDOM from "react-dom/client";
import SolvexPageWrapper from "./App.jsx"; // <-- nuestro componente
import "./index.css"; // opcional (de vite)

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <SolvexPageWrapper />
    </React.StrictMode>
);