import { StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInUp,
  FadeOutRight,
  LinearTransition,
} from "react-native-reanimated";
import { rem, colors, SharedStyles } from "../utils/SharedStyles";

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
      style={[styles.toastContainer, { backgroundColor: color }]}
    >
      <Ionicons size={rem(2)} name={icon} style={styles.icon} />
      <Text style={styles.toastMessage && SharedStyles.flexRow}>{message}</Text>
      <Ionicons
        size={rem(2)}
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
    backgroundColor: colors.white,
    borderRadius: 5,
    shadowColor: colors.black,
    shadowOpacity: 0.3,
  },
  toastMessage: {
    color: colors.white,
    fontSize: rem(1),
    flex: 1,
    textAlign: "center",
    textShadowColor: colors.black,

    marginHorizontal: 20,
  },
  icon: {
    color: colors.white,
    fontWeight: "bold",
  },
});
export default Toast;
