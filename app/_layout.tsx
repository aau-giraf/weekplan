import { Stack } from "expo-router";
import ProviderWrapper from "../providers/ProviderWrapper";

const RootLayout = () => {
  return (
    <ProviderWrapper>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="auth" />
      </Stack>
    </ProviderWrapper>
  );
};

export default RootLayout;
