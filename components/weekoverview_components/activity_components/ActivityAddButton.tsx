import { View, StyleSheet } from "react-native";
import { Pressable } from "expo-router/build/views/Pressable";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  colors,
  ScaleSize,
  ScaleSizeH,
  ScaleSizeW,
} from "../../../utils/SharedStyles";

/**
 * ActivityAddButton component renders a button that navigates to the add activity screen.
 * @component
 */
const ActivityAddButton = () => {
  const handlePress = () => {
    router.push("/addactivity");
  };

  return (
    <Pressable style={styles.button} onPress={handlePress}>
      <View>
        <Ionicons name={"calendar-outline"} size={ScaleSize(50)} />
        <Ionicons
          name={"add-outline"}
          size={ScaleSize(35)}
          style={styles.addIcon}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: ScaleSizeW(100),
    height: ScaleSizeH(100),
    backgroundColor: colors.lightGreen,
    borderRadius: ScaleSize(100),
    bottom: ScaleSize(20),
    right: ScaleSize(24),
    position: "absolute",
  },
  text: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: ScaleSize(30),
    padding: ScaleSize(10),
    color: colors.black,
  },
  addIcon: {
    bottom: ScaleSize(-9.8),
    right: ScaleSize(-9.8),
    position: "absolute",
    backgroundColor: colors.lightGreen,
    borderRadius: ScaleSize(20),
    overflow: "hidden",
  },
});

export default ActivityAddButton;
