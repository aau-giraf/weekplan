import { renderHook, act } from "@testing-library/react-native";
import useWeek from "../hooks/useWeek";

describe("useWeek hook", () => {
  const mockCurrentDate = new Date("2024-09-25");

  test("initializes with the correct current week dates and week number", () => {
    const { result } = renderHook(() => useWeek(mockCurrentDate));

    expect(result.current.weekDates).toEqual([
      new Date("2024-09-23"),
      new Date("2024-09-24"),
      new Date("2024-09-25"),
      new Date("2024-09-26"),
      new Date("2024-09-27"),
    ]);

    expect(result.current.weekNumber).toBe(39);
  });

  test("goToPreviousWeek updates the week correctly", async () => {
    const { result } = renderHook(() => useWeek(mockCurrentDate));

    act(() => {
      result.current.goToPreviousWeek();
    });

    expect(result.current.weekDates).toEqual([
      new Date("2024-09-16"),
      new Date("2024-09-17"),
      new Date("2024-09-18"),
      new Date("2024-09-19"),
      new Date("2024-09-20"),
    ]);

    expect(result.current.weekNumber).toBe(38);
  });

  test("goToNextWeek updates the week correctly", () => {
    const { result } = renderHook(() => useWeek(mockCurrentDate));

    act(() => {
      result.current.goToNextWeek();
    });

    expect(result.current.weekDates).toEqual([
      new Date("2024-09-30"),
      new Date("2024-10-01"),
      new Date("2024-10-02"),
      new Date("2024-10-03"),
      new Date("2024-10-04"),
    ]);

    expect(result.current.weekNumber).toBe(40);
  });

  test("initializes with correct week number for different dates", () => {
    const sundayDate = new Date("2024-09-29");
    const { result } = renderHook(() => useWeek(sundayDate));

    expect(result.current.weekNumber).toBe(39);
  });

  test("handles transition from the last week of the year", () => {
    const yearEndDate = new Date("2024-12-30");
    const { result } = renderHook(() => useWeek(yearEndDate));

    act(() => {
      result.current.goToNextWeek();
    });

    expect(result.current.weekDates).toEqual([
      new Date("2025-01-06"),
      new Date("2025-01-07"),
      new Date("2025-01-08"),
      new Date("2025-01-09"),
      new Date("2025-01-10"),
    ]);
    expect(result.current.weekNumber).toBe(2);
  });
});
