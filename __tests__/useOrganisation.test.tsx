import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import useOrganisation from "../hooks/useOrganisation";

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

const mockCitizens = [
  { id: 1, firstName: "Citizen 1", lastName: "CitizenTest1" },
  { id: 2, firstName: "Citizen 2", lastName: "CitizenTest2" },
];

const mockOrganisation = {
  id: 1,
  name: "Test Organisation",
  users: [
    { id: "1", firstName: "User 1", lastName: "Test" },
    { id: "2", firstName: "User 2", lastName: "Test" },
  ],
  citizens: mockCitizens,
};

jest.mock("../apis/organisationAPI", () => ({
  fetchOrganisationRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve(mockOrganisation);
  }),
  deleteCitizenRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
  deleteMemberRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
  updateCitizenRequest: jest.fn().mockImplementation((updatedCitizen) => {
    return Promise.resolve(updatedCitizen);
  }),
}));

afterEach(async () => {
  await act(async () => {
    queryClient.clear();
    await queryClient.cancelQueries();
  });
});

test("fetches organisation", async () => {
  const { result } = renderHook(() => useOrganisation(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });
});

test("delete citizen from organisation", async () => {
  const { result } = renderHook(() => useOrganisation(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data?.citizens).toEqual([
      { id: 1, firstName: "Citizen 1", lastName: "CitizenTest1" },
      { id: 2, firstName: "Citizen 2", lastName: "CitizenTest2" },
    ]);
  });

  await act(async () => {
    await result.current.deleteCitizen.mutateAsync(1);
  });

  await waitFor(() => {
    expect(result.current.deleteCitizen.isSuccess).toBe(true);
  });
});

test("remove user from organisation", async () => {
  const { result } = renderHook(() => useOrganisation(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data?.users).toEqual([
      { id: "1", firstName: "User 1", lastName: "Test" },
      { id: "2", firstName: "User 2", lastName: "Test" },
    ]);
  });

  await act(async () => {
    await result.current.deleteMember.mutateAsync("1");
  });

  await waitFor(() => {
    expect(result.current.deleteMember.isSuccess).toBe(true);
  });

  await waitFor(() => {
    expect(result.current.data?.users).toEqual([{ id: "2", firstName: "User 2", lastName: "Test" }]);
  });
});

test("update citizen in organisation", async () => {
  const { result } = renderHook(() => useOrganisation(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data?.citizens).toEqual([
      { id: 1, firstName: "Citizen 1", lastName: "CitizenTest1" },
      { id: 2, firstName: "Citizen 2", lastName: "CitizenTest2" },
    ]);
  });

  await act(async () => {
    await result.current.updateCitizen.mutateAsync({
      id: 1,
      firstName: "Updated",
      lastName: "CitizenTest1",
    });
  });

  await waitFor(() => {
    expect(result.current.updateCitizen.isSuccess).toBe(true);
  });

  await waitFor(() => {
    expect(result.current.data?.citizens).toEqual([
      { id: 1, firstName: "Updated", lastName: "CitizenTest1" },
      { id: 2, firstName: "Citizen 2", lastName: "CitizenTest2" },
    ]);
  });
});
