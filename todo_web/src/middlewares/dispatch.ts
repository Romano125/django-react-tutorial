import axios from "axios";
import { paths } from "../constants";

export default () => (next: any) => (action: any) => {
  console.log(process.env.API_URL);

  const axiosConfig = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
      authorization: "",
    },
  });

  axiosConfig.get(paths.API.TODOS);

  console.log(action());
};
