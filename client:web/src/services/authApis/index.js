import api from "../api";

export const registerApi = async (data) => {
  const response = await api().post("/auth/register", {
    ...data,
  });

  return response;
};
export const checkUsername = async (data) => {
  const response = await api().post("/auth/username", {
    username: data,
  });
  return response;
};

export const loginApi = async (data) => {
  const response = await api().post("/auth/login", {
    ...data,
  });

  return response;
};

export const forgotPasswordApi = async (data) => {
  const response = await api().post("/auth/forget-password", {
    ...data,
  });

  return response;
};

export const resetPasswordApi = async (data) => {
  const response = await api().post(`/auth/reset-password/${data.token}`, {
    ...data,
    token: null,
  });

  return response;
};
