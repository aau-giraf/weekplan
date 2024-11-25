import { StyleProp, Text, TouchableOpacity, ViewStyle } from "react-native";
import { colors, SharedStyles } from "../../utils/SharedStyles";

type SecondaryButtonProps = {
  onPress: () => void;
  label: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  testID?: string;
};

const SecondaryButton = ({ onPress, label, style, disabled, testID }: SecondaryButtonProps) => {
  return (
    <TouchableOpacity
      style={[SharedStyles.buttonValid, style, disabled ? { backgroundColor: colors.gray } : null]}
      disabled={disabled}
      onPress={onPress}
      testID={testID}>
      <Text style={SharedStyles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default SecondaryButton;
