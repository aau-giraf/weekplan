import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createActivityRequest,
  deleteRequest,
  fetchRequest,
  toggleActivityStatusRequest,
  updateRequest,
} from '../apis/activityAPI';
import { ActivityDTO, FullActivityDTO } from '../DTO/activityDTO';

export const dateToQueryKey = (date: Date) => {
  if (!(date instanceof Date)) {
    throw new Error('Invalid date');
  }
  return ['activity', date.toISOString().split('T')[0]];
};
export default function useActivity({ date }: { date: Date }) {
  const queryKey = dateToQueryKey(date);
  const queryClient = useQueryClient();

  const useFetchActivities = (id: number) => {
    return useQuery<FullActivityDTO[]>({
      queryFn: () => fetchRequest(id, date),
      queryKey: queryKey,
    });
  };

  const useDeleteActivity = useMutation({
    mutationFn: deleteRequest,
    onMutate: async (activityId: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previousActivities =
        queryClient.getQueryData<FullActivityDTO[]>(queryKey);

      queryClient.setQueryData<FullActivityDTO[]>(
        queryKey,
        (oldData) =>
          oldData?.filter((activity) => activity.activityId !== activityId) ||
          []
      );

      return { previousActivities };
    },

    onError: (error, variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData<FullActivityDTO[]>(
          queryKey,
          context.previousActivities
        );
      }
    },
  });

  const updateActivity = useMutation({
    mutationFn: (variables: { id: number; data: Partial<FullActivityDTO> }) =>
      updateRequest(variables),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousActivities =
        queryClient.getQueryData<FullActivityDTO[]>(queryKey);

      queryClient.setQueryData<FullActivityDTO[]>(
        queryKey,
        (oldData) =>
          oldData?.map((activity) =>
            activity.activityId === variables.id
              ? { ...activity, ...variables.data }
              : activity
          ) || []
      );

      return { previousActivities };
    },

    onError: (error, variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData<FullActivityDTO[]>(
          queryKey,
          context.previousActivities
        );
      }
    },
  });

  const useCreateActivity = useMutation({
    mutationFn: (variables: { citizenId: number; data: ActivityDTO }) =>
      createActivityRequest(variables),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousActivities =
        queryClient.getQueryData<ActivityDTO[]>(queryKey);

      queryClient.setQueryData<ActivityDTO[]>(queryKey, (oldData) => [
        ...(oldData || []),
        variables.data,
      ]);

      return { previousActivities };
    },
    onError: (err, variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData(queryKey, context.previousActivities);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const toggleActivityStatus = useMutation({
    mutationFn: toggleActivityStatusRequest,

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previousActivities =
        queryClient.getQueryData<FullActivityDTO[]>(queryKey);

      queryClient.setQueryData<FullActivityDTO[]>(
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

    onError: (error, variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData<FullActivityDTO[]>(
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
