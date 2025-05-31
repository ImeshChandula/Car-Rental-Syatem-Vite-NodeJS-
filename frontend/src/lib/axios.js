import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login page when token expires
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);