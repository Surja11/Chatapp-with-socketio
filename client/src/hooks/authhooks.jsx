import { useMutation } from "@tanstack/react-query";
import { login, register } from "../api/authapi";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useLogin = () => {
    const { setUser, setIsAuthenticated } = useContext(AuthContext);
    const mutation = useMutation({
        mutationFn: login,
        onSuccess: async (data) => {
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);
            localStorage.setItem("email", data.email);
            const res = await axios.get(`${API_URL}me`, {
                headers: {
                    Authorization: `Bearer ${data.access}`,
                },
            });

            setUser(res.data);
            setIsAuthenticated(true);
        },
        onError: (error) => {
            console.log(error);
        },
    });
    return mutation;
};

export const useRegister = () => {
    const mutation = useMutation({
        mutationFn: register,
        onSuccess: () => {
            console.log("registered");
        },
        onError: (error) => {
            console.log(error);
        },
    });
    return mutation;
};
