import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { colors, ScaleSize, ScaleSizeH } from "../../utils/SharedStyles";

type FormHeaderProps = {
  title: string;
  style?: StyleProp<TextStyle>;
};
const FormHeader = ({ title, style }: FormHeaderProps) => {
  return <Text style={[style, styles.headerText]}>{title}</Text>;
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: ScaleSize(48),
    fontWeight: "600",
    marginBottom: ScaleSizeH(20),
    textAlign: "center",
    color: colors.black,
  },
});

export default FormHeader;
