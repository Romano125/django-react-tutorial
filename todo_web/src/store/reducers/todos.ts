import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import config from "src/config";
import { paths } from "src/constants";

import { TodosState, TodosPayload } from "src/constants/interfaces";

const initialState: TodosState = {
  data: [],
  hasLoaded: false,
};

const getTodos = createAsyncThunk("getTodos", async () =>
  config.axios.get(paths.API.TODOS).then((result) => result)
);

const extraReducers = {
  [getTodos.pending.type]: (state: TodosState) => ({
    ...state,
    hasLoaded: false,
  }),
  [getTodos.fulfilled.type]: (
    state: TodosState,
    { payload }: PayloadAction<TodosPayload>
  ) => ({
    ...state,
    data: payload.data,
    hasLoaded: true,
  }),
  [getTodos.rejected.type]: (state: TodosState) => ({
    ...state,
    hasLoaded: true,
  }),
};

const todos = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers,
});

export { getTodos };
export default todos.reducer;
