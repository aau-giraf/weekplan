import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import ActivityItem from "../components/weekoverview_components/activity_components/ActivityItem";

test("swiping left triggers deleteActivity", () => {
  const deleteActivity = jest.fn();
  const editActivity = jest.fn();
  const checkActivity = jest.fn();
  const showDetails = jest.fn();

  render(
    <ActivityItem
      time="09:00-10:00"
      label="Activity 1"
      deleteActivity={deleteActivity}
      editActivity={editActivity}
      checkActivity={checkActivity}
      isCompleted={false}
      showDetails={showDetails}
    />,
  );

  fireEvent.press(screen.getByTestId("deleteActivityItemButton"));

  expect(deleteActivity).toHaveBeenCalled();
});

test("swiping right triggers editActivity and checkActivity", () => {
  const deleteActivity = jest.fn();
  const editActivity = jest.fn();
  const checkActivity = jest.fn();
  const showDetails = jest.fn();

  render(
    <ActivityItem
      time="09:00-10:00"
      label="Activity 1"
      deleteActivity={deleteActivity}
      editActivity={editActivity}
      checkActivity={checkActivity}
      isCompleted={false}
      showDetails={showDetails}
    />,
  );

  fireEvent.press(screen.getByTestId("editActivityItemButton"));
  expect(editActivity).toHaveBeenCalled();

  fireEvent.press(screen.getByTestId("checkActivityItemButton"));
  expect(checkActivity).toHaveBeenCalled();
  expect(checkActivity).toHaveBeenCalled();
});
