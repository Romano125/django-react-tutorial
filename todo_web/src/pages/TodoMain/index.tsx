import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectors } from "src/store";

import { getTodos } from "src/store/reducers/todos";

const TodoMain: FC = () => {
  const dispatch = useDispatch();
  const { hasLoaded, todos } = useSelector((state: any) =>
    selectors.todos(state)
  );

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  if (!hasLoaded) {
    return <div>Loading...</div>;
  }

  console.log(todos);

  return (
    <div>
      <h1>Hello from todo main app!</h1>
    </div>
  );
};

export default memo(TodoMain);
