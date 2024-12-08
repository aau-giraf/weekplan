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
  { id: 1, firstName: "Citizen 1", lastName: "CitizenTest1", activities: [] },
  { id: 2, firstName: "Citizen 2", lastName: "CitizenTest2", activities: [] },
];

const mockOrganisation = {
  id: 1,
  name: "Test Organisation",
  users: [
    { id: "1", firstName: "User 1", lastName: "Test" },
    { id: "2", firstName: "User 2", lastName: "Test" },
  ],
  citizens: mockCitizens,
  grades: [],
};

const mockUpdatedOrganisation = {
  id: 1,
  name: "Updated Organisation",
  users: [
    { id: "1", firstName: "User 1", lastName: "Test" },
    { id: "2", firstName: "User 2", lastName: "Test" },
  ],
  citizens: mockCitizens,
  grades: [],
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
  createCitizenRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve(3);
  }),
  updateOrganisationRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve(mockUpdatedOrganisation);
  }),
  makeAdminRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
  removeAdminRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
}));

jest.mock("../apis/gradeAPI", () => ({
  createNewGradeRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve();
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
      { id: 1, firstName: "Citizen 1", lastName: "CitizenTest1", activities: [] },
      { id: 2, firstName: "Citizen 2", lastName: "CitizenTest2", activities: [] },
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
      { id: 1, firstName: "Citizen 1", lastName: "CitizenTest1", activities: [] },
      { id: 2, firstName: "Citizen 2", lastName: "CitizenTest2", activities: [] },
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
      { id: 1, firstName: "Updated", lastName: "CitizenTest1", activities: [] },
      { id: 2, firstName: "Citizen 2", lastName: "CitizenTest2", activities: [] },
    ]);
  });
});

test("Create a new grade in organisation", async () => {
  const { result } = renderHook(() => useOrganisation(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data?.grades).toEqual([]);
  });

  await act(async () => {
    await result.current.createGrade.mutateAsync("Grade 1");
  });

  await waitFor(() => {
    expect(result.current.createGrade.isSuccess).toBe(true);
  });

  await waitFor(() => {
    expect(result.current.data?.grades).toEqual([{ id: -1, name: "Grade 1", citizens: [] }]);
  });
});

test("Create a new citizen in organisation", async () => {
  const { result } = renderHook(() => useOrganisation(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data?.citizens).toEqual([
      { id: 1, firstName: "Citizen 1", lastName: "CitizenTest1", activities: [] },
      { id: 2, firstName: "Citizen 2", lastName: "CitizenTest2", activities: [] },
    ]);
  });

  await act(async () => {
    await result.current.createCitizen.mutateAsync({
      firstName: "Citizen 3",
      lastName: "CitizenTest3",
      activities: [],
    });
  });

  await waitFor(() => {
    expect(result.current.createCitizen.isSuccess).toBe(true);
  });

  await waitFor(() => {
    expect(result.current.data?.citizens).toEqual([
      { id: 3, firstName: "Citizen 3", lastName: "CitizenTest3", activities: [] },
      { id: 1, firstName: "Citizen 1", lastName: "CitizenTest1", activities: [] },
      { id: 2, firstName: "Citizen 2", lastName: "CitizenTest2", activities: [] },
    ]);
  });
});

test("Should update organisation", async () => {
  const { result } = renderHook(() => useOrganisation(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });

  await act(async () => {
    await result.current.updateOrganisation.mutateAsync({ name: "Updated Organisation" });
  });

  await waitFor(() => {
    expect(result.current.updateOrganisation.isSuccess).toBe(true);
  });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockUpdatedOrganisation);
  });
});

test("Should make user admin", async () => {
  const { result } = renderHook(() => useOrganisation(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });

  await act(async () => {
    await result.current.makeMemberAdmin.mutateAsync("1");
  });

  await waitFor(() => {
    expect(result.current.makeMemberAdmin.isSuccess).toBe(true);
  });
});

test("Should remove user as admin", async () => {
  const { result } = renderHook(() => useOrganisation(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });

  await act(async () => {
    await result.current.removeAdmin.mutateAsync("1");
  });

  await waitFor(() => {
    expect(result.current.removeAdmin.isSuccess).toBe(true);
  });
});

test("Should not remove user as admin if user is owner", async () => {
  const { result } = renderHook(() => useOrganisation(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });

  await act(async () => {
    await result.current.removeAdmin.mutateAsync("2");
  });

  await waitFor(() => {
    expect(result.current.removeAdmin.isError).toBe(false);
  });
});

test("Should not remove user as admin if user is not moderator", async () => {
  const { result } = renderHook(() => useOrganisation(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });

  await act(async () => {
    await result.current.removeAdmin.mutateAsync("1");
  });

  await waitFor(() => {
    expect(result.current.removeAdmin.isError).toBe(false);
  });
});

test("Should not make user admin if user is owner", async () => {
  const { result } = renderHook(() => useOrganisation(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });

  await act(async () => {
    await result.current.makeMemberAdmin.mutateAsync("2");
  });

  await waitFor(() => {
    expect(result.current.makeMemberAdmin.isError).toBe(false);
  });
});

test("Should not make user admin if user is already admin", async () => {
  const { result } = renderHook(() => useOrganisation(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });

  await act(async () => {
    await result.current.makeMemberAdmin.mutateAsync("1");
  });

  await waitFor(() => {
    expect(result.current.makeMemberAdmin.isError).toBe(false);
  });
});

test("Should not remove owner admin role", async () => {
  const { result } = renderHook(() => useOrganisation(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });

  await act(async () => {
    await result.current.removeAdmin.mutateAsync("1");
  });

  await waitFor(() => {
    expect(result.current.removeAdmin.isError).toBe(false);
  });
});
