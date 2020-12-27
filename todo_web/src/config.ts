import axios from "axios";

export default {
  axios: axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      authorization: "",
    },
  }),
};
