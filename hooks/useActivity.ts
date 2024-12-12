import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  copyActivitiesCitizenRequest,
  copyActivitiesGradeRequest,
  createActivityCitizen,
  createActivityGrade,
  deleteRequest,
  fetchActivityRequest,
  fetchByDateCitizen,
  fetchByDateGrade,
  toggleActivityStatusRequest,
  updateRequest,
} from "../apis/activityAPI";
import { useWeekplan } from "../providers/WeekplanProvider";
import { Pictogram } from "./usePictogram";

/* It's highly recommended to read the docs at https://tanstack.com/query/latest
 * to understand how to use react-query. This hook utilises optimistic updates
 * and caching to provide a good user experience.
 */

export type ActivityDTO = Omit<FullActivityDTO, "citizenId">;
export type FullActivityDTO = {
  activityId: number;
  citizenId: number;
  date: string;
  endTime: string;
  startTime: string;
  isCompleted: boolean;
  pictogram?: Pictogram;
};

export const dateToQueryKey = (date: Date, isCitizen: boolean, id: number) => {
  if (!(date instanceof Date)) {
    throw new Error("Ugyldig dato");
  }
  return ["activity", isCitizen ? "citizen" : "grade", date.toISOString().split("T")[0], id];
};

/**
 * Hook to fetch activities for a specific date
 * @param date
 * @constructor
 * @return {useFetchActivities, useDeleteActivity, updateActivity, useToggleActivityStatus, useCreateActivity, copyActivities}
 * @return {invalidateQueries, data}
 * @return {useFetchActivity}
 */
export default function useActivity({ date }: { date: Date }) {
  const queryClient = useQueryClient();
  const { id, isCitizen } = useWeekplan();

  if (id === null) throw new Error("Bruger Id er null");

  const queryKey = dateToQueryKey(date, isCitizen, id);

  const useFetchActivities = useQuery<ActivityDTO[]>({
    queryFn: async () => (isCitizen ? fetchByDateCitizen(id, date) : fetchByDateGrade(id, date)),
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
    mutationFn: (variables: { id: number; data: ActivityDTO }) =>
      isCitizen
        ? createActivityCitizen(variables.data, variables.id)
        : createActivityGrade(variables.data, variables.id),

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
      isCitizen
        ? copyActivitiesCitizenRequest(
            id,
            variables.activityIds,
            variables.sourceDate,
            variables.destinationDate
          )
        : copyActivitiesGradeRequest(
            id,
            variables.activityIds,
            variables.sourceDate,
            variables.destinationDate
          ),
    onSuccess: (_data, variables) =>
      queryClient.invalidateQueries({ queryKey: dateToQueryKey(variables.destinationDate, isCitizen, id) }),
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
    useCreateActivity,
    copyActivities,
    useToggleActivityStatus,
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
