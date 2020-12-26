import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../config";

import { paths } from "../../constants";

interface InitialStateI {
  data: any;
  hasLoaded: boolean;
}

interface TodoI {
  data: any;
}

const initialState: InitialStateI = {
  data: [],
  hasLoaded: false,
};

const getTodos = createAsyncThunk("getTodos", async () =>
  config.axios.get(paths.API.TODOS).then((result) => result)
);

const todos = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: {
    [getTodos.pending.type]: (state) => ({
      ...state,
      hasLoaded: false,
    }),
    [getTodos.fulfilled.type]: (state, { payload }: PayloadAction<TodoI>) => ({
      ...state,
      data: payload.data,
      hasLoaded: true,
    }),
    [getTodos.rejected.type]: (state) => ({
      ...state,
      hasLoaded: true,
    }),
  },
});

export { getTodos };
export default todos.reducer;
