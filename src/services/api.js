import axios from "axios";

// One Axios instance so we never repeat the base URL
const api = axios.create({
  baseURL: "https://library-backend-2-t0ou.onrender.com",
});

export default api;
