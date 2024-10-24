import React from "react";
import { StyleSheet, View } from "react-native";
import { Pressable } from "expo-router/build/views/Pressable";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../utils/colors";
import * as ImagePicker from 'expo-image-picker';

/**
 * ActivityAiButton component renders a button that opens the camera.
 * @component
 */
const ActivityAiButton = () => {
  const handlePress = async () => {
    // Request camera permissions
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Camera access is required to take a photo!");
      return;
    }

    // Launch the camera to take a photo
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // Editing of photo, being able to crop, currently unnecessary
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    // Optionally handle the result
    if (!result.canceled) {
      console.log(result.assets[0].uri);
    }
  };

  return (
    <Pressable style={styles.button} onPress={handlePress}>
      <View>
        <Ionicons name={"camera-outline"} size={30} />
        <Ionicons name={"add-outline"} size={25} style={styles.addIcon} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    backgroundColor: colors.gray,
    borderRadius: 30,
    bottom: 20,
    left: 24,  // Positioned at the bottom-left
    position: "absolute",
    zIndex: 999, // Ensure it stays on top of other components
  },
  addIcon: {
    bottom: -9.8,
    right: -9.8,
    position: "absolute",
    backgroundColor: colors.gray,
    borderRadius: 20,
    overflow: "hidden",
  },
});

export default ActivityAiButton;
