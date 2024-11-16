import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { colors, ScaleSizeH } from "../../utils/SharedStyles";

type FormContainerProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const FormContainer = ({ children, style }: FormContainerProps) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

export default FormContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: ScaleSizeH(10),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
});
