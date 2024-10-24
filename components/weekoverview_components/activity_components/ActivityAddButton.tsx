import { StyleSheet, View } from "react-native";
import { Pressable } from "expo-router/build/views/Pressable";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {colors} from "../../../utils/colors";
import {color} from "ansi-fragments";

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
        <Ionicons name={"calendar-outline"} size={30} />
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
    right: 24,
    position: "absolute",
  },
  text: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    padding: 10,
    color: colors.black,
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

export default ActivityAddButton;
