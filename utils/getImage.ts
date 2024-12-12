import * as ImagePicker from "expo-image-picker";

type getImageProps = "camera" | "photoAlbum";

export const getImage = async (imageSelector: getImageProps) => {
  let permissionResult =
    imageSelector === "camera"
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted && imageSelector === "camera") {
    alert("Kamera har brug for adgang til at kunne tage et billede!");
    return null;
  }

  if (!permissionResult.granted && imageSelector === "photoAlbum") {
    alert("Adgang til fotoalbum er påkrævet for at vælge et billede!");
    return null;
  }

  const options = {
    mediaType: ["images"],
    allowsEditing: true,
    aspect: [1, 1] as [number, number],
  };

  const result =
    imageSelector === "camera"
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

  if (result === null || result.canceled) {
    return null;
  }

  return result;
};
