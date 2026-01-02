
import axios from "axios";
const baseURL =  "http://localhost:9000/";

const axiosConfig = axios.create({
  baseURL,
});

export default axiosConfig;