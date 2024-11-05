import * as ImagePicker from "expo-image-picker";

export const takePhoto = async () => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

  if (!permissionResult.granted) {
    alert("Camera access is required to take a photo!");
    return null;
  }
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    aspect: [4, 3],
    quality: 1,
  });

  return result && !result.canceled ? result.assets[0].uri : null;
};
