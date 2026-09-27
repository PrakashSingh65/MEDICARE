import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";

export const signupUser = async (formData) => {
  const response = await axiosClient.post("/api/v1/auth/signup", formData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axiosClient.post("/api/v1/auth/login", credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosClient.post("/api/v1/auth/logout");
  return response.data;
};

export const checkAuthUser = async () => {
  const response = await axiosClient.get("/api/v1/auth/checkAuth");
  return response.data;
};

export const getMeUser = async () => {
  const response = await axiosClient.get("/api/v1/auth/me");
  return response.data;
};

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      if (data?.user) {
        queryClient.setQueryData(["auth"], data);
      }
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data?.user) {
        queryClient.setQueryData(["auth"], data);
      }
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(["auth"], null);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
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

