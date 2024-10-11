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

  if (!res.ok) throw new Error('Failed to fetch activities');
  return await res.json();
};

export const deleteRequest = async (id: number) => {
  const res = await fetch(`${BASE_URL}/weekplan/activity/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete activity');
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
  if (!res.ok) throw new Error('Failed to update activity');
};

export const toggleActivityStatusRequest = async (id: number) => {
  const res = await fetch(`https://example.com/api/activity/${id}/status`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to toggle activity status');
  return await res.json();
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
  if (!res.ok) throw new Error('Failed to create activity');
  return await res.json();
};
