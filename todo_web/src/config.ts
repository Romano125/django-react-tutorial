import axios from "axios";

export default {
  API_URL: process.env.REACT_APP_API_URL,
  axios: axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      authorization: "",
    },
  }),
};
