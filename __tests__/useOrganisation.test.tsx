import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import useOrganisationOverview from "../hooks/useOrganisationOverview";

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

jest.spyOn(queryClient, "invalidateQueries").mockImplementation(() => Promise.resolve());

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

jest.mock("../providers/ToastProvider", () => ({
  useToast: () => ({
    addToast: jest.fn(),
  }),
}));

jest.mock("../providers/AuthenticationProvider", () => ({
  useAuthentication: () => ({
    userId: "mockUserId",
  }),
}));

jest.mock("../apis/organisationOverviewAPI", () => ({
  fetchAllOrganisationsRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve([mockOrganisation, { ...mockOrganisation, id: 2 }]);
  }),
  createOrganisationsRequest: jest.fn().mockImplementation((orgName: string) => {
    return new Promise((resolve) => setTimeout(() => resolve({ id: 3, name: orgName }), 50));
  }),
  deleteOrganisationRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({ ...mockOrganisation, id: 3 });
  }),
}));

const mockOrganisation = {
  name: "Test Organisation",
  id: 1,
};

afterEach(async () => {
  await act(async () => {
    queryClient.clear();
    await queryClient.cancelQueries();
  });
});

test("fetches organisations", async () => {
  const { result } = renderHook(() => useOrganisationOverview(), {
    wrapper,
  });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual([mockOrganisation, { ...mockOrganisation, id: 2 }]);
});

test("creates organisation", async () => {
  const { result } = renderHook(() => useOrganisationOverview(), {
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
  const { result } = renderHook(() => useOrganisationOverview(), {
    wrapper,
  });

  await act(async () => {
    result.current.createOrganisation.mutateAsync("New Organisation");
  });

  await waitFor(() => {
    expect(queryClient.getQueryData(["mockUserId", "OrganisationOverview"])).toEqual([
      { id: -1, name: "New Organisation" },
    ]);
  });

  await waitFor(() => {
    expect(result.current.createOrganisation.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual([{ id: 3, name: "New Organisation" }]);
});

test("deletes organisation", async () => {
  const { result } = renderHook(() => useOrganisationOverview(), {
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
