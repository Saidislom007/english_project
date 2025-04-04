import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";  // ✅ MantineProvider qo‘shildi
import App from "./components/app/App.jsx";
import { StrictMode } from "react";


ReactDOM.createRoot(document.getElementById("root")).render(

    <StrictMode>

        <App/>
    </StrictMode>
    

);



