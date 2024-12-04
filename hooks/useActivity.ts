import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  copyActivitiesRequest,
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

/**
 * Represents an activity data transfer object without citizen-specific details.
 */
export type ActivityDTO = Omit<FullActivityDTO, "citizenId">;

/**
 * Represents the full details of an activity.
 */
export type FullActivityDTO = {
  activityId: number;
  citizenId: number;
  date: string;
  description: string;
  endTime: string;
  name: string;
  startTime: string;
  isCompleted: boolean;
  pictogram: Pictogram;
};

/**
 * Constructs a query key for fetching activities based on a date, ID type (citizen/grade), and ID.
 * @param {Date} date - The date to fetch activities for.
 * @param {boolean} isCitizen - Whether the ID belongs to a citizen.
 * @param {number} id - The ID of the citizen or grade.
 * @returns {Array} The query key as an array of strings and numbers.
 * @throws {Error} If the date is not a valid Date object.
 */
export const dateToQueryKey = (date: Date, isCitizen: boolean, id: number) => {
  if (!(date instanceof Date)) {
    throw new Error("Ugyldig dato");
  }
  return ["activity", isCitizen ? "citizen" : "grade", date.toISOString().split("T")[0], id];
};

/**
 * Custom hook to manage activities for a given date. Includes functionalities to fetch, update, create,
 * delete, copy, and toggle the status of activities.
 * @param {Object} params - Hook parameters.
 * @param {Date} params.date - The date for which to fetch activities.
 * @returns {Object} A set of utilities for managing activities, including fetching, creating, deleting,
 * copying, and toggling activity status.
 * @throws {Error} If the user ID (`id`) is null.
 */
export default function useActivity({ date }: { date: Date }) {
  const queryClient = useQueryClient();
  const { id, isCitizen } = useWeekplan();

  if (id === null) throw new Error("Bruger Id er null");

  const queryKey = dateToQueryKey(date, isCitizen, id);

  /**
   * Fetches a list of activities for the specified date and user type (citizen/grade).
   */
  const useFetchActivities = useQuery<ActivityDTO[]>({
    queryFn: async () => (isCitizen ? fetchByDateCitizen(id, date) : fetchByDateGrade(id, date)),
    queryKey: queryKey,
  });

  /**
   * Deletes an activity and updates the query cache optimistically.
   */
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

  /**
   * Updates an activity and optimistically modifies the cache. Handles scenarios where the activity date changes.
   */
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

  /**
   * Creates a new activity and optimistically adds it to the cache.
   */
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

  /**
   * Copies activities from one date to another and invalidates the cache for the target date.
   */
  const copyActivities = useMutation({
    mutationFn: (variables: { activityIds: number[]; sourceDate: Date; destinationDate: Date }) =>
      copyActivitiesRequest(id, variables.activityIds, variables.sourceDate, variables.destinationDate),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  /**
   * Toggles the completion status of an activity and updates the cache optimistically.
   */
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

/**
 * Custom hook to fetch a single activity by ID.
 * @param {number} activityId - The ID of the activity to fetch.
 * @returns {Object} Query object for fetching the single activity.
 */
export function useSingleActivity({ activityId }: { activityId: number }) {
  const useFetchActivity = useQuery<ActivityDTO>({
    queryFn: () => fetchActivityRequest(activityId),
    queryKey: ["activity", activityId],
  });

  return {
    useFetchActivity,
  };
}
