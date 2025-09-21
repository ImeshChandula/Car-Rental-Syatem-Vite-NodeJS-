import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { clearCookiesForAllDomains } from "../config/domainConfig";
import toast from "react-hot-toast";


export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isGoogleLoading: false,
    isCheckingAuth: true,

    checkAuth: async () =>{
        try {
            set({ isCheckingAuth: true });

            console.log("Starting checkAuth...");
            const res = await axiosInstance.get("/auth/checkAuth");

            if (res.data && res.data.success) {
                set({ authUser: res.data.data });
                console.log("Auth user set:", res.data.data);
                return res.data.data;
            } else {
                console.log("CheckAuth failed:", res.data);
                set({ authUser: null });
                if (res.data?.message) {
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

    isAuthenticated: async () => {
        try {
            const res = await axiosInstance.get("/auth/checkAuth");
            return res.data && res.data.success;
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            return false;
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
                return {user: res.data.data};
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
            console.log("Attempting login...");
            const res = await axiosInstance.post("/auth/login", data);

            if (res.data.success && res.data.data) {
                set({ authUser: res.data.data });
                toast.success(res.data?.message || "Logged in successfully");
                return res.data.data;
            } else {
                console.log("Login response not successful:", res.data);
                set({ authUser: null });
                if (res.data.message) {
                    toast.error(res.data.message);
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || error.message);
            set({ authUser: null });
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
            const response = await axiosInstance.post("/auth/logout");
            
            if (response.data && response.data.success) {
                clearCookiesForAllDomains('jwt');

                localStorage.removeItem('jwt');
                localStorage.removeItem('authToken');
                sessionStorage.removeItem('jwt');
                sessionStorage.removeItem('authToken');

                set({ authUser: null });
                toast.success("Logged out Successfully");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },


}));