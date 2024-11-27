import { StyleProp, Text, TouchableOpacity, ViewStyle } from "react-native";
import { SharedStyles } from "../../utils/SharedStyles";

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
      style={[isValid ? SharedStyles.submitButton : SharedStyles.buttonDisabled, style]}
      disabled={!isValid || isSubmitting}
      onPress={handleSubmit}>
      <Text style={SharedStyles.buttonText}>{isSubmitting ? "..." : label}</Text>
    </TouchableOpacity>
  );
};

export default SubmitButton;
