import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import useActivity, { dateToQueryKey } from '../hooks/useActivity';
import { ActivityDTO } from '../DTO/activityDTO';

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

const mockActivity: ActivityDTO = {
  activityId: 1,
  name: 'test',
  description: 'testDescription',
  startTime: '19:00:00',
  endTime: '21:00:00',
  date: '2024-10-13',
  isCompleted: false,
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

jest.mock('../apis/activityAPI', () => ({
  fetchRequest: jest.fn().mockImplementation((activityId: number, date) => {
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
  toggleActivityStatusRequest: jest
    .fn()
    .mockImplementation((activityId: number) => {
      return Promise.resolve({ activityId, isCompleted: true });
    }),
  createActivityRequest: jest
    .fn()
    .mockImplementation((activity: ActivityDTO) => {
      return Promise.resolve({ ...activity });
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

test('query key is correct', () => {
  const date = new Date('2024-10-01');
  const key = dateToQueryKey(date);
  expect(key).toEqual(['activity', '2024-10-01']);
});

test('invalid date throws an error', () => {
  const date = '2024-10-01';
  expect(() => dateToQueryKey(date as any)).toThrow();
});

test('invalid date throws on error when used in useActivity', async () => {
  //Needed to not log the error
  const consoleErrorMock = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});
  const date = '2024-10-01';
  try {
    renderHook(() => useActivity({ date: date as any }), { wrapper });
  } catch (error) {
    expect(error).toEqual(new Error('Invalid date'));
  }

  consoleErrorMock.mockRestore();
});

test('deleteActivity removes the activity from the list', async () => {
  const date = new Date('2024-10-01');
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  const key = dateToQueryKey(date);

  await act(async () => {
    queryClient.setQueryData<ActivityDTO[]>(key, [
      { ...mockActivity, activityId: 1 },
      { ...mockActivity, activityId: 2 },
    ]);
    await result.current.useDeleteActivity.mutateAsync(1);
  });

  await waitFor(() => {
    expect(queryClient.getQueryData<ActivityDTO[]>(key)).toEqual([
      { ...mockActivity, activityId: 2 },
    ]);
  });
});

test('updateActivity updates the activity in the list', async () => {
  const date = new Date('2024-10-01');
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  const key = dateToQueryKey(date);

  await act(async () => {
    queryClient.setQueryData<ActivityDTO[]>(key, [
      { ...mockActivity, activityId: 1 },
      { ...mockActivity, activityId: 2 },
    ]);
    await result.current.updateActivity.mutateAsync({
      activityId: 1,
      data: { ...mockActivity, activityId: 1, isCompleted: true },
    });
  });

  await waitFor(() => {
    expect(queryClient.getQueryData<ActivityDTO[]>(key)).toEqual([
      { ...mockActivity, activityId: 1, isCompleted: true },
      { ...mockActivity, activityId: 2 },
    ]);
  });
});

test('fetchActivities retrieves and sets activities', async () => {
  const date = new Date('2024-10-01');
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  await waitFor(() =>
    expect(result.current.useFetchActivities(1).isSuccess).toBe(true)
  );

  //TODO NEED PROVIDER INSTEAD OF THIS
  expect(result.current.useFetchActivities().data).toEqual([
    { activityId: 1, isCompleted: false },
    { activityId: 2, isCompleted: false },
  ]);
});

test('createActivity adds a new activity to the list', async () => {
  const date = new Date('2024-10-01');
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  const key = dateToQueryKey(date);

  await act(async () => {
    queryClient.setQueryData<ActivityDTO[]>(key, [
      { ...mockActivity, activityId: 1 },
      { ...mockActivity, activityId: 2 },
    ]);
  });

  await act(async () => {
    await result.current.useCreateActivity.mutateAsync({
      citizenId: 1,
      data: { ...mockActivity, activityId: 3 },
    });
  });

  await waitFor(() => {
    expect(queryClient.getQueryData<ActivityDTO[]>(key)).toEqual([
      { ...mockActivity, activityId: 1 },
      { ...mockActivity, activityId: 2 },
      { ...mockActivity, activityId: 3 },
    ]);
  });
});

test('toggleActivityStatus toggles the status of the activity', async () => {
  const date = new Date('2024-10-01');
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  const key = dateToQueryKey(date);

  await act(async () => {
    queryClient.setQueryData<ActivityDTO[]>(key, [
      { ...mockActivity, activityId: 1 },
      { ...mockActivity, activityId: 2 },
    ]);
  });

  await act(async () => {
    await result.current.toggleActivityStatus.mutateAsync(1);
  });

  const updatedData = queryClient.getQueryData<ActivityDTO[]>(key);
  const activityWithId1 = updatedData?.find(
    (activity) => activity.activityId === 1
  );

  await waitFor(() => {
    expect(activityWithId1).toEqual(
      expect.objectContaining({ isCompleted: true })
    );
  });
});

test('toggleActivityStatus does not update the list if the activity is not found', async () => {
  const date = new Date('2024-10-01');
  const { result } = renderHook(() => useActivity({ date }), {
    wrapper,
  });

  const key = dateToQueryKey(date);

  await act(async () => {
    queryClient.setQueryData<ActivityDTO[]>(key, [
      { ...mockActivity, activityId: 1 },
      { ...mockActivity, activityId: 2 },
    ]);
  });

  await act(async () => {
    await result.current.toggleActivityStatus.mutateAsync(3);
  });

  await waitFor(() => {
    const updatedData = queryClient.getQueryData<ActivityDTO[]>(key);
    expect(updatedData).toEqual([
      { ...mockActivity, activityId: 1 },
      { ...mockActivity, activityId: 2 },
    ]);
  });
});

//THESE ARE THE FUCKERS
//ONE OR ALL OF THESE FAILS
test('toggleActivityStatus does not update data if the key differs from initial', async () => {
  const initialDate = new Date('2024-10-01');
  const { result } = renderHook(() => useActivity({ date: initialDate }), {
    wrapper,
  });

  const differentKey = dateToQueryKey(new Date('2024-10-02'));

  await act(async () => {
    queryClient.setQueryData<ActivityDTO[]>(differentKey, [
      { ...mockActivity, activityId: 1 },
    ]);
    await result.current.toggleActivityStatus.mutateAsync(1);
  });

  await waitFor(() => {
    const differentKeyData =
      queryClient.getQueryData<ActivityDTO[]>(differentKey);
    expect(differentKeyData).toEqual([{ ...mockActivity, activityId: 1 }]);
  });
});

test('deleteActivity does not remove data if the key differs from initial', async () => {
  const initialDate = new Date('2024-10-01');
  const { result } = renderHook(() => useActivity({ date: initialDate }), {
    wrapper,
  });

  const differentKey = dateToQueryKey(new Date('2024-10-02'));

  await act(async () => {
    queryClient.setQueryData<ActivityDTO[]>(differentKey, [
      { ...mockActivity, activityId: 1 },
    ]);
    await result.current.useDeleteActivity.mutateAsync(1);
  });

  await waitFor(() => {
    const differentKeyData =
      queryClient.getQueryData<ActivityDTO[]>(differentKey);
    expect(differentKeyData).toEqual([{ ...mockActivity, activityId: 1 }]);
  });
});
