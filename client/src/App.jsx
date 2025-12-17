import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { Button } from "flowbite-react";
import Friends from "./pages/Friends";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
function App() {
    const client = new QueryClient();

    return (
        <QueryClientProvider client={client}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/friends" element={<Friends />} />
<<<<<<< HEAD
                    <Route path="/chat" element={<Chat />} />
=======
>>>>>>> b1fcb0248c8b95b097174224f98738ef26190c4f
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
