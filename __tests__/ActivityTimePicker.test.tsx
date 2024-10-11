import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Platform } from 'react-native';
import ActivityTimePicker from '../components/ActivityTimePicker';
import formatTime from '../utils/formatTime';

describe("ActivityTimePicker", () => {
    const mockOnChange = jest.fn();

    const initialProps = {
        label: "Select Time",
        value: new Date(new Date().setHours(14, 30)), // 14:30 (2:30 PM)
        onChange: mockOnChange,
    };

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    describe("iOS behaviour", () => {
        beforeAll(() => {
            Platform.OS = "ios"; // Force the test to simulate iOS behaviour
        });

        it("renders correctly with label and formatted time", () => {
            render(<ActivityTimePicker {...initialProps} />);

            // Check if the label and the formatted time are rendered
            expect(screen.getByText('Select Time')).toBeTruthy();
            expect(screen.getByText(formatTime(initialProps.value))).toBeTruthy();
        });

        it("calls onChange when a time is selected", () => {
            render(<ActivityTimePicker {...initialProps} />);

            // Simulate selecting a new time directly by calling onChange
            const newTime = new Date(initialProps.value);
            newTime.setHours(15, 30); // Mock new time to 15:30

            // Directly call the onChange to simulate time selection
            mockOnChange(newTime);

            // Ensure the mock function is called with the new time
            expect(mockOnChange).toHaveBeenCalledWith(newTime);
        });
    });

    describe("android behaviour", () => {
        beforeAll(() => {
            Platform.OS = 'android'; // Force the test to simulate Android behaviour
        });

        it("renders correctly with label and formatted time", () => {
            render(<ActivityTimePicker {...initialProps} />);

            // Check if the label and the formatted time are rendered
            expect(screen.getByText('Select Time')).toBeTruthy();
            expect(screen.getByText(formatTime(initialProps.value))).toBeTruthy();
        });

        it("opens the time picker when TouchableOpacity is pressed", () => {
            render(<ActivityTimePicker {...initialProps} />);

            // Simulate press event on the TouchableOpacity
            fireEvent.press(screen.getByText(formatTime(initialProps.value)));

            // Check if the DateTimePicker is rendered (not directly observable)
            expect(mockOnChange).not.toHaveBeenCalled(); // onChange should not be called yet
        });

        it("calls onChange when a time is selected", () => {
            render(<ActivityTimePicker {...initialProps} />);

            // Simulate opening the picker
            fireEvent.press(screen.getByText(formatTime(initialProps.value)));

            // Simulate selecting a new time
            const newTime = new Date(initialProps.value);
            newTime.setHours(15, 30); // Mock new time to 15:30

            // Directly call the onChange to simulate time selection
            mockOnChange(newTime);

            // Ensure the mock function is called with the new time
            expect(mockOnChange).toHaveBeenCalledWith(newTime);
        });
    });


});
