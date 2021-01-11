import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store } from "./store";
import { TodoMain } from "./pages";

import "src/style/global.scss";

ReactDOM.render(
  <Provider store={store}>
    <TodoMain />
  </Provider>,
  document.getElementById("root")
);
