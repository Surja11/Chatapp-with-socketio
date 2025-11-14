import React from 'react'

const FriendCard = ({friend,index}) => {
  return (
    <div
                                key={index}
                                className="flex p-2 bg-gray-50 rounded-md mb-2 shadow justify-between"
                            >
                                <div>
                                    <h1 className="m-1">{friend.username}</h1>
                                    <h1 className="text-[12px] m-1">
                                        {friend.email}
                                    </h1>
                                </div>
                                <div>
                                    <button className="mt-1 rounded-xl border bg-[#271300] text-gray-50 w-22 p-2 text-[12px]">
                                        Message 💬
                                    </button>
                                </div>
                            </div>
                      
  )
}

export default FriendCard