import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const access = localStorage.getItem("access_token");
                if (!access) {
                    setLoading(false);
                    return;
                }

                const res = await axios.get(`${API_URL}me`, {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                });

                setIsAuthenticated(true);
                setUser(res.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                setIsAuthenticated,
                loading,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
