import { createSelector } from "@reduxjs/toolkit";

import { TodosState } from "src/constants/interfaces";

export default createSelector(
  (state: { todos: TodosState }) => ({
    hasLoaded: state.todos.hasLoaded,
    todos: state.todos.data,
  }),
  (data) => data
);
