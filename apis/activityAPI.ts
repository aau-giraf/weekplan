import { FullActivityDTO, ActivityDTO } from "../hooks/useActivity";
import formatQueryDate from "../utils/formatQueryDate";
import { BASE_URL } from "../utils/globals";
import axios from "axios";

export const fetchByDateCitizen = async (id: number, date: Date) => {
  const params = { date: formatQueryDate(date) };
  const res = await axios
    .get(`${BASE_URL}/weekplan/${id}`, {
      params,
      headers: { "Content-Type": "application/json" },
    })
    .catch((error) => {
      if (error.response) {
        throw new Error("Fejl: Kunne ikke hente aktiviteter.");
      }
    });

  if (!res) {
    throw new Error("Fejl: Kunne ikke hente aktiviteter.");
  }
  return res.data;
};

export const fetchByDateGrade = async (id: number, date: Date) => {
  const params = { date: formatQueryDate(date) };
  const res = await axios
    .get(`${BASE_URL}/weekplan/grade/${id}`, {
      params,
      headers: { "Content-Type": "application/json" },
    })
    .catch((error) => {
      if (error.response) {
        throw new Error("Fejl: Kunne ikke hente aktiviteter.");
      }
    });

  if (!res) {
    throw new Error("Fejl: Kunne ikke hente aktiviteter.");
  }
  return res.data;
};

export const fetchActivityRequest = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/weekplan/activity/${id}`).catch((error) => {
    if (error.response) {
      throw new Error("Fejl: Kunne ikke hente aktivitet.");
    }
  });

  if (!res) {
    throw new Error("Fejl: Kunne ikke hente aktivitet.");
  }
  return res.data;
};

export const deleteRequest = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/weekplan/activity/${id}`).catch((error) => {
    if (error.response) {
      throw new Error("Fejl: Der er muligvis server problemer");
    }
  });

  if (!res) {
    throw new Error("Fejl: Kunne ikke slette aktivitet");
  }
};

export const updateRequest = async (data: FullActivityDTO, activityId: number) => {
  const { pictogram, ...rest } = data;
  const dataWithOnlyPictogramId = {
    ...rest,
    pictogramId: pictogram.id,
  };
  const res = await axios
    .put(`${BASE_URL}/weekplan/activity/${activityId}`, dataWithOnlyPictogramId)
    .catch((error) => {
      if (error.response) {
        throw new Error("Fejl: Kunne ikke opdatere aktivitet");
      }
    });

  if (!res) {
    throw new Error("Fejl: Kunne ikke opdatere aktivitet");
  }
};

export const toggleActivityStatusRequest = async (id: number, isCompleted: boolean) => {
  const res = await axios
    .put(`${BASE_URL}/weekplan/activity/${id}/iscomplete?IsComplete=${isCompleted}`, {})
    .catch((error) => {
      if (error.response) {
        throw new Error("Fejl: Kunne ikke ændre aktivitet status");
      }
    });

  if (!res) {
    throw new Error("Fejl: Kunne ikke ændre aktivitet status");
  }
};

export const createActivityCitizen = async (data: ActivityDTO, citizenId: number) => {
  const { pictogram, ...rest } = data;
  const dataWithOnlyPictogramId = {
    ...rest,
    pictogramId: pictogram.id,
  };
  const res = await axios
    .post(`${BASE_URL}/weekplan/to-citizen/${citizenId}`, dataWithOnlyPictogramId)
    .catch((error) => {
      if (error.response) {
        throw new Error("Fejl: Kunne ikke oprette aktivitet");
      }
    });

  if (!res) {
    throw new Error("Fejl: Kunne ikke oprette aktivitet");
  }
  return res.data;
};

export const createActivityGrade = async (data: ActivityDTO, gradeId: number) => {
  const { pictogram, ...rest } = data;
  const dataWithOnlyPictogramId = {
    ...rest,
    pictogramId: pictogram.id,
  };
  const res = await axios
    .post(`${BASE_URL}/weekplan/to-grade/${gradeId}`, dataWithOnlyPictogramId)
    .catch((error) => {
      if (error.response) {
        throw new Error("Fejl: Kunne ikke oprette aktivitet");
      }
    });

  if (!res) {
    throw new Error("Fejl: Kunne ikke oprette aktivitet");
  }
  return res.data;
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

  const res = await axios
    .post(`${BASE_URL}/weekplan/activity/copy?${params.toString()}`, activityIds)
    .catch((error) => {
      if (error.response) {
        throw new Error("Fejl: Kunne ikke kopiere aktiviteter");
      }
    });

  if (!res) {
    throw new Error("Fejl: Kunne ikke kopiere aktiviteter");
  }
};
