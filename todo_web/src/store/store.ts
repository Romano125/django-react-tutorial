import { configureStore } from "@reduxjs/toolkit";

import reducers from "./reducers";

import { dispatch } from "../middlewares";

export default configureStore({
  reducer: reducers,
  middleware: [dispatch],
});
