import { isTokenExpired } from "../utils/jwtDecode";

describe("isTokenExpired", () => {
  it("returns true for expired token", () => {
    const expiredToken = "header.expiredPayload.signature";
    expect(isTokenExpired(expiredToken)).toBe(true);
  });

  it("returns false for valid token", () => {
    const validToken = "header." + btoa(JSON.stringify({ exp: Date.now() / 1000 + 1000 })) + ".signature";
    expect(isTokenExpired(validToken)).toBe(false);
  });
});
