import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCitizenToGradeRequest,
  createNewGradeRequest,
  fetchCitizenById,
  fetchOrganisationFromGradeRequest,
  removeCitizenFromGradeRequest,
  updateGradeRequest,
} from "../apis/gradeAPI";
import { CitizenDTO, FullOrgDTO } from "./useOrganisation";

export type GradeDTO = {
  id: number;
  name: string;
  citizens: CitizenDTO[];
};

/**
 * Custom hook for managing grade-related data and operations.
 *
 * @param {number} gradeId - The ID of the grade to manage.
 * @returns {Object} Hook utilities.
 * @returns {Mutation} addCitizenToGrade - Mutation for adding citizens to the grade.
 * @returns {Mutation} removeCitizenFromGrade - Mutation for removing citizens from the grade.
 * @returns {Mutation} updateGrade - Mutation for updating the grade's name.
 * @returns {Function} createNewGradeRequest - Function for creating a new grade.
 * @returns {Object} data - The organisation data associated with the grade.
 * @returns {Object} error - Error object for the organisation query.
 * @returns {boolean} isLoading - Indicates whether the organisation query is loading.
 */
export default function useGrades(gradeId: number) {
  const queryClient = useQueryClient();
  const queryKey = [gradeId, "Grades"];

  /**
   * Query to fetch organisation data for a specific grade.
   */
  const fetchOrganisationWithGrade = useQuery<FullOrgDTO>({
    queryFn: async () => fetchOrganisationFromGradeRequest(gradeId),
    queryKey,
  });

  /**
   * Mutation to add citizens to a grade.
   *
   * @param {number[]} citizenIds - Array of citizen IDs to add to the grade.
   */
  const addCitizenToGrade = useMutation({
    mutationFn: (citizenIds: number[]) => addCitizenToGradeRequest(citizenIds, gradeId),
    onMutate: async (citizenIds: number[]) => {
      await queryClient.cancelQueries({ queryKey });

      const previousGrade = queryClient.getQueryData<FullOrgDTO>(queryKey);
      const citizens = await Promise.all(citizenIds.map((id) => fetchCitizenById(id)));

      queryClient.setQueryData<FullOrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            grades: oldData.grades.map((grade) => {
              if (grade.id === gradeId) {
                return {
                  ...grade,
                  citizens: [...grade.citizens, ...citizens],
                };
              }
              return grade;
            }),
          };
        }
        return previousGrade;
      });

      return { previousGrade };
    },
    onError: (_error, _citizenIds, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context.previousGrade);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  /**
   * Mutation to remove citizens from a grade.
   *
   * @param {number[]} citizenIds - Array of citizen IDs to remove from the grade.
   */
  const removeCitizenFromGrade = useMutation({
    mutationFn: async (citizenIds: number[]) => removeCitizenFromGradeRequest(citizenIds, gradeId),
    onMutate: async (citizenIds: number[]) => {
      await queryClient.cancelQueries({ queryKey });

      const previousOrg = queryClient.getQueryData<FullOrgDTO>(queryKey);

      queryClient.setQueryData<FullOrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            grades: oldData.grades.map((grade) => {
              if (grade.id === gradeId) {
                return {
                  ...grade,
                  citizens: grade.citizens.filter((citizen) => !citizenIds.includes(citizen.id)),
                };
              }
              return grade;
            }),
          };
        }
        return previousOrg;
      });

      return { previousOrg };
    },
    onError: (_error, _citizenIds, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context.previousOrg);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  /**
   * Mutation to update the name of a grade.
   *
   * @param {string} gradeName - The new name for the grade.
   */
  const updateGrade = useMutation({
    mutationFn: (gradeName: string) => updateGradeRequest(gradeId, gradeName),
    onMutate: async (gradeName: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previousOrg = queryClient.getQueryData<FullOrgDTO>(queryKey);

      queryClient.setQueryData<FullOrgDTO>(queryKey, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            grades: oldData.grades.map((grade) => {
              if (grade.id === gradeId) {
                return {
                  ...grade,
                  name: gradeName,
                };
              }
              return grade;
            }),
          };
        }
        return previousOrg;
      });

      return { previousOrg };
    },
    onError: (_error, _gradeName, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context.previousOrg);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    addCitizenToGrade,
    removeCitizenFromGrade,
    updateGrade,
    createNewGradeRequest: createNewGradeRequest,
    data: fetchOrganisationWithGrade.data,
    error: fetchOrganisationWithGrade.error,
    isLoading: fetchOrganisationWithGrade.isLoading,
  };
}
