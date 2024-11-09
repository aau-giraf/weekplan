import { Platform } from "react-native";

/**
 * Function for sending a request to the Arasaac API to retrieve a Pictogram
 * @param id {number} - The ID of the pictogram to be fetched.
 */
export const fetchPictograms = async (id: number): Promise<string> => {
  const res = await fetch(`https://api.arasaac.org/v1/pictograms/${id}?color=true&download=false`);

  if (!res.ok) {
    throw new Error(`Fejl kunne ikke hente piktogramarne, status kode: ${res.status}`);
  }

  const contentType = res.headers.get("Content-Type");
  if (contentType?.includes("image/png") || contentType?.includes("image/jpeg")) {
    const imageBlob = await res.blob();

    if (Platform.OS === "ios") {
      return URL.createObjectURL(imageBlob);
    } else {
      const reader = new FileReader();
      return await new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data?.toString() ?? ""); // Return the Base64 string
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageBlob); // Read blob as Base64 string
      });
    }
  } else {
    throw new Error("Response er ikke et billede");
  }
};
