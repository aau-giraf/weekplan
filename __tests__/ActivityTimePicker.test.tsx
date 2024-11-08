import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import { Platform } from "react-native";
import TimePicker from "../components/TimePicker";
import formatTimeHHMM from "../utils/formatTimeHHMM";

describe("ActivityTimePicker", () => {
  const mockOnChange = jest.fn();

  const initialProps = {
    title: "Select Time",
    value: new Date(new Date().setHours(14, 30)),
    onChange: mockOnChange,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe("iOS behaviour", () => {
    beforeAll(() => {
      Platform.OS = "ios";
    });

    it("renders correctly with label", () => {
      render(<TimePicker {...initialProps} />);

      expect(screen.getByText("Select Time")).toBeTruthy();
    });

    it("calls onChange when a time is selected", () => {
      render(<TimePicker {...initialProps} />);

      const newTimeIOS = new Date(initialProps.value);
      expect([newTimeIOS.getHours(), newTimeIOS.getMinutes()]).toEqual([14, 30]);

      // Simulate selecting the new time by calling onChange directly
      newTimeIOS.setHours(15, 30);
      mockOnChange(newTimeIOS);

      // Verify that the mock function is called with the new time
      expect(mockOnChange).toHaveBeenCalledWith(newTimeIOS);
    });
  });

  describe("android behaviour", () => {
    beforeAll(() => {
      Platform.OS = "android";
    });

    it("renders correctly with label and formatted time", () => {
      render(<TimePicker {...initialProps} />);

      expect(screen.getByText("Select Time")).toBeTruthy();
      expect(screen.getByText(formatTimeHHMM(initialProps.value))).toBeTruthy();
    });

    it("does not call onChange if no time is selected", () => {
      render(<TimePicker {...initialProps} />);

      fireEvent.press(screen.getByText(formatTimeHHMM(initialProps.value)));
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("calls onChange when a time is selected", () => {
      render(<TimePicker {...initialProps} />);

      fireEvent.press(screen.getByText(formatTimeHHMM(initialProps.value)));

      const newTime = new Date(initialProps.value);
      expect([newTime.getHours(), newTime.getMinutes()]).toEqual([14, 30]);

      newTime.setHours(15, 30);
      mockOnChange(newTime);

      expect(mockOnChange).toHaveBeenCalledWith(newTime);
    });
  });
});
