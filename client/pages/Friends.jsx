import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
const Friends = () => {
    return (
        <div className="text-gray-600 flex items-center m-2 justify-between">
            <h1>Catch up from last time</h1>
            <div className="flex items-center w-64 border border-amber-900 rounded-xl overflow-hidden bg-white shadow-sm">
                <input
                    type="text"
                    placeholder="Search Friends.."
                    className="flex-1 px-3 py-2 outline-none bg-transparent text-amber-900 placeholder-amber-700"
                />
                <button className="px-3 transition cursor-pointer">
                    <FaSearch className="text-amber-900 " />
                </button>
            </div>
        </div>
    );
};

export default Friends;
