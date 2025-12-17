import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSearchFriends } from "../hooks/chathooks";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import FriendCard from "../components/FriendCard";
import { getRecentlyCatchedFriends } from "../api/chatapi";

const Friends = () => {
    const [searchInput, setSearchInput] = useState(""); // input field
    const [searchTerm, setSearchTerm] = useState(""); // triggers search
    const [showSearchedFriends, setShowSearchedFriends] = useState(false);
    const [recentlyChattted, setRecentlyChatted] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getRecentlyCatchedFriends();
                setRecentlyChatted(res.data);
            } catch (err) {
                console.error("Error fetching chats:", err);
            }
        };

        fetchData();
    }, []);
    const { data: friends, isLoading, isError } = useSearchFriends(searchTerm);

    const handleSearch = () => {
        setSearchTerm(searchInput);
        setShowSearchedFriends(true);
    };
    return (
        <div className="min-h-screen bg-gray-200 p-4">
            {/* Header */}
            <div className="flex items-center justify-between text-purple-500 mb-4">
                {showSearchedFriends ? (
                    <div className="flex items-center gap-5">
                        <IoArrowBackSharp
                            className="cursor-pointer text-xl"
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

                {/* Search Box */}
                <div className="flex items-center w-64 border border-amber-900 rounded-xl overflow-hidden bg-white shadow-sm">
                    <input
                        type="text"
                        placeholder="Search Friends..."
                        className="flex-1 px-3 py-2 outline-none bg-transparent text-amber-900 placeholder-amber-700"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button
                        className="px-3 cursor-pointer transition"
                        onClick={handleSearch}
                    >
                        <FaSearch className="text-amber-900" />
                    </button>
                </div>
            </div>

            {/* Recently Chatted Friends */}
            {!showSearchedFriends && (
                <div className="bg-gray-300 rounded-xl p-4 shadow-sm">
                    {recentlyChattted.length > 0 ? (
                        <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                            {recentlyChattted.map((chat, index) => (
                                <FriendCard friend={chat.user} key={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500">No recent chats</div>
                    )}
                </div>
            )}

            {/* Search Results */}
            {showSearchedFriends && (
                <div className="p-4 bg-white rounded-xl shadow-sm">
                    {isLoading && <div>Searching...</div>}
                    {isError && (
                        <div className="text-red-500">
                            Error searching friends
                        </div>
                    )}

                    {friends && friends.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {friends.map((friend, index) => (
                                <FriendCard friend={friend} key={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500">No friend found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Friends;
