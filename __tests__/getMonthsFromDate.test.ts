import getMonthsFromDates from "../utils/getMonthsFromDate";

describe("getMonthsFromDates", () => {
  it("should return the name of the month when both dates are in the same month", () => {
    const startDate = new Date("2023-07-15");
    const endDate = new Date("2023-07-20");

    const result = getMonthsFromDates(startDate, endDate);

    expect(result).toBe("juli");
  });

  it("should return the names of both months when dates are in different months", () => {
    const startDate = new Date("2023-07-15");
    const endDate = new Date("2023-08-05");

    const result = getMonthsFromDates(startDate, endDate);

    expect(result).toBe("juli/august");
  });

  it("should throw an error if startDate is invalid", () => {
    const startDate = new Date("invalid-date");
    const endDate = new Date("2023-08-05");

    expect(() => getMonthsFromDates(startDate, endDate)).toThrow("Invalid date(s) provided");
  });

  it("should throw an error if endDate is invalid", () => {
    const startDate = new Date("2023-07-15");
    const endDate = new Date("invalid-date");

    expect(() => getMonthsFromDates(startDate, endDate)).toThrow("Invalid date(s) provided");
  });

  it("should throw an error if both dates are invalid", () => {
    const startDate = new Date("invalid-date");
    const endDate = new Date("invalid-date");

    expect(() => getMonthsFromDates(startDate, endDate)).toThrow("Invalid date(s) provided");
  });
});
