import { Button } from "flowbite-react";
import React from "react";
import Friends from "./Friends";
import { NavLink } from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen bg-[#271300]">
        <header className="bg-[#271300] p-5 ">
            
            <h1 className="font-semibold text-2xl text-[#d5cab4] text-center underline">Zappy💬</h1>

        </header>
        <div className="flex flex-col items-center justify-center bg-[#271300] mt-20">
            
                <div className="flex flex-col items-center justify-center gap-11
                ">
                    <h1 className="font-semibold text-center text-2xl text-[#e0d9cb] p-5">
                        Haven't talked to your loved ones for a long time?🥰🥰
                    </h1>
                     <h1 className="font-semibold text-center text-2xl  text-[#e0d9cb] p-5">
                        Catch up quickly with them through Zappy 💌💌
                    </h1>
                    <div className="flex space-x-10">
                    <NavLink
                        to="/login"
                        className="bg-yellow-100 hover:bg-yellow-200 text-amber-800 cursor-pointer p-2 rounded-2xl px-5"
                    >
                        Login
                    </NavLink>

                    <NavLink
                        to="/register"
                        className="bg-yellow-100 hover:bg-yellow-200 text-amber-800 cursor-pointer p-2 rounded-2xl px-4"
                    >
                        
                        
                    Register                   </NavLink>
                    </div>
                </div>
            

        </div>
        </div>
    );
};

export default Home;
