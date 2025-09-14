import { create } from "zustand";
import api from "../api/api";

const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,

  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", res.data.accessToken);
    set({ user: res.data.user, accessToken: res.data.accessToken });
  },

  signup: async (name, email, password) => {
    const res = await api.post("/auth/signup", { name, email, password });
    localStorage.setItem("accessToken", res.data.accessToken);
    set({ user: res.data.user, accessToken: res.data.accessToken });
  },

  logout: async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    set({ user: null, accessToken: null });
  },
}));

export default useAuthStore;
