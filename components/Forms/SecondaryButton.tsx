import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors, ScaleSizeW, ScaleSize, ScaleSizeH } from "../../utils/SharedStyles";

type SecondaryButtonProps = {
  onPress: () => void;
  label: string;
  style?: StyleProp<ViewStyle>;
};

const SecondaryButton = ({ onPress, label, style }: SecondaryButtonProps) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default SecondaryButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: ScaleSizeW(18),
    paddingHorizontal: ScaleSizeH(20),
    borderRadius: 8,
    marginTop: ScaleSize(20),
    alignItems: "center",
    backgroundColor: colors.blue,
    width: "100%",
  },
  buttonText: {
    color: colors.white,
    fontSize: ScaleSize(22),
    fontWeight: "500",
  },
});
