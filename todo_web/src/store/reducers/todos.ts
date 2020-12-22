import { createSlice } from "@reduxjs/toolkit";

import { actions } from "../../constants";

interface InitialStateI {
  data: object;
  hasLoaded: boolean;
}

interface ActionI {
  payload: any;
  type: string;
}

const initialState: InitialStateI = {
  data: {},
  hasLoaded: false,
};

const actionMap = {
  [actions.TODOS_GET_REQUEST]: (state: InitialStateI) => ({
    ...state,
    hasLoaded: false,
  }),
  [actions.TODOS_GET_SUCCESS]: (state: InitialStateI, action: ActionI) => ({
    ...state,
    data: action.payload.data,
    hasLoaded: true,
  }),
  [actions.TODOS_GET_FAILURE]: (state: InitialStateI) => ({
    ...state,
    hasLoaded: true,
  }),
};

const todos = createSlice({
  name: "todos",
  initialState,
  reducers: {
    getTodos: (state: InitialStateI, action) => {
      console.log(action);

      return actionMap[action.type](state, action);
    },
  },
});

export const todosActions = todos.actions;
export default todos.reducer;
