import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createActivityRequest,
  deleteRequest,
  fetchRequest,
  toggleActivityStatusRequest,
  updateRequest,
} from '../apis/activityAPI';
import { ActivityDTO } from '../DTO/activityDTO';
import { useCitizen } from '../providers/CitizenProvider';

export const dateToQueryKey = (date: Date) => {
  if (!(date instanceof Date)) {
    throw new Error('Invalid date');
  }
  return ['activity', date.toISOString().split('T')[0]];
};
export default function useActivity({ date }: { date: Date }) {
  const queryKey = dateToQueryKey(date);
  const queryClient = useQueryClient();
  const { citizenId } = useCitizen();

  const useFetchActivities = useQuery<ActivityDTO[]>({
    queryFn: () => fetchRequest(citizenId, date),
    queryKey: queryKey,
  });

  const useDeleteActivity = useMutation({
    mutationFn: deleteRequest,
    onMutate: async (activityId: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previousActivities =
        queryClient.getQueryData<ActivityDTO[]>(queryKey);

      queryClient.setQueryData<ActivityDTO[]>(
        queryKey,
        (oldData) =>
          oldData?.filter((activity) => activity.activityId !== activityId) ||
          []
      );

      return { previousActivities };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData<ActivityDTO[]>(
          queryKey,
          context.previousActivities
        );
      }
    },
  });

  const updateActivity = useMutation({
    mutationFn: (variables: { activityId: number; data: ActivityDTO }) =>
      updateRequest(variables.data, variables.activityId),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousActivities =
        queryClient.getQueryData<ActivityDTO[]>(queryKey);

      queryClient.setQueryData<ActivityDTO[]>(
        queryKey,
        (oldData) =>
          oldData?.map((activity) =>
            activity.activityId === variables.activityId
              ? { ...activity, ...variables.data }
              : activity
          ) || []
      );

      return { previousActivities };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData<ActivityDTO[]>(
          queryKey,
          context.previousActivities
        );
      }
    },
  });

  const useCreateActivity = useMutation({
    mutationFn: (variables: { citizenId: number; data: ActivityDTO }) =>
      createActivityRequest(variables.data, variables.citizenId),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });

      const previousActivities =
        queryClient.getQueryData<ActivityDTO[]>(queryKey);

      queryClient.setQueryData<ActivityDTO[]>(queryKey, (oldData) => [
        ...(oldData || []),
        //Temporary activityId until the server responds with the actual id
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
    },
  });

  const toggleActivityStatus = useMutation({
    mutationFn: toggleActivityStatusRequest,

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previousActivities =
        queryClient.getQueryData<ActivityDTO[]>(queryKey);

      queryClient.setQueryData<ActivityDTO[]>(
        queryKey,
        (oldData) =>
          oldData?.map((activity) =>
            activity.activityId === id
              ? { ...activity, isCompleted: !activity.isCompleted }
              : activity
          ) || []
      );

      return { previousActivities };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData<ActivityDTO[]>(
          queryKey,
          context.previousActivities
        );
      }
    },
  });

  return {
    useFetchActivities,
    useDeleteActivity,
    updateActivity,
    toggleActivityStatus,
    useCreateActivity,
  };
}
