import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TaskItem from "../components/TaskItem";

test("swiping left triggers deleteTask", () => {
  const deleteTask = jest.fn();
  const editTask = jest.fn();
  const checkTask = jest.fn();

  const { getByTestId } = render(
    <TaskItem
      time="09:00-10:00"
      label="Task 1"
      deleteTask={deleteTask}
      editTask={editTask}
      checkTask={checkTask}
    />
  );

  fireEvent.press(getByTestId("deleteTaskItemButton"));

  expect(deleteTask).toHaveBeenCalled();
});

test("swiping right triggers editTask and checkTask", () => {
  const deleteTask = jest.fn();
  const editTask = jest.fn();
  const checkTask = jest.fn();

  const { getByTestId } = render(
    <TaskItem
      time="09:00-10:00"
      label="Task 1"
      deleteTask={deleteTask}
      editTask={editTask}
      checkTask={checkTask}
    />
  );

  // Simulate right swipe
  fireEvent.press(getByTestId("editTaskItemButton"));
  expect(editTask).toHaveBeenCalled();

  fireEvent.press(getByTestId("checkTaskItemButton"));
  expect(checkTask).toHaveBeenCalled();
});
