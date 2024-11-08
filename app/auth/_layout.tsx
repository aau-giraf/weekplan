import { Stack } from "expo-router";
import ProviderWrapper from "../../providers/ProviderWrapper";
import { SafeAreaView } from "react-native";
import { colors, ScaleSize } from "../../utils/SharedStyles";

const AuthRootLayout = () => {
  return (
    <ProviderWrapper>
      <SafeAreaView
        style={{ backgroundColor: colors.white, padding: ScaleSize(10) }}
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="profile/settings" />
        <Stack.Screen name="profile/viewinvitation" />
        <Stack.Screen name="profile/organisation" />
      </Stack>
    </ProviderWrapper>
  );
};

export default AuthRootLayout;
