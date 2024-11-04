import * as ImagePicker from 'expo-image-picker';

export const takePhoto = async () => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

  // Check if permission is granted
  if (permissionResult.granted === false) {
    alert("Camera access is required to take a photo!");
    return null;
  }

  // Launch the camera to take a photo
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    aspect: [4, 3],
    quality: 1,
  });

  return result && !result.canceled ? result.assets[0].uri : null;
};

