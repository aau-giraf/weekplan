import { router } from "expo-router";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Fragment } from "react";
import { colors } from "../utils/SharedStyles";

type SafeAreaProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const SafeArea = ({ children, style }: SafeAreaProps) => {
  if (router.canGoBack() && children) {
    console.log("1");
    return (
      <SafeAreaView style={[styles.safeArea, style]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={30} style={{ alignSelf: "center" }} />
        </Pressable>
        {children}
      </SafeAreaView>
    );
  }

  if (children) {
    console.log("2");
    return <SafeAreaView style={[styles.safeArea, style]}>{children}</SafeAreaView>;
  }

  if (router.canGoBack() && !children) {
    console.log("3");
    return (
      <Fragment>
        <SafeAreaView style={[{ backgroundColor: colors.white }, style]} />
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={30} style={{ alignSelf: "center" }} />
        </Pressable>
      </Fragment>
    );
  }

  console.log("4");
  return <SafeAreaView style={style} />;
};

export default SafeArea;

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 5,
    zIndex: 2,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});
