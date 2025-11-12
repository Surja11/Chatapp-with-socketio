import { useMutation } from "@tanstack/react-query";
import { login, register } from "../api/authapi";

export const useLogin = () => {
    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);
            localStorage.setItem("email", data.email);
        },
        onError: (error) => {
            console.log(error);
        },
    });
    return mutation;
};

export const useRegister = () => {
    const mutation = useMutation({
        mutationFn: register,
        onSuccess: () => {
            console.log("registered");
        },
        onError: (error) => {
            console.log(error);
        },
    });
    return mutation;
};
