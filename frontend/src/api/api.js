import axios from "axios";

const API = axios.create({
  baseURL: "https://bansalbackend-bnbk.onrender.com", // Backend URL
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const loginAPI = (data) => API.post("/api/auth/login", data);
export const signupAPI = (data) => API.post("/api/auth/register", data);
export const uploadMediaAPI = (formData) =>
  API.post("/api/media/upload", formData);
export const fetchMediaAPI = () => API.get("/api/media");
export const toggleStarredAPI = (mediaId) => {
  return API.post("/api/media/toggleStarred", { mediaId });
};
export const getAllUsers = () => API.get("/api/auth/getallusers");
export const deleteMediaAPI = (mediaId) => {
  return API.delete(`/api/media/delete/${mediaId}`);
};
