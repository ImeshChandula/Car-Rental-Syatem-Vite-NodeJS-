import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isGoogleLoading: false,

    isCheckingAuth: true,

    checkAuth: async () =>{
        try {
            const res = await axiosInstance.get("/auth/checkAuth");

            if (res.data.success && res.data.data) {
                set({ authUser: res.data.data });
                console.log("Auth user set:", res.data.data);
            } else {
                set({ authUser: null });
                if (res.data.message) {
                    toast.error(res.data.message);
                }
            }
        } catch (error) {
            console.log("Error in checkAuth: ", error);
            set({ authUser: null });
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            }
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signupAdmin: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/register/admin", data);
            
            if (res.data.success && res.data.data) {
                toast.success(res.data?.message || "Registration Successful.");
            } else {
                const errorMessage = "Registration failed: Invalid server response";
                if (res.data.message) {
                    toast.error(res.data.message);
                }
                throw new Error(res.data.message || errorMessage);
            }
        } catch (error) {
            // Handle API errors with proper error message
            const errorMessage = error.response?.data?.message || 
                               "Failed to create account. Please try again.";
            toast.error(errorMessage);
            throw error;
        } finally {
            set({ isSigningUp: false })
        }
    },

    signupUser: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/register/user", data);
            
            if (res.data.success && res.data.data) {
                toast.success(res.data?.message || "Registration Successful.");
            } else {
                const errorMessage = "Registration failed: Invalid server response";
                if (res.data.message) {
                    toast.error(res.data.message);
                }
                throw new Error(res.data.message || errorMessage);
            }
        } catch (error) {
            // Handle API errors with proper error message
            const errorMessage = error.response?.data?.message || 
                               "Failed to create account. Please try again.";
            toast.error(errorMessage);
            throw error;
        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            if (res.data.success && res.data.data) {
                set({ authUser: res.data.data });
                toast.success(res.data?.message || "Logged in successfully");
                return res.data.data;
            } else {
                set({ authUser: null });
                if (res.data.message) {
                    toast.error(res.data.message);
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || error.message);
            throw error;
        } finally {
            set({ isLoggingIn: false });
        }
    },

    googleLogin: async (token) => {
        set({ isGoogleLoading: true });
        try {
            if (!token) {
                throw new Error("Google token is required");
            }

            const res = await axiosInstance.post("/google/auth", { token });
            
            if (res.data.success && res.data.data) {
                set({ authUser: res.data.data });
                toast.success(res.data.message || "Logged in with Google successfully");
                return res.data.data;
            } else {
                set({ authUser: null });
                if (res.data.message) {
                    toast.error(res.data.message);
                }
            }
        } catch (error) {
            console.error("Google login error:", error);
            const errorMessage = error.response?.data?.message || 
                               "Failed to login with Google. Please try again.";
            toast.error(errorMessage);
            throw error;
        } finally {
            set({ isGoogleLoading: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });

            toast.success("Logged out Successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },


}));