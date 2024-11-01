import { Text } from "react-native";
import { StyleSheet } from "react-native-size-scaling";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInUp,
  FadeOutRight,
  LinearTransition,
} from "react-native-reanimated";
import { colors, SharedStyles } from "../utils/SharedStyles";

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
    color: colors.crimson,
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
      style={[styles.toastContainer, { backgroundColor: color }]}>
      <Ionicons size={36} name={icon} style={styles.icon} />
      <Text style={styles.toastMessage}>{message}</Text>
      <Ionicons
        size={36}
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
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 5,
    shadowOpacity: 0.3,
    backgroundColor: colors.white,
    shadowColor: colors.black,
  },
  toastMessage: {
    ...SharedStyles.flexRow,
    fontSize: 18,
    flex: 1,
    textAlign: "center",
    color: colors.white,
    textShadowColor: colors.black,

    marginHorizontal: 20,
  },
  icon: {
    fontWeight: "bold",
    color: colors.white,
  },
});
export default Toast;
