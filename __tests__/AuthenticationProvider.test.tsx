import { act, renderHook, waitFor } from "@testing-library/react-native";
import { tryLogin } from "../apis/loginAPI";
import { useToast } from "../providers/ToastProvider";
import AuthenticationProvider, { useAuthentication } from "../providers/AuthenticationProvider";
import { router } from "expo-router";

jest.mock("../apis/registerAPI");
jest.mock("../apis/loginAPI");
jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock("../providers/ToastProvider", () => ({
  useToast: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("AuthenticationProvider and useAuthentication", () => {
  const addToast = jest.fn();

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({ addToast });
    jest.clearAllMocks();
  });

  it("should login and store a jwt token", async () => {
    const mockToken = "mockToken";
    (tryLogin as jest.Mock).mockResolvedValueOnce({ token: mockToken });

    const { result } = renderHook(() => useAuthentication(), {
      wrapper: AuthenticationProvider,
    });

    act(() => {
      result.current.login("test@test.dk", "testTest1");
    });

    await waitFor(() => {
      expect(result.current.jwt).toBe(mockToken);
    });
  });

  it("should add a toast if login fails", async () => {
    const error = new Error("Login failed");
    (tryLogin as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuthentication(), {
      wrapper: AuthenticationProvider,
    });

    act(() => {
      result.current.login("test@test.dk", "testTest1");
    });

    await waitFor(() => {
      expect(addToast).toHaveBeenCalledWith({
        message: error.message,
        type: "error",
      });
    });

    expect(router.replace).not.toHaveBeenCalled();
  });

  it("should add a toast if no token is returned on login", async () => {
    (tryLogin as jest.Mock).mockResolvedValueOnce({ token: null }); // No token

    const { result } = renderHook(() => useAuthentication(), {
      wrapper: AuthenticationProvider,
    });

    act(() => {
      result.current.login("test@test.dk", "testTest1");
    });

    await waitFor(() => {
      expect(addToast).toHaveBeenCalledWith({
        message: "Toast not received",
        type: "error",
      });
    });

    expect(router.replace).not.toHaveBeenCalled();
  });

  it("should register a user", async () => {
    const { result } = renderHook(() => useAuthentication(), {
      wrapper: AuthenticationProvider,
    });

    act(() => {
      result.current.register("test@test.dk", "testTest1", "Test", "Test");
    });

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/login");
    });

    expect(addToast).not.toHaveBeenCalled();
  });

  it("should add a toast if register fails", async () => {
    const error = new Error("Register failed");
    jest.spyOn(require("../apis/registerAPI"), "createUserRequest").mockRejectedValueOnce(error);

    const mockAddToast = jest.fn();
    jest.spyOn(require("../providers/ToastProvider"), "useToast").mockReturnValue({
      addToast: mockAddToast,
    });

    const { result } = renderHook(() => useAuthentication(), {
      wrapper: AuthenticationProvider,
    });

    await act(async () => {
      await result.current.register("test@test.dk", "testTest1", "Test", "Test");
    });

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith({
        message: error.message,
        type: "error",
      });
    });

    expect(router.replace).not.toHaveBeenCalled();
  });

  it("should return false for isAuthenticated if jwt is not set", async () => {
    const { result } = renderHook(() => useAuthentication(), {
      wrapper: AuthenticationProvider,
    });

    expect(result.current.isAuthenticated()).toBe(false);
  });

  it("should return false for isAuthenticated if jwt is expired", async () => {
    jest.spyOn(require("../utils/jwtDecode"), "isTokenExpired").mockReturnValueOnce(true);

    const { result } = renderHook(() => useAuthentication(), {
      wrapper: AuthenticationProvider,
    });

    await act(async () => {
      result.current.login("test@test.dk", "testTest1");
    });

    expect(result.current.isAuthenticated()).toBe(false);
  });

  it("should have initial jwt as null and isAuthenticated should return false", async () => {
    const { result } = renderHook(() => useAuthentication(), {
      wrapper: AuthenticationProvider,
    });

    expect(result.current.jwt).toBeNull();
    expect(result.current.isAuthenticated()).toBe(false);
  });

  it("should throw error if used outside of provider", async () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
      renderHook(() => useAuthentication());
    } catch (error) {
      expect(error).toEqual(new Error("useAuthentication skal bruges i en AuthenticationProvider"));
    }
    consoleErrorMock.mockRestore();
  });
});
