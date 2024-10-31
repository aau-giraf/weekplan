// ActivityAiButton.js
import React from "react";
import { StyleSheet, View } from "react-native";
import { Pressable } from "expo-router/build/views/Pressable";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../utils/colors";
import { openCamera } from "../components/Camera/Camera";


/**
 * ActivityAiButton component renders a button that opens the camera.
 * @component
 */
const ActivityAiButton = () => {
  const handlePress = async () => {
    const imageUri = await openCamera();

    // Optionally handle the image URI here
    if (imageUri) {
      console.log(imageUri);
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
    left: 24,
    position: "absolute",
    zIndex: 999,
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
