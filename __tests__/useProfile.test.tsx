import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useProfile from "../hooks/useProfile";
import { deleteUserRequest } from "../apis/profileAPI";
import { act, renderHook, waitFor } from "@testing-library/react-native";

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

const mockUser = {
  firstname: "John",
  lastName: "Doe",
  password: "password",
  id: "123",
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

jest.mock("../providers/AuthenticationProvider", () => ({
  useAuthentication: jest.fn().mockImplementation(() => {
    return Promise.resolve(mockUser.id);
  }),
}));

jest.mock("../apis/profileAPI", () => ({
  deleteUserRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
  updateProfileRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({ firstName: "Jane", lastName: "Doe" });
  }),
}));

test("deleteUser should invoke deleteUserRequest with correct data", async () => {
  const { result } = renderHook(() => useProfile(), { wrapper });

  await act(async () => {
    await result.current.deleteUser.mutateAsync(mockUser);
  });

  await waitFor(() => {
    expect(result.current.deleteUser.data).toBeUndefined();
  });
  expect(deleteUserRequest).toHaveBeenCalledTimes(1);
});

test("deleteUser should handle edge case when userId is undefined", async () => {
  const { result } = renderHook(() => useProfile(), { wrapper });

  await act(async () => {
    await result.current.deleteUser.mutateAsync({ password: "password", id: "" });
  });

  await waitFor(() => {
    expect(result.current.deleteUser.error).toBeDefined();
  });
});

test("UpdateProfile should update profile data", async () => {
  const { result } = renderHook(() => useProfile(), { wrapper });

  await act(async () => {
    await result.current.updateProfile.mutateAsync({ firstName: "Jane", lastName: "Doe" });
  });

  await waitFor(() => {
    expect(result.current.updateProfile.data).toEqual({ firstName: "Jane", lastName: "Doe" });
  });
});
