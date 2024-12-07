import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import { act } from "react";
import useGrades from "../hooks/useGrades";

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

const mockCitizens = [
  {
    id: 1,
    firstName: "Citizen 1",
    lastName: "CitizenTest1",
  },
  {
    id: 2,
    firstName: "Citizen 2",
    lastName: "CitizenTest2",
  },
  {
    id: 3,
    firstName: "Citizen 3",
    lastName: "CitizenTest3",
  },
];

const mockGrade = {
  id: 1,
  name: "Grade 1",
  citizens: [
    {
      id: 1,
      firstName: "Citizen 1",
      lastName: "CitizenTest1",
    },
    {
      id: 2,
      firstName: "Citizen 2",
      lastName: "CitizenTest2",
    },
  ],
};

const mockUpdatedGrade = {
  id: 1,
  name: "Updated grade",
  citizens: [
    {
      id: 1,
      firstName: "Citizen 1",
      lastName: "CitizenTest1",
    },
    {
      id: 2,
      firstName: "Citizen 2",
      lastName: "CitizenTest2",
    },
    {
      id: 3,
      firstName: "Citizen 3",
      lastName: "CitizenTest3",
    },
  ],
};

const mockOrganisation = {
  id: 1,
  name: "Test Organisation",
  users: [
    { id: "1", firstName: "User 1", lastName: "Test" },
    { id: "2", firstName: "User 2", lastName: "Test" },
  ],
  citizens: mockCitizens,
  grades: [mockGrade],
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

jest.spyOn(queryClient, "invalidateQueries").mockImplementation(() => Promise.resolve());

jest.mock("../apis/gradeAPI", () => ({
  addCitizenToGradeRequest: jest.fn().mockImplementation((citizenIds: number[], gradeId: number) => {
    return Promise.resolve({
      id: gradeId,
      name: "Grade 1",
      citizens: [
        mockCitizens[citizenIds[0] - 1],
        mockCitizens[citizenIds[1] - 1],
        mockCitizens[citizenIds[2] - 1],
      ],
    });
  }),
  removeCitizenFromGradeRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
  fetchOrganisationFromGradeRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve(mockOrganisation);
  }),
  fetchCitizenById: jest.fn().mockImplementation((citizenId: number) => {
    return Promise.resolve(mockCitizens[citizenId - 1]);
  }),
  updateGradeRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve(mockUpdatedGrade);
  }),
}));

afterEach(async () => {
  await act(async () => {
    queryClient.clear();
    await queryClient.cancelQueries();
  });
});

test("should fetch organisation based on a gradeId", async () => {
  const { result } = renderHook(() => useGrades(1), { wrapper });
  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });
});

test("should add citizen to grade", async () => {
  const { result } = renderHook(() => useGrades(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });

  await act(async () => {
    await result.current.addCitizenToGrade.mutateAsync({ citizenIds: [3], orgId: mockOrganisation.id });
  });

  await waitFor(() => {
    expect(result.current.data?.grades[0].citizens).toEqual(mockCitizens);
  });
});

test("should not update grade when attempting to add an invalid citizen", async () => {
  const { result } = renderHook(() => useGrades(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });

  await act(async () => {
    await result.current.addCitizenToGrade.mutateAsync({ citizenIds: [4], orgId: mockOrganisation.id });
  });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });
});

test("should remove citizens from grade", async () => {
  const { result } = renderHook(() => useGrades(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });

  await act(async () => {
    await result.current.removeCitizenFromGrade.mutateAsync({
      citizenIds: [1, 2],
      orgId: mockOrganisation.id,
    });
  });

  await waitFor(() => {
    expect(result.current.data?.grades[0].citizens).toEqual([]);
  });
});

test("should not update grade when attempting to remove an invalid citizen", async () => {
  const { result } = renderHook(() => useGrades(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });

  await act(async () => {
    await result.current.removeCitizenFromGrade.mutateAsync({ citizenIds: [3], orgId: mockOrganisation.id });
  });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });
});

test("should update grade", async () => {
  const { result } = renderHook(() => useGrades(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });

  await act(async () => {
    await result.current.updateGrade.mutateAsync({ gradeName: "Updated grade", orgId: mockOrganisation.id });
  });

  await waitFor(() => {
    expect(result.current.data?.grades[0].name).toEqual("Updated grade");
  });
});
