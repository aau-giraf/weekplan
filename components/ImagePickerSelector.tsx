import { useState } from "react";
import { Button, Image, View } from "react-native";
import { StyleSheet } from "react-native-size-scaling";
import pickImage from "../utils/pickImage";
import { SharedStyles } from "../utils/SharedStyles";

/**
 * ImagePickerSelector component allows users to pick an image from their library.
 * It displays a button to trigger the image picker and shows the selected image.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const ImagePickerSelector = () => {
  const [image, setImage] = useState<string | null>(null);

  const handlePickImage = async () => {
    const result = await pickImage();
    if (result) {
      setImage(result);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Vælg et billede fra dit bibliotek"
        onPress={handlePickImage}
      />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...SharedStyles.trueCenter,
    flex: 1,
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default ImagePickerSelector;
