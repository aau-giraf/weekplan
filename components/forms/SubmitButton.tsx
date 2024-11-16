import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW } from "../../utils/SharedStyles";

type SubmitButtonProps = {
  isValid: boolean;
  isSubmitting: boolean;
  handleSubmit: () => void;
  label: string;
  style?: StyleProp<ViewStyle>;
};

const SubmitButton = ({ isValid, isSubmitting, handleSubmit, label, style }: SubmitButtonProps) => {
  return (
    <TouchableOpacity
      style={[isValid ? styles.buttonValid : styles.buttonDisabled, style]}
      disabled={!isValid || isSubmitting}
      onPress={handleSubmit}>
      <Text style={styles.buttonText}>{isSubmitting ? "..." : label}</Text>
    </TouchableOpacity>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({
  buttonValid: {
    paddingVertical: ScaleSizeW(18),
    paddingHorizontal: ScaleSizeH(20),
    borderRadius: 8,
    marginTop: ScaleSize(20),
    alignItems: "center",
    backgroundColor: colors.green,
    width: "100%",
  },
  buttonDisabled: {
    paddingVertical: ScaleSizeW(18),
    paddingHorizontal: ScaleSizeH(20),
    borderRadius: 8,
    marginTop: ScaleSize(20),
    alignItems: "center",
    backgroundColor: colors.gray,
    width: "100%",
  },
  buttonText: {
    color: colors.white,
    fontSize: ScaleSize(22),
    fontWeight: "500",
  },
});
