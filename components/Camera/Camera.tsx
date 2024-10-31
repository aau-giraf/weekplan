import * as ImagePicker from 'expo-image-picker';

export const openCamera = async () => {
  // Request camera permissions
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

  // Check if permission is granted
  if (permissionResult.granted === false) {
    alert("Camera access is required to take a photo!");
    return null; // Explicitly return null if permission is denied
  }

  // Launch the camera to take a photo
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    aspect: [4, 3],
    quality: 1,
  });

  // Return the URI of the captured image or null if canceled
  return result && !result.canceled ? result.assets[0].uri : null; // Check if result is defined
};

