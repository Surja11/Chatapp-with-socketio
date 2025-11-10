import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Friends from "../pages/Friends"
import { Button } from "flowbite-react";
function App() {
    return (
        <div className="min-h-screen bg-yellow-50 text-gray-200 ">
            <header>
                <div className="flex items-center justify-around bg-amber-950">
                    <h1 className="font-semibold text-center text-2xl  text-[#f5bf63] p-5">
                        Catch up with texts!!
                    </h1>
                    <Button className="bg-yellow-100 hover:bg-yellow-200 text-amber-800 cursor-pointer">
                        Login
                    </Button>
                </div>
            </header>

            <hr className="text-gray-400" />
            <Friends/>

        </div>
    );
}

export default App;
