import * as ImagePicker from "expo-image-picker";

/**The result object contains information about the selected image, such as the URI of the image file.
 * If the user cancels the image selection, the result object will have the canceled property set to true.
 * @return {Promise<string>} - The URI of the selected image file
 *
 */
const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
};

export default pickImage;
