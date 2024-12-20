import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import useActivity, {
  ActivityDTO,
  dateToQueryKey,
  FullActivityDTO,
  useSingleActivity,
} from "../hooks/useActivity";
import WeekplanProvider from "../providers/WeekplanProvider";

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

const mockActivity: FullActivityDTO = {
  citizenId: 1,
  activityId: 1,
  startTime: "19:00:00",
  endTime: "21:00:00",
  date: "2024-10-13",
  isCompleted: false,
  pictogram: {
    id: 1,
    organizationId: 1,
    pictogramName: "test",
    pictogramUrl: "test",
  },
};

const mockCitizenData = { id: 1, isCitizen: true };

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WeekplanProvider defaultValue={mockCitizenData}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </WeekplanProvider>
);

jest.spyOn(queryClient, "invalidateQueries").mockImplementation(() => Promise.resolve());

jest.mock("../apis/activityAPI", () => ({
  fetchByDateCitizen: jest.fn().mockImplementation((activityId: number, date) => {
    return Promise.resolve([
      { ...mockActivity, activityId: 1 },
      { ...mockActivity, activityId: 2 },
    ]);
  }),
  deleteRequest: jest.fn().mockImplementation((activityId: number) => {
    return Promise.resolve();
  }),
  updateRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
  toggleActivityStatusRequest: jest.fn().mockImplementation((activityId: number) => {
    return Promise.resolve({ activityId, isCompleted: true });
  }),
  createActivityRequestForCitizen: jest.fn().mockImplementation((activity: ActivityDTO) => {
    return Promise.resolve({ ...activity, activityId: 3 });
  }),
  fetchActivityRequest: jest.fn().mockImplementation((activityId: number) => {
    return Promise.resolve({ ...mockActivity, activityId });
  }),
  createActivityCitizen: jest.fn().mockImplementation(() => {
    return Promise.resolve({ ...mockActivity, activityId: 3 });
  }),
}));

beforeEach(async () => {
  await act(async () => {
    queryClient.clear();
    await queryClient.cancelQueries();
  });
});

afterEach(async () => {
  await act(async () => {
    queryClient.clear();
    await queryClient.cancelQueries();
  });
});

test("query key is correct", () => {
  const date = new Date("2024-10-01");
  const citizenKey = dateToQueryKey(date, mockCitizenData.isCitizen, mockCitizenData.id);
  const gradeKey = dateToQueryKey(date, false, 1);
  expect(citizenKey).toEqual(["activity", "citizen", "2024-10-01", 1]);
  expect(gradeKey).toEqual(["activity", "grade", "2024-10-01", 1]);
});

test("invalid date throws an error", () => {
  const date = "2024-10-01";
  expect(() => dateToQueryKey(date as any, mockCitizenData.isCitizen, mockCitizenData.id)).toThrow();
});

test("invalid date throws on error when used in useActivity", async () => {
  //Needed to not log the error
  const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
  const date = "2024-10-01";

  expect(() => {
    renderHook(() => useActivity({ date: date as any }), { wrapper });
  }).toThrow();

  consoleErrorMock.mockRestore();
});

test("deleteActivity removes the activity from the list", async () => {
  const date = new Date("2024-10-01");
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  await waitFor(() => expect(result.current.useFetchActivities.isSuccess).toBe(true));

  const key = dateToQueryKey(date, mockCitizenData.isCitizen, mockCitizenData.id);

  await act(async () => {
    queryClient.setQueryData<ActivityDTO[]>(key, [
      { ...mockActivity, activityId: 1 },
      { ...mockActivity, activityId: 2 },
    ]);
    await result.current.useDeleteActivity.mutateAsync(1);
  });

  await waitFor(() => {
    expect(result.current.useDeleteActivity.isSuccess).toBe(true);
  });
  expect(queryClient.getQueryData<ActivityDTO[]>(key)).toEqual([{ ...mockActivity, activityId: 2 }]);
});

test("updateActivity updates the activity in the list", async () => {
  const date = new Date("2024-10-13");
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  await waitFor(() => {
    expect(result.current.useFetchActivities.isSuccess).toBe(true);
  });

  const key = dateToQueryKey(date, mockCitizenData.isCitizen, mockCitizenData.id);
  const { citizenId, ...localMock } = mockActivity;
  await act(async () => {
    queryClient.setQueryData<ActivityDTO[]>(key, [
      { ...localMock, activityId: 1 },
      { ...localMock, activityId: 2 },
    ]);
    await result.current.updateActivity.mutateAsync({
      ...mockActivity,
    });
  });

  await waitFor(() => {
    expect(result.current.updateActivity.isSuccess).toBe(true);
  });

  expect(queryClient.getQueryData<ActivityDTO[]>(key)).toEqual([
    { ...localMock, activityId: 1 },
    { ...localMock, activityId: 2 },
  ]);
});

test("updateActivity removes activity when date differs", async () => {
  const date = new Date("2024-10-14");
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  await waitFor(() => {
    expect(result.current.useFetchActivities.isSuccess).toBe(true);
  });

  const key = dateToQueryKey(date, mockCitizenData.isCitizen, mockCitizenData.id);
  const { citizenId, ...localMock } = mockActivity;
  await act(async () => {
    queryClient.setQueryData<ActivityDTO[]>(key, [
      { ...localMock, activityId: 1 },
      { ...localMock, activityId: 2 },
    ]);
    await result.current.updateActivity.mutateAsync({
      ...mockActivity,
    });
  });

  await waitFor(() => {
    expect(result.current.updateActivity.isSuccess).toBe(true);
  });

  expect(queryClient.getQueryData<ActivityDTO[]>(key)).toEqual([{ ...localMock, activityId: 2 }]);
});

