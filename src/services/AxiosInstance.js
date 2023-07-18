import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
axios.defaults.headers.authorization = cookies.get("reflink");

const axiosInstance = axios.create({
  // baseURL: `http://localhost:6002/`,
  baseURL: `https://erin-faithful-crayfish.cyclic.app/`,
  headers: {
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'self';frame-ancestors 'none';",
    "Referrer-Policy": "no-referrer-when-downgrade",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "X-XSS-Protection": "1; mode=block",
  },
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept",
  crossorigin: true,
});

export default axiosInstance;
