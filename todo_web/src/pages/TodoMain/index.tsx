import React, { FC, memo, useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  FormControl,
  InputGroup,
  ListGroup,
  Spinner,
} from "react-bootstrap";
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
    return <Spinner animation="border" />;
  }

  return (
    <Container className="text-center mt-5">
      <h1 className="mb-5">
        Hello from <i>Todo app</i>!
      </h1>
      <InputGroup className="mt-5 mb-5">
        <FormControl
          onChange={handleInputChange}
          placeholder="Enter a todo..."
          aria-label="Enter a todo"
          aria-describedby="basic-addon2"
        />
        <InputGroup.Append>
          <Button variant="outline-success" onClick={addTodo}>
            ADD
          </Button>
        </InputGroup.Append>
      </InputGroup>
      <Card>
        <ListGroup variant="flush">
          {todos.map((todo) => (
            <ListGroup.Item key={todo.id}>{todo.label}</ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </Container>
  );
};

export default memo(TodoMain);
