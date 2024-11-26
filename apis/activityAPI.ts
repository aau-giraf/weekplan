import { FullActivityDTO, ActivityDTO } from "../hooks/useActivity";
import formatQueryDate from "../utils/formatQueryDate";
import { BASE_URL } from "../utils/globals";
import axios from "axios";

export const fetchByDateCitizen = async (id: number, date: Date) => {
  const params = { date: formatQueryDate(date) };

  try {
    const res = await axios.get(`${BASE_URL}/weekplan/${id}`, {
      params,
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke hente aktiviteter.";
  }
};

export const fetchByDateGrade = async (id: number, date: Date) => {
  const params = { date: formatQueryDate(date) };

  try {
    const res = await axios.get(`${BASE_URL}/weekplan/grade/${id}`, {
      params,
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke hente aktiviteter.";
  }
};

export const fetchActivityRequest = async (id: number) => {
  try {
    const res = await axios.get(`${BASE_URL}/weekplan/activity/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke hente aktivitet.";
  }
};

export const deleteRequest = async (id: number) => {
  try {
    const res = await axios.delete(`${BASE_URL}/weekplan/activity/${id}`);
    if (res.status === 500) return "Fejl: Der er muligvis server problemer";
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke slette aktivitet";
  }
};

export const updateRequest = async (data: FullActivityDTO, activityId: number) => {
  const { pictogram, ...rest } = data;
  const dataWithOnlyPictogramId = {
    ...rest,
    pictogramId: pictogram.id,
  };

  try {
    const res = await axios.put(`${BASE_URL}/weekplan/activity/${activityId}`, dataWithOnlyPictogramId, {
      headers: { "Content-Type": "application/json" },
    });
    if (res.status !== 200) return "Fejl: Kunne ikke opdatere aktivitet";
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke opdatere aktivitet";
  }
};

export const toggleActivityStatusRequest = async (id: number, isCompleted: boolean) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/weekplan/activity/${id}/iscomplete?IsComplete=${isCompleted}`,
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (res.status !== 200) return "Fejl: Kunne ikke ændre aktivitet status";
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke ændre aktivitet status";
  }
};

export const createActivityCitizen = async (data: ActivityDTO, citizenId: number) => {
  const { pictogram, ...rest } = data;
  const dataWithOnlyPictogramId = {
    ...rest,
    pictogramId: pictogram.id,
  };

  try {
    const res = await axios.post(`${BASE_URL}/weekplan/to-citizen/${citizenId}`, dataWithOnlyPictogramId, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke oprette aktivitet";
  }
};

export const createActivityGrade = async (data: ActivityDTO, gradeId: number) => {
  const { pictogram, ...rest } = data;
  const dataWithOnlyPictogramId = {
    ...rest,
    pictogramId: pictogram.id,
  };

  try {
    const res = await axios.post(`${BASE_URL}/weekplan/to-grade/${gradeId}`, dataWithOnlyPictogramId, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke oprette aktivitet";
  }
};

export const copyActivitiesRequest = async (
  citizenId: number,
  activityIds: number[],
  sourceDate: Date,
  destinationDate: Date
) => {
  const params = new URLSearchParams();
  params.append("citizenId", citizenId.toString());
  params.append("dateStr", formatQueryDate(sourceDate));
  params.append("newDateStr", formatQueryDate(destinationDate));

  try {
    const res = await axios.post(`${BASE_URL}/weekplan/activity/copy?${params.toString()}`, activityIds, {
      headers: { "Content-Type": "application/json" },
    });
    if (res.status !== 200) return "Fejl: Kunne ikke kopier aktiviteter";
  } catch (error: any) {
    return error.message || "Fejl: Kunne ikke kopiere aktiviteter";
  }
};
