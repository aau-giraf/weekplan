import { StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInUp,
  FadeOutRight,
  LinearTransition,
} from "react-native-reanimated";
import { colors } from "../utils/colors";

type ToastNotification = "success" | "error" | "warning";
type ToastStyle = {
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const toastMap: Record<ToastNotification, ToastStyle> = {
  success: {
    icon: "checkmark-circle",
    color: colors.green,
  },
  error: {
    icon: "alert-circle",
    color: colors.red,
  },
  warning: {
    icon: "alert-circle",
    color: colors.orange,
  },
};

export type ToastProps = {
  id: number;
  message: string;
  type: ToastNotification;
  onClose: (id: number) => void;
};

const Toast = ({ message, type, id, onClose }: ToastProps) => {
  const { icon, color } = toastMap[type];

  return (
    <Animated.View
      key={id}
      layout={LinearTransition}
      entering={FadeInUp}
      exiting={FadeOutRight}
      style={[styles.toastContainer, { backgroundColor: color }]}
    >
      <Ionicons size={35} name={icon} style={styles.icon} />
      <Text style={styles.toastMessage}>{message}</Text>
      <Ionicons
        size={35}
        name={"close-outline"}
        style={styles.icon}
        onPress={() => onClose(id)}
        testID="close-toast"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.3,
  },
  toastMessage: {
    color: "white",
    fontSize: 18,
    flex: 1,
    textAlign: "center",
    textShadowColor: "black",

    marginHorizontal: 20,
  },
  icon: {
    color: "white",
    fontWeight: "bold",
  },
});
export default Toast;
