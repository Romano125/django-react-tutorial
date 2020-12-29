import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectors } from "src/store";

import { createTodo, getTodos } from "src/store/reducers/todos";

const TodoMain: FC = () => {
  const [todo, setTodo] = useState("");
  const dispatch = useDispatch();
  const { hasLoaded, todos } = useSelector(selectors.todos);

  const handleInputChange = useCallback((e) => setTodo(e.target.value), []);

  const addTodo = useCallback(
    () => dispatch(createTodo({ label: todo, description: "Empty" })),
    [dispatch, todo]
  );

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  if (!hasLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Hello from todo main app!</h1>
      <input onChange={handleInputChange} />
      <button onClick={addTodo}>ADD</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.label}</li>
        ))}
      </ul>
    </div>
  );
};

export default memo(TodoMain);
