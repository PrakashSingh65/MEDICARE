import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";

const signupUser = async (formData) => {
  const response = await axiosClient.post("/auth/signup", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const loginUser = async (credentials) => {
  const response = await axiosClient.post("/auth/login", credentials);
  return response.data;
};

const logoutUser = async () => {
  const response = await axiosClient.post("/auth/logout");
  return response.data;
};

const checkAuthUser = async () => {
  const response = await axiosClient.get("/auth/checkAuth");
  return response.data;
};

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["auth"]);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["auth"]);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["auth"]);
    },
  });
};

export const useCheckAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: checkAuthUser,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};