import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthenticationProvider from "../providers/AuthenticationProvider";
import ToastProvider from "../providers/ToastProvider";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import useOrganisation from "../hooks/useOrganisation";
import { JSX } from "react";

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

const mockOrganisation = {
  name: "Test Organisation",
  id: 1,
};

let wrapper: ({ children }: { children: React.ReactNode }) => JSX.Element;
beforeAll(() => {
  wrapper = ({ children }) => (
    <ToastProvider>
      <AuthenticationProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AuthenticationProvider>
    </ToastProvider>
  );
});
jest
  .spyOn(queryClient, "invalidateQueries")
  .mockImplementation(() => Promise.resolve());

jest.mock("../apis/organisationAPI", () => ({
  fetchAllOrganisationsRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve([mockOrganisation, { ...mockOrganisation, id: 2 }]);
  }),
  createOrganisationsRequest: jest
    .fn()
    .mockImplementation((orgName: string) => {
      return new Promise((resolve) =>
        setTimeout(
          () => resolve({ ...mockOrganisation, id: 3, name: orgName }),
          50
        )
      );
    }),
  deleteOrganisationRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({ ...mockOrganisation, id: 3 });
  }),
}));

jest.mock("../providers/AuthenticationProvider", () => {
  const actual = jest.requireActual("../providers/AuthenticationProvider");
  return {
    __esModule: true,
    ...actual,
    useAuthentication: () => ({
      jwt: "mockToken",
      userId: "mockUserId",
      isAuthenticated: jest.fn(() => true),
      login: jest.fn(),
      register: jest.fn(),
    }),
  };
});

afterEach(async () => {
  await act(async () => {
    queryClient.clear();
    await queryClient.cancelQueries();
  });
});

test("fetches organisations", async () => {
  const { result } = renderHook(() => useOrganisation(), {
    wrapper,
  });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual([
    mockOrganisation,
    { ...mockOrganisation, id: 2 },
  ]);
});

test("creates organisation", async () => {
  const { result } = renderHook(() => useOrganisation(), {
    wrapper,
  });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  await act(async () => {
    await result.current.createOrganisation.mutateAsync("New Organisation");
  });

  await waitFor(() => {
    expect(result.current.createOrganisation.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual([
    mockOrganisation,
    { ...mockOrganisation, id: 2 },
    { ...mockOrganisation, id: 3, name: "New Organisation" },
  ]);
});

test("new organisation id is initially -1 and then sets the id from the promise", async () => {
  const { result } = renderHook(() => useOrganisation(), {
    wrapper,
  });

  result.current.createOrganisation.mutate("New Organisation");

  await waitFor(() => {
    expect(queryClient.getQueryData(["mockUserId", "Organisation"])).toEqual([
      { id: -1, name: "New Organisation" },
    ]);
  });

  await waitFor(() => {
    expect(result.current.createOrganisation.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual([{ id: 3, name: "New Organisation" }]);
});

test("deletes organisation", async () => {
  const { result } = renderHook(() => useOrganisation(), {
    wrapper,
  });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  await act(async () => {
    await result.current.deleteOrganisation.mutateAsync(1);
  });

  await waitFor(() => {
    expect(result.current.deleteOrganisation.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual([{ ...mockOrganisation, id: 2 }]);
});
