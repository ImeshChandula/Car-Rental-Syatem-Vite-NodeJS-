import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async () =>{
        try {
            const res = await axiosInstance.get("/auth/checkCurrent");

            if (res.data && res.status === 200) {
                // Only set authUser if the account is verified
                if (res.data.isAccountVerified) {
                    set({ authUser: res.data });
                    console.log("Auth user set:", res.data);
                } else {
                    set({ authUser: null });
                    console.log("Gmail Account not verified, auth not set");
                    toast.error("Please verify your gmail account to continue");
                }
            } else {
                set({ authUser: null });
            }
        } catch (error) {
            console.log("Error in checkAuth: ", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/register", data);
            
            // Check if the response contains user data and has a success status
            if (res.data && res.data.user && res.status >= 200 && res.status < 300) {
                set({ authUser: res.data.user });
                toast.success("Account Created Successfully");
                return res.data;
            } else {
                // If response doesn't contain expected data
                const errorMessage = "Registration failed: Invalid server response";
                toast.error(errorMessage);
                throw new Error(errorMessage);
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
            if (!data.email || !data.password) {
                throw new Error("Email and password are required");
            }

            const cleanedData = {
                email: data.email.trim().toLowerCase(),
                password: data.password
            };

            const res = await axiosInstance.post("/auth/login", cleanedData);
            if (res.data && res.data.user) {
                set({ authUser: res.data.user });
                toast.success("Logged in successfully");
                return res.data;
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
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