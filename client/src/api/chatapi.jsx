import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const searchFriends = async (searchTerm) => {
    const access = localStorage.getItem("access_token");

    const res = await axios.get(`${API_URL}friends/${searchTerm}`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
    });
    return res.data;
};

export const getPreviousChat = async (email) => {
    const response = await axios.get(
        `${API_URL}chat/history?friend_id=${email}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        },
    );
    return response;
};

export const getRecentlyCatchedFriends = async () => {
    const response = await axios.get(`${API_URL}chat/recent`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
    });
    return response;
};
