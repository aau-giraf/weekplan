import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import useInvitation from "../hooks/useInvitation";
import { acceptInvitationRequest } from "../apis/invitationAPI";

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

jest.mock("../providers/AuthenticationProvider", () => ({
  useAuthentication: () => ({
    userId: "mockUserId",
  }),
}));

const mockInvitation = {
  id: 1,
  organisationId: 1,
  organisationName: "Test Organisation",
  userId: "mockUserId",
};

jest.mock("../apis/invitationAPI", () => ({
  fetchInvitationByUserRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve([mockInvitation, { ...mockInvitation, id: 2 }]);
  }),
  acceptInvitationRequest: jest.fn().mockImplementation(() => {
    return Promise.resolve({ ...mockInvitation, id: 3 });
  }),
}));

afterEach(async () => {
  await act(async () => {
    queryClient.clear();
    await queryClient.cancelQueries();
  });
});

test("fetches invitations by user", async () => {
  const { result } = renderHook(() => useInvitation(), { wrapper });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.fetchByUser.data).toEqual([mockInvitation, { ...mockInvitation, id: 2 }]);
});

test("accepts invitation", async () => {
  const { result } = renderHook(() => useInvitation(), { wrapper });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  await act(async () => {
    result.current.acceptInvitation.mutate({
      invitationId: 1,
      isAccepted: true,
    });
  });

  await waitFor(() => {
    expect(result.current.acceptInvitation.isSuccess).toBe(true);
  });

  expect(acceptInvitationRequest).toHaveBeenCalledWith(1, true);
});

test("reject invitation", async () => {
  const { result } = renderHook(() => useInvitation(), { wrapper });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  await act(async () => {
    result.current.acceptInvitation.mutate({
      invitationId: 1,
      isAccepted: false,
    });
  });

  await waitFor(() => {
    expect(result.current.acceptInvitation.isSuccess).toBe(true);
  });

  expect(acceptInvitationRequest).toHaveBeenCalledWith(1, false);
});
