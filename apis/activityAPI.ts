import { ActivityDTO, FullActivityDTO } from '../DTO/activityDTO';
import formatQueryDate from '../utils/formatQueryDate';
import { BASE_URL } from '../utils/globals';

export const fetchRequest = async (id: number, date: Date) => {
  const params = new URLSearchParams();
  params.append('date', formatQueryDate(date));

  const res = await fetch(`${BASE_URL}/weekplan/${id}?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const body = await res.json();

  if (!res.ok) throw new Error('Fejl: Kunne ikke hente aktiviteter');
  return await res.json();
};

export const fetchActivityRequest = async (id: number) => {
  const res = await fetch(`${BASE_URL}/weekplan/activity/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) throw new Error('Fejl: Kunne ikke hente aktivitet');
  return await res.json();
};

export const deleteRequest = async (id: number) => {
  const res = await fetch(`${BASE_URL}/weekplan/activity/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Fejl: Kunne ikke slette aktivitet');
};

export const updateRequest = async (
  data: FullActivityDTO,
  activityId: number
) => {
  const res = await fetch(`${BASE_URL}/weekplan/activity/${activityId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Fejl: Kunne ikke opdatere aktivitet');
};

export const toggleActivityStatusRequest = async (
  id: number,
  isCompleted: boolean
) => {
  const res = await fetch(
    `${BASE_URL}/weekplan/activity/${id}/iscomplete?IsComplete=${isCompleted}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  if (!res.ok) throw new Error('Fejl: Kunne ikke ændre aktivitet status');
};

export const createActivityRequest = async (
  data: ActivityDTO,
  citizenId: number
) => {
  const res = await fetch(`${BASE_URL}/weekplan/${citizenId}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Fejl: Kunne ikke oprette aktivitet');
  return await res.json();
};

export const copyActivitiesRequest = async (
  citizenId: number,
  activityIds: number[],
  sourceDate: Date,
  destinationDate: Date
) => {
  const params = new URLSearchParams();
  params.append('citizenId', citizenId.toString());
  params.append('dateStr', formatQueryDate(sourceDate));
  params.append('newDateStr', formatQueryDate(destinationDate));
  const res = await fetch(
    `${BASE_URL}/weekplan/activity/copy?${params.toString()}`,
    {
      method: 'POST',
      body: JSON.stringify(activityIds),
      headers: { 'Content-Type': 'application/json' },
    }
  );
  if (!res.ok) throw new Error('Fejl: Kunne ikke kopier aktiviteter');
};
