import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import ActivityItem from '../components/ActivityItem';

test('swiping left triggers deleteTask', () => {
  const deleteTask = jest.fn();
  const editTask = jest.fn();
  const checkTask = jest.fn();

  render(
    <ActivityItem
      time="09:00-10:00"
      label="Task 1"
      deleteTask={deleteTask}
      editTask={editTask}
      checkTask={checkTask}
    />
  );

  fireEvent.press(screen.getByTestId('deleteTaskItemButton'));

  expect(deleteTask).toHaveBeenCalled();
});

test('swiping right triggers editTask and checkTask', () => {
  const deleteTask = jest.fn();
  const editTask = jest.fn();
  const checkTask = jest.fn();

  render(
    <ActivityItem
      time="09:00-10:00"
      label="Task 1"
      deleteTask={deleteTask}
      editTask={editTask}
      checkTask={checkTask}
    />
  );

  fireEvent.press(screen.getByTestId('editTaskItemButton'));
  expect(editTask).toHaveBeenCalled();

  fireEvent.press(screen.getByTestId('checkTaskItemButton'));
  expect(checkTask).toHaveBeenCalled();
  expect(checkTask).toHaveBeenCalled();
});
