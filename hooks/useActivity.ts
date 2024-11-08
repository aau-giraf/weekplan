import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  copyActivitiesRequest,
  createActivityRequest,
  deleteRequest,
  fetchActivityRequest,
  fetchByDateRequest,
  toggleActivityStatusRequest,
  updateRequest,
} from "../apis/activityAPI";
import { ActivityDTO, FullActivityDTO } from "../DTO/activityDTO";
import { useCitizen } from "../providers/CitizenProvider";

export const dateToQueryKey = (date: Date) => {
  if (!(date instanceof Date)) {
    throw new Error("Invalid date");
  }
  return ["activity", date.toISOString().split("T")[0]];
};

/* It's highly recommended to read the docs at https://tanstack.com/query/latest
 * to understand how to use react-query. This hook utilises optimistic updates
 * and caching to provide a good user experience.
 */
/**
 * Hook to fetch activities for a specific date
 * @param date
 * @constructor
 * @return {useFetchActivities, useDeleteActivity, updateActivity, useToggleActivityStatus, useCreateActivity, copyActivities}
 * @return {invalidateQueries, data}
 * @return {useFetchActivity}
 */

export default function useActivity({ date }: { date: Date }) {
  const queryKey = dateToQueryKey(date);
  const queryClient = useQueryClient();
  const { citizenId } = useCitizen();

  const useFetchActivities = useQuery<ActivityDTO[]>({
    queryFn: async () => fetchByDateRequest(citizenId, date),
    queryKey: queryKey,
  });

  const useDeleteActivity = useMutation({
    mutationFn: deleteRequest,
    onMutate: async (activityId: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previousActivities = queryClient.getQueryData<ActivityDTO[]>(queryKey);

      queryClient.setQueryData<ActivityDTO[]>(
        queryKey,
        (oldData) => oldData?.filter((activity) => activity.activityId !== activityId) || []
      );

      return { previousActivities };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData<ActivityDTO[]>(queryKey, context.previousActivities);
      }
    },
  });

  const updateActivity = useMutation({
    mutationFn: (data: FullActivityDTO) => updateRequest(data, data.activityId),
    onMutate: async (data: FullActivityDTO) => {
      const { citizenId, ...activityData } = data;
      await queryClient.cancelQueries({ queryKey });

      const isSameDate = new Date(activityData.date).toDateString() === new Date(date).toDateString();

      if (isSameDate) {
        queryClient.setQueryData<ActivityDTO[]>(
          queryKey,
          (oldData) =>
            oldData?.map((activity) =>
              activity.activityId === activityData.activityId ? activityData : activity
            ) || []
        );
      } else {
        queryClient.setQueryData<ActivityDTO[]>(
          queryKey,
          (oldData) => oldData?.filter((activity) => activity.activityId !== activityData.activityId) || []
        );
      }

      return {
        previousActivities: queryClient.getQueryData<ActivityDTO[]>(queryKey),
      };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData<ActivityDTO[]>(queryKey, context.previousActivities);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const useCreateActivity = useMutation({
    mutationFn: (variables: { citizenId: number; data: ActivityDTO }) =>
      createActivityRequest(variables.data, variables.citizenId),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });

      const previousActivities = queryClient.getQueryData<ActivityDTO[]>(queryKey);

      queryClient.setQueryData<ActivityDTO[]>(queryKey, (oldData) => [
        ...(oldData || []),
        { ...variables.data, activityId: -1 },
      ]);
      return { previousActivities };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData(queryKey, context.previousActivities);
      }
    },

    onSuccess: (data, variables) => {
      queryClient.setQueryData<ActivityDTO[]>(queryKey, (oldData) => {
        return oldData?.map((activity) =>
          activity.activityId === variables.data.activityId ? data : activity
        );
      });
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const copyActivities = useMutation({
    mutationFn: (variables: { activityIds: number[]; sourceDate: Date; destinationDate: Date }) =>
      copyActivitiesRequest(
        citizenId,
        variables.activityIds,
        variables.sourceDate,
        variables.destinationDate
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const useToggleActivityStatus = useMutation({
    mutationFn: ({ id, isCompleted }: { id: number; isCompleted: boolean }) =>
      toggleActivityStatusRequest(id, isCompleted),

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousActivities = queryClient.getQueryData<ActivityDTO[]>(queryKey);

      queryClient.setQueryData<ActivityDTO[]>(
        queryKey,
        (oldData) =>
          oldData?.map((activity) =>
            activity.activityId === id ? { ...activity, isCompleted: !activity.isCompleted } : activity
          ) || []
      );

      return { previousActivities };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData<ActivityDTO[]>(queryKey, context.previousActivities);
      }
    },
  });

  return {
    invalidateQueries: () => queryClient.invalidateQueries({ queryKey }),
    data: useFetchActivities.data,
    useFetchActivities,
    useDeleteActivity,
    updateActivity,
    useToggleActivityStatus,
    useCreateActivity,
    copyActivities,
  };
}

export function useSingleActivity({ activityId }: { activityId: number }) {
  const useFetchActivity = useQuery<ActivityDTO>({
    queryFn: () => fetchActivityRequest(activityId),
    queryKey: ["activity", activityId],
  });

  return {
    useFetchActivity,
  };
}
