
export const fetchRequest = async (id: number, date: string) => {
  // Format the date as needed
  const formattedDate = date.replace(/-/g, '/');
  const encodedDate = encodeURIComponent(formattedDate);

  const res = await fetch(`http://localhost:5171/weekplan/${id}?date=${encodedDate}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) throw new Error('Failed to fetch activities');
  return await res.json();
};

export const deleteRequest = async (id: number) => {
  const res = await fetch(`https://example.com/api/activity/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete activity");
  return await res.json();
};

export const updateRequest = async ({
  data,
  id,
}: {
  data: unknown;
  id: number;
}) => {
  const res = await fetch(`https://example.com/api/activity/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to update activity");
  return await res.json();
};

export const toggleActivityStatusRequest = async (id: number) => {
  const res = await fetch(`https://example.com/api/activity/${id}/status`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to toggle activity status");
  return await res.json();
};

export const createActivityRequest = async (data: unknown) => {
  const res = await fetch(`https://example.com/api/activity`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to create activity");
  return await res.json();
};

