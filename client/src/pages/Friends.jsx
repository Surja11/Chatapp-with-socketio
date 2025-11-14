import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSearchFriends } from "../hooks/chathooks";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import FriendCard from "../components/FriendCard";

const Friends = () => {
    const [searchInput, setSearchInput] = useState(""); // input field
    const [searchTerm, setSearchTerm] = useState(""); // triggers search
    const [showSearchedFriends, setShowSearchedFriends] = useState(false);
    const navigate = useNavigate();

    const { data: friends, isLoading, isError } = useSearchFriends(searchTerm);

    const handleSearch = () => {
        setSearchTerm(searchInput);
        setShowSearchedFriends(true);
    };

    return (
        <div className="min-h-screen bg-yellow-100">
            <div className="text-gray-600 flex items-center p-4 justify-between">
                {showSearchedFriends ? (
                    <div className="flex items-center justify-between gap-5">
                        <IoArrowBackSharp
                            className="cursor-pointer"
                            onClick={() => {
                                setShowSearchedFriends(false);
                                setSearchInput("");
                                setSearchTerm("");
                            }}
                        />
                        <h1 className="font-semibold text-xl">Found Friends</h1>
                    </div>
                ) : (
                    <h1 className="font-semibold text-xl">
                        Catch up from last time
                    </h1>
                )}

                <div className="flex items-center w-64 border border-amber-900 rounded-xl overflow-hidden bg-white shadow-sm">
                    <input
                        type="text"
                        placeholder="Search Friends.."
                        className="flex-1 px-3 py-2 outline-none bg-transparent text-amber-900 placeholder-amber-700"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />

                    <button
                        className="px-3 transition cursor-pointer"
                        onClick={handleSearch}
                    >
                        <FaSearch className="text-amber-900" />
                    </button>
                </div>
            </div>

            {showSearchedFriends && (
                <div className="p-4">
                    {isLoading && <div>Searching...</div>}
                    {isError && <div>Error searching friends</div>}

                    {friends && friends.length > 0 ? (
                        friends.map((friend, index) => (
                            <FriendCard friend = {friend} index={index}/>
                        ))
                    ) : (
                        <div>No friend found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Friends;
