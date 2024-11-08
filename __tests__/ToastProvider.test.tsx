import { act, fireEvent, renderHook, screen, waitFor } from "@testing-library/react-native";
import ToastProvider, { useToast } from "../providers/ToastProvider";
import { ToastProps } from "../components/Toast";

jest.useFakeTimers();

afterEach(() => {
  jest.clearAllTimers();
});

describe("ToastProvider and useToast", () => {
  it("should add a toast to the toasts array when addToast is called", () => {
    const { result } = renderHook(() => useToast(), { wrapper: ToastProvider });

    const toast: Omit<ToastProps, "id" | "onClose"> = {
      message: "Test toast",
      type: "error",
    };

    act(() => {
      result.current.addToast(toast);
    });

    expect(result.current.toasts[0]).toEqual(expect.objectContaining(toast));
  });

  it("should remove a toast from the toasts array when removeToast is called", () => {
    const { result } = renderHook(() => useToast(), { wrapper: ToastProvider });

    const toast: Omit<ToastProps, "id" | "onClose"> = {
      message: "Test toast",
      type: "error",
    };

    act(() => {
      result.current.addToast(toast);
    });

    expect(result.current.toasts[0]).toEqual(expect.objectContaining(toast));

    act(() => {
      result.current.removeToast(result.current.toasts[0].id);
    });

    expect(result.current.toasts).toEqual([]);
  });

  it("should throw an error if useToast is used outside ToastProvider", () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

    try {
      renderHook(() => useToast());
    } catch (error) {
      expect(error).toEqual(new Error("useToast must be used within a ToastProvider"));
    }

    consoleErrorMock.mockRestore();
  });

  it("Toasts should automatically be removed after the duration", () => {
    jest.useFakeTimers();

    const { result } = renderHook(() => useToast(), { wrapper: ToastProvider });

    const toast: Omit<ToastProps, "id" | "onClose"> = {
      message: "Test toast",
      type: "error",
    };

    act(() => {
      result.current.addToast(toast, 1000);
    });

    expect(result.current.toasts.length).toBe(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.toasts.length).toBe(0);
  });

  it("Toast should call removeToast when the close button is pressed", async () => {
    const { result } = renderHook(() => useToast(), { wrapper: ToastProvider });

    const toast: Omit<ToastProps, "id" | "onClose"> = {
      message: "Test toast",
      type: "error",
    };

    act(() => {
      result.current.addToast(toast);
    });

    expect(result.current.toasts.length).toBe(1);
    expect(await screen.findByTestId("close-toast")).toBeTruthy();

    fireEvent.press(await screen.findByTestId("close-toast"));

    await waitFor(() => {
      expect(result.current.toasts.length).toBe(0);
    });
  });
});
