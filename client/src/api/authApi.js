import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";

export const signupUser = async (formData) => {
  const response = await axiosClient.post("/api/v1/auth/signup", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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

