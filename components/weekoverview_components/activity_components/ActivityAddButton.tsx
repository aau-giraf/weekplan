import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, ScaleSize } from "../../../utils/SharedStyles";
import IconButton from "../../IconButton";

/**
 * ActivityAddButton component renders a button that navigates to the add activity screen.
 * @component
 */
const ActivityAddButton = () => {
  const handlePress = () => {
    router.push("/addactivity");
  };

  return (
    <IconButton onPress={handlePress} style={styles.button}>
      <Ionicons name={"calendar-outline"} size={ScaleSize(64)} />
      <Ionicons name={"add-outline"} size={ScaleSize(36)} style={styles.addIcon} />
    </IconButton>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightGreen,
    bottom: ScaleSize(20),
    right: ScaleSize(24),
    position: "absolute",
  },
  addIcon: {
    bottom: ScaleSize(-9.8),
    right: ScaleSize(-9.8),
    position: "absolute",
    backgroundColor: colors.lightGreen,
    borderRadius: 20,
    overflow: "hidden",
  },
});

export default ActivityAddButton;
