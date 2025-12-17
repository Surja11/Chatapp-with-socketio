import { useQuery } from "@tanstack/react-query";
import { searchFriends } from "../api/chatapi";

export const useSearchFriends = (searchTerm) => {
    return useQuery({
        queryKey: ["searchFriends", searchTerm],
        queryFn: () => searchFriends(searchTerm),
        enabled: !!searchTerm,
    });
};
