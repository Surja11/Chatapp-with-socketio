import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


export const searchFriends = async(searchTerm)=>{
  
  const access = localStorage.getItem("access_token")

  const res = await axios.get(`${API_URL}friends/${searchTerm}`,{
    headers: {
      Authorization: `Bearer ${access}`
    }
  });
  return res.data;
}
