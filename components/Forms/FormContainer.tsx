import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { colors, ScaleSizeW } from "../../utils/SharedStyles";

type FormContainerProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const FormContainer = ({ children, style }: FormContainerProps) => {
  return <View style={[style, styles.container]}>{children}</View>;
};

export default FormContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.white,
    paddingHorizontal: ScaleSizeW(20),
  },
});
