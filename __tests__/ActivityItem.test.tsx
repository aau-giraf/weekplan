import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import ActivityItem from "../components/weekoverview_components/activity_components/ActivityItem";
import usePictogram from "../hooks/usePictogram";


jest.mock("../hooks/usePictogram");
jest.useRealTimers();

test("swiping left triggers deleteActivity", async () => {
  const deleteActivity = jest.fn();
  const editActivity = jest.fn();
  const checkActivity = jest.fn();
  const showDetails = jest.fn();

  // Mocking useFetchPictograms return values
  (usePictogram as jest.Mock).mockReturnValue({
    useFetchPictograms: {
      data: 'https://api.arasaac.org/v1/pictograms/27575?color=true&download=false', // Mock image URL
      error: null,
      isLoading: false,
    },
  });

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
  // Simulate the button press
  fireEvent.press(screen.getByTestId("deleteActivityItemButton"));

  // Ensure deleteActivity is called
  expect(deleteActivity).toHaveBeenCalled();
});

test("swiping right triggers editActivity and checkActivity", () => {
  const deleteActivity = jest.fn();
  const editActivity = jest.fn();
  const checkActivity = jest.fn();
  const showDetails = jest.fn();

  (usePictogram as jest.Mock).mockReturnValue({
    useFetchPictograms: {
      data: 'https://api.arasaac.org/v1/pictograms/27575?color=true&download=false', // Mock image URL
      error: null,
      isLoading: false,
    },
  });

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
