/**
 * Function for sending a request to the Arasaac API to retrieve a Pictogram
 * @param id {number} - The ID of the pictogram to be fetched.
 */
export const fetchPictograms = async (id: number) => {
  const res = await fetch(
    `https://api.arasaac.org/v1/pictograms/${id}?color=true&download=false`,
  );

  if (!res.ok)
    throw new Error(
      `Fejl kunne ikke hente piktogramarne, status kode: ${res.status}`,
    );

  const contentType = res.headers.get("Content-Type");
  if (
    contentType?.includes("image/png") ||
    contentType?.includes("image/jpeg")
  ) {
    const imageBlob = await res.blob();
    return URL.createObjectURL(imageBlob);
  } else {
    throw new Error("Response er ikke et billede");
  }
};
