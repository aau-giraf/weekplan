import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, ScaleSizeW } from "../utils/SharedStyles";

type CheckBoxProps = {
  onChange: () => void;
  checked: boolean;
};

const CheckBox = ({ onChange, checked }: CheckBoxProps) => {
  return (
    <Pressable
      role="checkbox"
      aria-checked={checked}
      style={[styles.checkboxBase, checked && styles.checkboxChecked]}
      onPress={onChange}>
      {checked && (
        <Ionicons name="checkmark" size={ScaleSizeW(50)} color="white" />
      )}
    </Pressable>
  );
};

export default CheckBox;
const styles = StyleSheet.create({
  checkboxBase: {
    width: ScaleSizeW(50),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: colors.blue,
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: colors.blue,
  },
});
