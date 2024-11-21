import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useProfile from "../hooks/useProfile";
import { useAuthentication } from "../providers/AuthenticationProvider";
import { deleteUserRequest } from "../apis/profileAPI";

jest.mock("../providers/AuthenticationProvider", () => ({
  useAuthentication: jest.fn(),
}));

jest.mock("../apis/profileAPI", () => ({
  deleteUserRequest: jest.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
      gcTime: Infinity,
    },
    mutations: {
      retry: false,
      gcTime: Infinity,
    },
  },
});

const mockUserId = "123";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeEach(() => {
  useAuthentication.mockReturnValue({ userId: mockUserId });
  deleteUserRequest.mockResolvedValue(undefined);
});

afterEach(() => {
  jest.clearAllMocks();
});

test("deleteUser should invoke deleteUserRequest with correct data", async () => {
  const deleteUserData = { password: "password", id: mockUserId };

  deleteUserRequest.mockResolvedValue(undefined);

  const { result } = renderHook(() => useProfile(), { wrapper });

  await act(async () => {
    await result.current.deleteUser.mutateAsync(deleteUserData);
  });

  expect(deleteUserRequest).toHaveBeenCalledWith(mockUserId, deleteUserData);
  expect(deleteUserRequest).toHaveBeenCalledTimes(1);
});

test("deleteUser should handle edge case when userId is undefined", async () => {
  useAuthentication.mockReturnValue({ userId: undefined });

  const { result } = renderHook(() => useProfile(), { wrapper });

  expect(result.current.deleteUser.mutateAsync).toBeUndefined();
});