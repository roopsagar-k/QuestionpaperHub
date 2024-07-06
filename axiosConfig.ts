import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BASE_URL || "https://questionpaper-hub.vercel.app/",
});

export default axiosInstance;
