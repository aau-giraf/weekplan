import getWeekDates from "../utils/getWeekDates";

describe("Return correct dates for week 39 of 2024", () => {
  it("should return the correct week dates", () => {
    const mockDate = new Date("2024-09-29T23:59:59");
    const dates = getWeekDates(mockDate);

    const expectedDates = [23, 24, 25, 26, 27, 28, 29];
    dates.forEach((date, index) => {
      expect(date.getDate()).toBe(expectedDates[index]);
    });
  });

  it("should return the correct week dates", () => {
    const mockDate = new Date("2024-09-23T00:00:00");

    const dates = getWeekDates(mockDate);

    const expectedDates = [23, 24, 25, 26, 27, 28, 29];
    dates.forEach((date, index) => {
      expect(date.getDate()).toBe(expectedDates[index]);
    });
  });
});

describe("should return the correct week dates for leap year", () => {
  const mockDate = new Date("2024-02-29");
  const dates = getWeekDates(mockDate);

  const expectedDates = [26, 27, 28, 29, 1, 2, 3];

  dates.forEach((date, index) => {
    expect(date.getDate()).toBe(expectedDates[index]);
  });
});

describe("should return the correct week dates for the first week of the year", () => {
  const mockDate = new Date("2024-01-01");
  const dates = getWeekDates(mockDate);

  const expectedDates = [1, 2, 3, 4, 5, 6, 7];

  dates.forEach((date, index) => {
    expect(date.getDate()).toBe(expectedDates[index]);
  });
});

describe("should return the correct week dates for the last week of the year", () => {
  const mockDate = new Date("2024-12-31");
  const dates = getWeekDates(mockDate);

  const expectedDates = [30, 31, 1, 2, 3, 4, 5];

  dates.forEach((date, index) => {
    expect(date.getDate()).toBe(expectedDates[index]);
  });
});

describe("should handle invalid date input", () => {
  it("should throw an error when given an invalid date", () => {
    const mockDate = new Date("invalid date");
    expect(() => getWeekDates(mockDate)).toThrow();
  });
});
