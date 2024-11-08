import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { colors } from "../../utils/SharedStyles";

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
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
});
