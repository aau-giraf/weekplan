import { TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  colors,
  ScaleSizeW,
  ScaleSize,
  ScaleSizeH,
} from "../../utils/SharedStyles";

type SubmitButtonProps = {
  isValid: boolean;
  isSubmitting: boolean;
  handleSubmit: () => void;
};

const SubmitButton = ({
  isValid,
  isSubmitting,
  handleSubmit,
}: SubmitButtonProps) => {
  return (
    <TouchableOpacity
      style={isValid ? styles.buttonValid : styles.buttonDisabled}
      disabled={!isValid || isSubmitting}
      onPress={handleSubmit}>
      <Text style={styles.buttonText}>
        {isSubmitting ? "..." : "Opdater Profil"}
      </Text>
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