test("fetchActivities retrieves and sets activities", async () => {
  const date = new Date("2024-10-01");
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  await waitFor(() => {
    expect(result.current.useFetchActivities.isSuccess).toBe(true);
  });

  expect(result.current.useFetchActivities.data).toEqual([
    { ...mockActivity, activityId: 1 },
    { ...mockActivity, activityId: 2 },
  ]);
});

test("createActivity adds a new activity to the list", async () => {
  const date = new Date("2024-10-01");
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  await waitFor(() => {
    expect(result.current.useFetchActivities.isSuccess).toBe(true);
  });

  const key = dateToQueryKey(date, mockCitizenData.isCitizen, mockCitizenData.id);

  await act(async () => {
    queryClient.setQueryData<ActivityDTO[]>(key, [
      { ...mockActivity, activityId: 1 },
      { ...mockActivity, activityId: 2 },
    ]);
    await result.current.useCreateActivity.mutateAsync({
      id: 1,
      data: { ...mockActivity, activityId: -1 },
    });
  });

  await waitFor(() => {
    expect(result.current.useCreateActivity.isSuccess).toBe(true);
  });

  const updatedData = queryClient.getQueryData<ActivityDTO[]>(key);
  expect(updatedData).toEqual([
    { ...mockActivity, activityId: 1 },
    { ...mockActivity, activityId: 2 },
    { ...mockActivity, activityId: 3 },
  ]);
});

test("toggleActivityStatus toggles the status of the activity", async () => {
  const date = new Date("2024-10-01");
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  await waitFor(() => {
    expect(result.current.useFetchActivities.isSuccess).toBe(true);
  });
  const key = dateToQueryKey(date, mockCitizenData.isCitizen, mockCitizenData.id);

  await act(async () => {
    queryClient.setQueryData<ActivityDTO[]>(key, [
      { ...mockActivity, activityId: 1 },
      { ...mockActivity, activityId: 2 },
    ]);
    await result.current.useToggleActivityStatus.mutateAsync({
      id: 1,
      isCompleted: true,
    });
  });

  await waitFor(() => {
    expect(result.current.useToggleActivityStatus.isSuccess).toBe(true);
  });
  const updatedData = queryClient.getQueryData<ActivityDTO[]>(key);
  const activityWithId1 = updatedData?.find((activity) => activity.activityId === 1);
  expect(activityWithId1).toEqual(expect.objectContaining({ isCompleted: true }));
});

test("toggleActivityStatus does not update the list if the activity is not found", async () => {
  const date = new Date("2024-10-01");
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });
  await waitFor(() => {
    expect(result.current.useFetchActivities.isSuccess).toBe(true);
  });
  const key = dateToQueryKey(date, mockCitizenData.isCitizen, mockCitizenData.id);

  await act(async () => {
    queryClient.setQueryData<ActivityDTO[]>(key, [
      { ...mockActivity, activityId: 1 },
      { ...mockActivity, activityId: 2 },
    ]);
    await result.current.useToggleActivityStatus.mutateAsync({
      id: 3,
      isCompleted: true,
    });
  });

  await waitFor(() => {
    expect(result.current.useToggleActivityStatus.isSuccess).toBe(true);
  });
  const updatedData = queryClient.getQueryData<ActivityDTO[]>(key);
  expect(updatedData).toEqual([
    { ...mockActivity, activityId: 1 },
    { ...mockActivity, activityId: 2 },
  ]);
});

test("toggleActivityStatus does not update data if the key differs from initial", async () => {
  const initialDate = new Date("2024-10-01");
  const { result } = renderHook(() => useActivity({ date: initialDate }), {
    wrapper,
  });
  await waitFor(() => {
    expect(result.current.useFetchActivities.isSuccess).toBe(true);
  });
  const differentKey = dateToQueryKey(new Date("2024-10-02"), mockCitizenData.isCitizen, mockCitizenData.id);

  await act(async () => {
    queryClient.setQueryData<ActivityDTO[]>(differentKey, [{ ...mockActivity, activityId: 1 }]);
    await result.current.useToggleActivityStatus.mutateAsync({
      id: 1,
      isCompleted: true,
    });
  });

  await waitFor(() => {
    expect(result.current.useToggleActivityStatus.isSuccess).toBe(true);
  });
  const differentKeyData = queryClient.getQueryData<ActivityDTO[]>(differentKey);
  expect(differentKeyData).toEqual([{ ...mockActivity, activityId: 1 }]);
});

test("deleteActivity does not remove data if the key differs from initial", async () => {
  const initialDate = new Date("2024-10-01");
  const { result } = renderHook(() => useActivity({ date: initialDate }), {
    wrapper,
  });
  await waitFor(() => {
    expect(result.current.useFetchActivities.isSuccess).toBe(true);
  });
  const differentKey = dateToQueryKey(new Date("2024-10-02"), mockCitizenData.isCitizen, mockCitizenData.id);

  await act(async () => {
    queryClient.setQueryData<ActivityDTO[]>(differentKey, [{ ...mockActivity, activityId: 1 }]);
    await result.current.useDeleteActivity.mutateAsync(1);
  });

  await waitFor(() => {
    expect(result.current.useDeleteActivity.isSuccess).toBe(true);
  });

  const differentKeyData = queryClient.getQueryData<ActivityDTO[]>(differentKey);
  expect(differentKeyData).toEqual([{ ...mockActivity, activityId: 1 }]);
});

test("useSingleActivity returns the correct activity", async () => {
  const id = 1;
  const { result } = renderHook(() => useSingleActivity({ activityId: id }), {
    wrapper,
  });
  await waitFor(() => {
    expect(result.current.useFetchActivity.isSuccess).toBe(true);
  });

  expect(result.current.useFetchActivity.data).toEqual(mockActivity);
});
