import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store } from "./store";
import { TodoMain } from "./pages";

import "./index.css";

ReactDOM.render(
  <Provider store={store}>
    <TodoMain />
  </Provider>,
  document.getElementById("root")
);
