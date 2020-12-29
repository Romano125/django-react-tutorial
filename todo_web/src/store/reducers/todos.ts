import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import config from "src/config";
import { paths } from "src/constants";

import {
  TodoData,
  TodosCreatePayload,
  TodosPayload,
  TodosState,
} from "src/constants/interfaces";

const initialState: TodosState = {
  data: [],
  hasLoaded: false,
};

const getTodos = createAsyncThunk("getTodos", async () =>
  config.axios.get(paths.API.TODOS)
);

const createTodo = createAsyncThunk("createTodo", async (data: TodoData) =>
  config.axios.post(paths.API.TODOS, data)
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

  [createTodo.pending.type]: (state: TodosState) => ({
    ...state,
    hasLoaded: false,
  }),
  [createTodo.fulfilled.type]: (
    state: TodosState,
    { payload }: PayloadAction<TodosCreatePayload>
  ) => ({
    ...state,
    data: [...state.data, payload.data],
    hasLoaded: true,
  }),
  [createTodo.rejected.type]: (state: TodosState) => ({
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

export { createTodo, getTodos };
export default todos.reducer;
