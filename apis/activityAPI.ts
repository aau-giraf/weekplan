import { FullActivityDTO, ActivityDTO } from "../hooks/useActivity";
import formatQueryDate from "../utils/formatQueryDate";
import { axiosInstance } from "./axiosConfig";

export const fetchByDateCitizen = (id: number, date: Date) => {
  return axiosInstance
    .get(`/weekplan/${id}`, {
      params: { date: formatQueryDate(date) },
    })
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Kunne ikke hente aktiviteter.");
    });
};

export const fetchByDateGrade = (id: number, date: Date) => {
  return axiosInstance
    .get(`/weekplan/grade/${id}`, {
      params: { date: formatQueryDate(date) },
    })
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Kunne ikke hente aktiviteter.");
    });
};

export const fetchActivityRequest = (id: number) => {
  return axiosInstance
    .get(`/weekplan/activity/${id}`)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Kunne ikke hente aktivitet.");
    });
};

export const deleteRequest = (id: number) => {
  return axiosInstance
    .delete(`/weekplan/activity/${id}`)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Der er muligvis server problemer");
    });
};

export const updateRequest = (activity: FullActivityDTO, activityId: number) => {
  const { pictogram, ...deconstructedActivity } = activity;
  const data = {
    ...deconstructedActivity,
    pictogramId: pictogram?.id,
  };
  return axiosInstance
    .put(`/weekplan/activity/${activityId}`, data)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Kunne ikke opdatere aktivitet");
    });
};

export const toggleActivityStatusRequest = (id: number, isCompleted: boolean) => {
  return axiosInstance
    .put(`/weekplan/activity/${id}/iscomplete?IsComplete=${isCompleted}`)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Kunne ikke ændre aktivitet status");
    });
};

export const createActivityCitizen = (activity: ActivityDTO, citizenId: number) => {
  const { pictogram, ...deconstructedActivity } = activity;
  const dataWithOnlyPictogramId = {
    ...deconstructedActivity,
    pictogramId: pictogram?.id,
  };
  return axiosInstance
    .post(`/weekplan/to-citizen/${citizenId}`, dataWithOnlyPictogramId)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Kunne ikke oprette aktivitet");
    });
};

export const createActivityGrade = (activity: ActivityDTO, gradeId: number) => {
  const { pictogram, ...deconstructedActivity } = activity;
  const data = {
    ...deconstructedActivity,
    pictogramId: pictogram?.id,
  };
  return axiosInstance
    .post(`/weekplan/to-grade/${gradeId}`, data)
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Kunne ikke oprette aktivitet");
    });
};

export const copyActivitiesCitizenRequest = (
  citizenId: number,
  activityIds: number[],
  sourceDate: Date,
  destinationDate: Date
) => {
  return axiosInstance
    .post(`/weekplan/activity/copy-citizen/${citizenId}`, activityIds, {
      params: { dateStr: formatQueryDate(sourceDate), newDateStr: formatQueryDate(destinationDate) },
    })
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Kunne ikke kopiere aktiviteterne");
    });
};

export const copyActivitiesGradeRequest = (
  gradeId: number,
  activityIds: number[],
  sourceDate: Date,
  destinationDate: Date
) => {
  return axiosInstance
    .post(`/weekplan/activity/copy-grade/${gradeId}`, activityIds, {
      params: {
        dateStr: formatQueryDate(sourceDate),
        newDateStr: formatQueryDate(destinationDate),
      },
    })
    .then((res) => res.data)
    .catch(() => {
      throw new Error("Fejl: Kunne ikke kopiere aktiviteterne");
    });
};
