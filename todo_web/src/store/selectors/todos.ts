import { createSelector } from "reselect";

export default createSelector(
  (state: any) => ({
    hasLoaded: state.todos.hasLoaded,
    todos: state.todos.data,
  }),
  (data) => data
);
