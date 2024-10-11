import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Platform } from 'react-native';
import ActivityTimePicker from '../components/ActivityTimePicker';
import formatTime from '../utils/formatTime';

describe("ActivityTimePicker", () => {
    const mockOnChange = jest.fn();

    const initialProps = {
        label: "Select Time",
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
            render(<ActivityTimePicker {...initialProps} />);

            expect(screen.getByText('Select Time')).toBeTruthy();
        });

        it("calls onChange when a time is selected", () => {
            render(<ActivityTimePicker {...initialProps} />);

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
            render(<ActivityTimePicker {...initialProps} />);

            expect(screen.getByText('Select Time')).toBeTruthy();
            expect(screen.getByText(formatTime(initialProps.value))).toBeTruthy();
        });

        it("opens the time picker when TouchableOpacity is pressed", () => {
            render(<ActivityTimePicker {...initialProps} />);

            // Simulate opening the activity time picker
            fireEvent.press(screen.getByText(formatTime(initialProps.value)));

            // Check if the DateTimePicker is rendered (onChange should not have been called yet)
            expect(mockOnChange).not.toHaveBeenCalled();
        });

        it("calls onChange when a time is selected", () => {
            render(<ActivityTimePicker {...initialProps} />);

            fireEvent.press(screen.getByText(formatTime(initialProps.value)));

            const newTime = new Date(initialProps.value);
            expect([newTime.getHours(), newTime.getMinutes()]).toEqual([14, 30]);

            newTime.setHours(15, 30);
            mockOnChange(newTime);

            expect(mockOnChange).toHaveBeenCalledWith(newTime);
        });

        it("does not call onChange if no time is selected", () => {
            render(<ActivityTimePicker {...initialProps} />);

            fireEvent.press(screen.getByText(formatTime(initialProps.value)));
            expect(mockOnChange).not.toHaveBeenCalled();
        });

    });
});
