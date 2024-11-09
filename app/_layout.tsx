import { Stack } from "expo-router";
import ProviderWrapper from "../providers/ProviderWrapper";
import { SafeAreaView } from "react-native";
import { colors, ScaleSize } from "../utils/SharedStyles";

const RootLayout = () => {
  return (
    <ProviderWrapper>
      <SafeAreaView style={{ backgroundColor: colors.white, padding: ScaleSize(10) }} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="auth" />
      </Stack>
    </ProviderWrapper>
  );
};

export default RootLayout;
