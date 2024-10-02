import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AddItem from "../app/additem";
import {Alert} from "react-native";
import React from "react";

jest.mock('expo-router', () => ({
    useRouter: () => ({ back: jest.fn() }),
    useGlobalSearchParams: () => ({ day: 'Monday', date: '2024-10-01' }),
}));

jest.spyOn(Alert, 'alert');

describe("AddItem", () =>{
    let setFormDataMock;

    beforeEach(() => {
        setFormDataMock = jest.fn();
        jest.spyOn(React, 'useState').mockReturnValueOnce([{
            label: "",
            description: "",
            startTime: new Date(0, 0, 0, 0, 0),
            endTime: new Date(0, 0, 0, 23, 59),
        }, setFormDataMock]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should update the start time when handleStartTimeChange is called", async () => {
        const { getByText } = render(<AddItem />);

        const initial


        handleEndTimeChange({type: 'set', nativeEvent: {timestamp: 0}}, selectedDate);
    });
})

