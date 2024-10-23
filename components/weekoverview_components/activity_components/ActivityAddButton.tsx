import { StyleSheet, View } from "react-native";
import { Pressable } from "expo-router/build/views/Pressable";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { rem, colors, SharedStyles } from "../../../utils/SharedStyles";

/**
 * ActivityAddButton component renders a button that navigates to the add activity screen.
 * @component
 */
const ActivityAddButton = () => {
  const handlePress = () => {
    router.push("./addactivity");
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
    ...SharedStyles.trueCenter,
    width: 60,
    height: 60,
    borderRadius: 30,
    bottom: 20,
    right: 24,
    position: "absolute",
    backgroundColor: colors.gray,
  },
  text: {
    ...SharedStyles.trueCenter,
    fontSize: rem(2),
    padding: 10,
    color: colors.black,
  },
  addIcon: {
    bottom: -9.8,
    right: -9.8,
    position: "absolute",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors.gray,
  },
});

export default ActivityAddButton;
