import { Stack } from "expo-router";
import ProviderWrapper from "../providers/ProviderWrapper";
import { SafeAreaView } from "react-native";
import { colors, ScaleSize } from "../utils/SharedStyles";

const RootLayout = () => {
  return (
    <ProviderWrapper>
      <SafeAreaView
        style={{ backgroundColor: colors.white, padding: ScaleSize(10) }}
      />
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="weekplanscreen" />
        <Stack.Screen name="addactivity" />
        <Stack.Screen name="editactivity" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name ="viewinvitation" />
      </Stack>
    </ProviderWrapper>
  );
};

export default RootLayout;
