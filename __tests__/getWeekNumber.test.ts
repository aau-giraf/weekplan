import getWeekNumber from "../utils/getWeekNumber";

describe("getWeekNumber", () => {
  test("should return correct week number for a mid-year date", () => {
    const date = new Date("2023-06-15");
    const weekNumber = getWeekNumber(date);
    expect(weekNumber).toBe(24);
  });

  test("should return correct week number for a date in the beginning of the year", () => {
    const date = new Date("2023-01-05");
    const weekNumber = getWeekNumber(date);
    expect(weekNumber).toBe(1);
  });

  test("should return correct week number for a date in the last week of the year", () => {
    const date = new Date("2023-12-31");
    const weekNumber = getWeekNumber(date);
    expect(weekNumber).toBe(52);
  });

  test("should return correct week number for a leap year date", () => {
    const date = new Date("2020-02-29");
    const weekNumber = getWeekNumber(date);
    expect(weekNumber).toBe(9);
  });

  test("should return correct week number for the first week of the year", () => {
    const date = new Date("2023-01-01");
    const weekNumber = getWeekNumber(date);
    expect(weekNumber).toBe(52);
  });

  test("should return correct week number for a random date", () => {
    const date = new Date("2022-10-10");
    const weekNumber = getWeekNumber(date);
    expect(weekNumber).toBe(41);
  });

  test("should return correct week number for a future date 2025", () => {
    const date = new Date("2025-1-1");
    const weekNumber = getWeekNumber(date);
    expect(weekNumber).toBe(1);
  });

  test("should return correct week number for a random date in 2024", () => {
    const date = new Date("2024-10-10");
    const weekNumber = getWeekNumber(date);
    expect(weekNumber).toBe(41);
  });
});
