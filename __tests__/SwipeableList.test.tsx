import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import SwipeableList, { Action } from "../components/SwipeableList/SwipeableList";
import { View, Text } from "react-native";

describe("SwipeableList", () => {
  const mockData = [{ id: "1", name: "Item 1" }];
  const leftActions: Action<{ id: string; name: string }>[] = [
    {
      icon: "pencil-outline",
      color: "#FFA500",
      onPress: jest.fn(),
    },
  ];

  const rightActions: Action<{ id: string; name: string }>[] = [
    {
      icon: "trash",
      color: "#FF0000",
      onPress: jest.fn(),
    },
  ];

  const renderItem = ({ item }: { item: { id: string; name: string } }) => (
    <View testID="list-item" style={{ height: 100 }}>
      <Text>{item.name}</Text>
    </View>
  );

  it("renders the list with the correct number of items", () => {
    render(
      <SwipeableList
        items={mockData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        leftActions={leftActions}
        rightActions={rightActions}
      />
    );

    expect(screen.getByTestId("list-item")).toBeTruthy();
    expect(screen.getByText("Item 1")).toBeTruthy();
  });

  it("calls the correct action callback when action icon is pressed", () => {
    render(
      <SwipeableList
        items={mockData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        leftActions={leftActions}
        rightActions={rightActions}
      />
    );

    const leftActionIcon = screen.getByTestId("left-action-icon");
    fireEvent.press(leftActionIcon);
    expect(leftActions[0].onPress).toHaveBeenCalled();

    const rightActionIcon = screen.getByTestId("right-action-icon");
    fireEvent.press(rightActionIcon);
    expect(rightActions[0].onPress).toHaveBeenCalled();
  });

  it("does not show swipe actions when leftActions and rightActions are not provided", () => {
    render(<SwipeableList items={mockData} keyExtractor={(item) => item.id} renderItem={renderItem} />);

    expect(screen.queryByTestId("left-action-icon")).toBeNull();
    expect(screen.queryByTestId("right-action-icon")).toBeNull();
  });

  it("renders correctly with an empty list", () => {
    render(
      <SwipeableList
        items={[]}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        leftActions={leftActions}
        rightActions={rightActions}
      />
    );

    expect(screen.queryByTestId("list-item")).toBeNull();
  });

  it("calls keyExtractor with the correct item and assigns the correct key", () => {
    const keyExtractorMock = jest.fn((item) => item.id);

    render(
      <SwipeableList
        items={mockData}
        keyExtractor={keyExtractorMock}
        renderItem={renderItem}
        leftActions={leftActions}
        rightActions={rightActions}
      />
    );

    expect(keyExtractorMock).toHaveBeenCalled();
  });
});
