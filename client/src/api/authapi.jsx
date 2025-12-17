import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (data) => {
    {
        try {
            const res = await axios.post(`${API_URL}login`, data);
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
};

export const register = async (data) => {
    try {
        const res = await axios.post(`${API_URL}register`, data);
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
