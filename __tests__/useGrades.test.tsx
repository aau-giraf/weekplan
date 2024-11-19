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
];

const mockGrade = {
  id: 1,
  name: "Grade 1",
  citizens: [{ id: 1, firstName: "Citizen 1", lastName: "CitizenTest1" }],
};

const mockOrganisation = {
  id: 1,
  name: "Test Organisation",
  users: [
    { id: "1", firstName: "User 1", lastName: "Test" },
    { id: "2", firstName: "User 2", lastName: "Test" },
  ],
  citizens: [
    { id: 1, firstName: "Citizen 1", lastName: "CitizenTest1" },
    { id: 2, firstName: "Citizen 2", lastName: "CitizenTest2" },
  ],
  grades: [mockGrade],
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

jest.spyOn(queryClient, "invalidateQueries").mockImplementation(() => Promise.resolve());

jest.mock("../apis/gradeAPI", () => ({
  addCitizenToGradeRequest: jest.fn().mockImplementation((citizenIds: number[], gradeId: number) => {
    return Promise.resolve({
      id: 1,
      name: "Grade 1",
      citizens: [
        { id: 1, firstName: "Citizen 1", lastName: "CitizenTest1" },
        { id: 2, firstName: "Citizen 2", lastName: "CitizenTest2" },
      ],
    });
  }),
  removeCitizenFromGradeRequest: jest.fn().mockImplementation((citizenIds: number[], gradeId: number) => {
    return Promise.resolve({ id: 1, name: "Grade 1", citizens: [] });
  }),
  fetchOrganisationFromGradeRequest: jest.fn().mockImplementation((gradeId: number) => {
    return Promise.resolve(mockOrganisation);
  }),
  fetchCitizenById: jest.fn().mockImplementation((citizenId: number) => {
    return Promise.resolve({ id: 2, firstName: "Citizen 2", lastName: "CitizenTest2" });
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
    await result.current.addCitizenToGrade.mutateAsync([2]);
  });

  await waitFor(() => {
    expect(result.current.data?.grades[0].citizens).toEqual(mockCitizens);
  });
});
test("should remove citizen from grade", async () => {
  const { result } = renderHook(() => useGrades(1), { wrapper });

  await waitFor(() => {
    expect(result.current.data).toEqual(mockOrganisation);
  });

  await act(async () => {
    await result.current.removeCitizenFromGrade.mutateAsync([1]);
  });

  await waitFor(() => {
    expect(result.current.data?.grades[0].citizens).toEqual([]);
  });
});
