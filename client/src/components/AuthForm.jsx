import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogin, useRegister } from "../hooks/authhooks";
import { AuthContext } from "../context/AuthContext";

const AuthForm = ({ method }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const login = useLogin();
    const register = useRegister();

    // const { checkAuth } = useContext(AuthContext);

    const name = method === "login" ? "Login" : "Register";

    const isRegister = method === "register";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || (isRegister && (!username || !password2))) {
            alert("Please fill all required fields");
            return;
        }

        if (isRegister && password !== password2) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            if (!isRegister) {
                await login.mutateAsync({ email, password });
                navigate("/friends");
                console.log("Saved tokens:", {
                    access: localStorage.getItem("access"),
                    refresh: localStorage.getItem("refresh"),
                });
            } else {
                await register.mutateAsync({ email, password, username });
                alert("registered successfully");
            }
        } catch (error) {
            alert(error);
            
        } finally {
            setLoading(false);
            setEmail("");
            setPassword("");
            setUsername("");
            setPassword2("");
        }
    };

    return (
        <div className="min-h-screen bg-[#271300]">
            <div className=" text-gray-200 flex  flex-col space-y-10 items-center">
                <h1 className="text-center font-semibold text-2xl text-amber-100 mt-12 w-xl">
                    {name}
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-center justify-center p-4 rounded-xl shadow shadow-yellow-50 border border-yellow-50 w-2xl "
                >
                    <div className="flex flex-col my-3">
                        <label className="m-1 text-amber-100">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-amber-100 w-[90%] m-1 p-1 rounded brightness-90 focus:border focus:outline-pink-100 text-purple-950"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {method === "register" && (
                        <div className="flex flex-col mb-3 mx-5">
                            <label className="m-1 text-amber-100">
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                className="w-[90%] m-1 p-1 focus:border-2 rounded bg-amber-100 brightness-90
                            focus:outline-pink-100 text-purple-950"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="flex flex-col mb-3 mx-5">
                        <label className="m-1 text-amber-100">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-[90%] m-1 p-1 focus:border rounded bg-amber-100 brightness-90 
                        focus:outline-pink-100 text-purple-950"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {method === "register" && (
                        <div className="flex flex-col">
                            <label className="m-1 text-amber-100">
                                Retype Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password again"
                                className="w-[90%] m-1 p-1 focus:border
                            focus:outline-pink-100 text-purple-950 rounded bg-amber-100 brightness-90"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="p-2 rounded-2xl bg-amber-100 mt-6 px-4 brightness-90 text-purple-950 font-semibold hover:bg-[#eab8e4]"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : name}
                    </button>

                    {method === "login" ? (
                        <p className="text-center text-amber-100 mt-2">
                            Don't have an account?{" "}
                            <NavLink
                                to="/register"
                                className="text-blue-500 underline"
                            >
                                Register
                            </NavLink>
                        </p>
                    ) : (
                        <p className="text-center text-amber-100 mt-2">
                            Already have an account?{" "}
                            <NavLink
                                to="/login"
                                className="text-blue-500 underline"
                            >
                                Login
                            </NavLink>
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AuthForm;
