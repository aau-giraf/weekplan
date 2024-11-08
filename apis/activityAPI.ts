import { ActivityDTO, FullActivityDTO } from "../DTO/activityDTO";
import formatQueryDate from "../utils/formatQueryDate";
import { BASE_URL } from "../utils/globals";

/**
 * Function for fetching activities from the relevant API Endpoint.
 * @param id {number} - ID of the citizen
 * @param date {Date} - The date for which the activities will be fetched
 */
export const fetchByDateRequest = async (id: number, date: Date) => {
  const params = new URLSearchParams();
  params.append("date", formatQueryDate(date));

  const res = await fetch(`${BASE_URL}/weekplan/${id}?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Fejl: Kunne ikke hente aktiviteter");
  return await res.json();
};

/**
 * Function for fetching a single activity from the relevant API endpoint.
 * @param id {number} - ID of the activity in question
 */
export const fetchActivityRequest = async (id: number) => {
  const res = await fetch(`${BASE_URL}/weekplan/activity/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Fejl: Kunne ikke hente aktivitet");
  return await res.json();
};

/**
 * Function for sending a request to the API endpoint to delete an activity.
 * @param id {number} - The ID of the Activity to be deleted
 */
export const deleteRequest = async (id: number) => {
  const res = await fetch(`${BASE_URL}/weekplan/activity/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Fejl: Kunne ikke slette aktivitet");
};

/**
 * Function for sending a request to the API endpoint to updating an activity.
 * @param data {FullActivityDTO} - The updated data for the activity
 * @param activityId {number} - The ID of the activity to be updated
 */
export const updateRequest = async (data: FullActivityDTO, activityId: number) => {
  const res = await fetch(`${BASE_URL}/weekplan/activity/${activityId}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Fejl: Kunne ikke opdatere aktivitet");
};

/**
 * Function for sending a request to the relevant API endpoint to update the status of an activity.
 * @param id {number} - ID of the activity
 * @param isCompleted {boolean} - Whether to mark it as completed or unfinished
 */
export const toggleActivityStatusRequest = async (id: number, isCompleted: boolean) => {
  const res = await fetch(`${BASE_URL}/weekplan/activity/${id}/iscomplete?IsComplete=${isCompleted}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Fejl: Kunne ikke ændre aktivitet status");
};

/**
 * Function for sending a request to the relevant API endpoint to create an activity.
 * @param data {ActivityDTO} - Data for the Activity to be created
 * @param citizenId {number} - ID for the associated citizen
 */
export const createActivityRequest = async (data: ActivityDTO, citizenId: number) => {
  const res = await fetch(`${BASE_URL}/weekplan/${citizenId}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Fejl: Kunne ikke oprette aktivitet");
  return await res.json();
};

/**
 * Function for sending a request to the relevant API endpoint to copy a set of Activities to another day
 * @param citizenId {number} - ID of the citizen.
 * @param activityIds {number[]} - An array of ID of the activities to be copied
 * @param sourceDate {Date} - The date on which the activities lie
 * @param destinationDate {Date} -  The date to which these activities should be copied
 */
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
  const res = await fetch(`${BASE_URL}/weekplan/activity/copy?${params.toString()}`, {
    method: "POST",
    body: JSON.stringify(activityIds),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Fejl: Kunne ikke kopier aktiviteter");
};
