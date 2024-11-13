import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import useClasses from "../hooks/useClasses";

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

const mockCitizen = {
  id: 1,
  firstName: "Test",
  lastName: "Citizen",
};

const initialMockClass = {
  id: 1,
  name: "Test Class",
  citizens: [],
};

jest.mock("../apis/classAPI", () => ({
  fetchClassRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({ id: 1, name: "Test Class", citizens: [] });
  }),
  addCitizenToClassRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({ id: 1, firstName: "Test", lastName: "Citizen" });
  }),
  removeCitizenFromClassRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({ id: 1, name: "Test Class", citizens: [] });
  }),
  createNewClassRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
  fetchCitizenById: jest.fn().mockImplementation(() => {
    return Promise.resolve({ id: 1, firstName: "Test", lastName: "Citizen" });
  }),
}));

describe("useClasses", () => {
  beforeEach(() => {
    queryClient.setQueryData([1, "Class"], initialMockClass);
  });

  it("fetches class", async () => {
    const { result } = renderHook(() => useClasses(1), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(initialMockClass);
    });
  });

  it("adds citizen to class", async () => {
    const { result } = renderHook(() => useClasses(1), { wrapper });

    await act(async () => {
      await result.current.addCitizenToClass.mutateAsync(mockCitizen.id);
    });

    await waitFor(() => {
      const updatedClass = queryClient.getQueryData([1, "Class"]);
      expect(updatedClass).toEqual({
        ...initialMockClass,
        citizens: [{ ...mockCitizen, id: -1 }],
      });
    });
    expect(result.current.data?.citizens).toEqual([{ ...mockCitizen, id: -1 }]);
  });

  it("removes citizen from class", async () => {
    queryClient.setQueryData([1, "Class"], {
      ...initialMockClass,
      citizens: [{ ...mockCitizen, id: 1 }],
    });

    const { result } = renderHook(() => useClasses(1), { wrapper });

    await waitFor(() => {
      expect(result.current.data?.citizens).toEqual([{ ...mockCitizen, id: 1 }]);
    });

    await act(async () => {
      await result.current.removeCitizenFromClass.mutateAsync(mockCitizen.id);
    });

    await waitFor(() => {
      const updatedClass = queryClient.getQueryData([1, "Class"]);
      expect(updatedClass).toEqual({
        ...initialMockClass,
        citizens: [],
      });
    });
  });

  it("creates a new class", async () => {
    const { result } = renderHook(() => useClasses(1), { wrapper });

    await act(async () => {
      await result.current.createClass.mutate("New Class");
    });

    await waitFor(() => {
      expect(queryClient.getQueryData([1, "Class"])).toEqual(initialMockClass);
    });
  });

  it("finds organisation by class id", async () => {
    const mockClass = {
      id: 1,
      name: "Test Class",
      organisationId: 1,
    };
    const { result } = renderHook(() => useClasses(mockClass.id), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.useFetchOrganiasationFromClass().isSuccess).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.orgData).toEqual(mockOrganisationOverview);
    });
  });
});
