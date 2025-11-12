import { Button } from "flowbite-react";
import React from "react";
import Friends from "./Friends";
import { NavLink } from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen bg-yellow-50 text-gray-200 ">
            <header>
                <div className="flex items-center justify-around bg-[#271300]">
                    <h1 className="font-semibold text-center text-2xl  text-[#f5bf63] p-5">
                        Catch up with texts!!
                    </h1>
                    <NavLink
                        to="/login"
                        className="bg-yellow-100 hover:bg-yellow-200 text-amber-800 cursor-pointer p-2 rounded-2xl px-4"
                    >
                        Login
                    </NavLink>
                </div>
            </header>

            <hr className="text-gray-400" />

            <Friends />
        </div>
    );
};

export default Home;
