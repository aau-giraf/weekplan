import getNumberOfWeeksInYear from "../utils/getNumberOfWeeksInYear";

describe("getNumberOfWeeksInYear", () => {
  test("should return 52 weeks for a non-leap year", () => {
    const year = 2023;
    const weeks = getNumberOfWeeksInYear(year);
    expect(weeks).toBe(52);
  });
});
describe("getNumberOfWeeksInYear", () => {
  test("should return 53 weeks for a leap year", () => {
    const year = 2026;

    const weeks = getNumberOfWeeksInYear(year);
    expect(weeks).toBe(53);
  });
});
