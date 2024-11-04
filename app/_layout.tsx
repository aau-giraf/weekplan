import { Stack } from "expo-router";
import ProviderWrapper from "../providers/ProviderWrapper";
import { SafeAreaView } from "react-native";
import { colors } from "../utils/SharedStyles";

const RootLayout = () => {
  return (
    <ProviderWrapper>
      <SafeAreaView style={{ backgroundColor: colors.white }} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="weekplanscreen" />
        <Stack.Screen name="viewactivity" />
        <Stack.Screen name="addactivity" />
        <Stack.Screen name="editactivity" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </ProviderWrapper>
  );
};

export default RootLayout;
