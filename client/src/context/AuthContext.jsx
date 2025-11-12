import { createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return <AuthContext.Provider>{children}</AuthContext.Provider>;
};
