import React, { FC, memo } from "react";
import { compose } from "redux";
import { connect, useDispatch, useSelector } from "react-redux";

import { todosActions } from "../../store/reducers/todos";
import { selectors } from "../../store";

interface Iing {
  todos: object;
  hasLoaded: boolean;
}

const TodoMain: FC = () => {
  const dispatch = useDispatch();
  const { hasLoaded, todos }: Iing = useSelector((state: any) =>
    selectors.todos(state)
  );

  dispatch(todosActions.getTodos);

  return (
    <div>
      <h1>Hello from todo main app!</h1>
    </div>
  );
};

export default memo(TodoMain);
