import { renderHook } from "@testing-library/react-native";
import useSearch from "../hooks/useSearch";

describe("useSearch hook", () => {
  const mockItems = [
    { name: "Apple" },
    { name: "Banana" },
    { name: "Cherry" },
    { name: "Date" },
    { name: "Elderberry" },
    { name: "Fig" },
    { name: "Grape" },
  ];

  const mockNames = [
    { firstName: "John", lastName: "Doe" },
    { firstName: "Jane", lastName: "Doe" },
    { firstName: "Alice", lastName: "Johnson" },
    { firstName: "Bob", lastName: "Brown" },
    { firstName: "Charlie", lastName: "White" },
    { firstName: "David", lastName: "Black" },
    { firstName: "Eve", lastName: "Green" },
  ];

  test("returns all items when search query is empty", () => {
    const searchQuery = "";
    const searchFn = (item: { name: string }) => item.name;

    const { result } = renderHook(() => useSearch(mockItems, searchQuery, searchFn));

    expect(result.current).toEqual(mockItems);
  });

  test("filters items correctly and matches based on search input", () => {
    const searchQuery = "e";
    const searchFn = (item: { name: string }) => item.name;

    const { result } = renderHook(() => useSearch(mockItems, searchQuery, searchFn));

    expect(result.current).toEqual([
      { name: "Apple" },
      { name: "Cherry" },
      { name: "Date" },
      { name: "Elderberry" },
      { name: "Grape" },
    ]);
  });

  test("shows no items when search query does not match any item", () => {
    const searchQuery = "z";
    const searchFn = (item: { name: string }) => item.name;

    const { result } = renderHook(() => useSearch(mockItems, searchQuery, searchFn));

    expect(result.current).toEqual([]);
  });

  test("filters items correctly when search query is capitalized", () => {
    const searchQuery = "G";
    const searchFn = (item: { name: string }) => item.name;

    const { result } = renderHook(() => useSearch(mockItems, searchQuery, searchFn));

    expect(result.current).toEqual([{ name: "Fig" }, { name: "Grape" }]);
  });

  test("filters items correctly based on last name", () => {
    const searchQuery = "doe";
    const searchFn = (item: { firstName: string; lastName: string }) => item.lastName;

    const { result } = renderHook(() => useSearch(mockNames, searchQuery, searchFn));

    expect(result.current).toEqual([
      { firstName: "John", lastName: "Doe" },
      { firstName: "Jane", lastName: "Doe" },
    ]);
  });

  test("filters items correctly based on first name", () => {
    const searchQuery = "alice";
    const searchFn = (item: { firstName: string; lastName: string }) => item.firstName;

    const { result } = renderHook(() => useSearch(mockNames, searchQuery, searchFn));

    expect(result.current).toEqual([{ firstName: "Alice", lastName: "Johnson" }]);
  });

  test("filters items correctly based on full name", () => {
    const searchQuery = "eve green";
    const searchFn = (item: { firstName: string; lastName: string }) => `${item.firstName} ${item.lastName}`;

    const { result } = renderHook(() => useSearch(mockNames, searchQuery, searchFn));

    expect(result.current).toEqual([{ firstName: "Eve", lastName: "Green" }]);
  });

  test("filters items correctly when only part of the name matches", () => {
    const searchQuery = "Jo";
    const searchFn = (item: { firstName: string; lastName: string }) => `${item.firstName} ${item.lastName}`;

    const { result } = renderHook(() => useSearch(mockNames, searchQuery, searchFn));

    expect(result.current).toEqual([
      { firstName: "John", lastName: "Doe" },
      { firstName: "Alice", lastName: "Johnson" },
    ]);
  });
});
