import { Stack } from "expo-router";
import ProviderWrapper from "../../../../providers/ProviderWrapper";
import { SafeAreaView } from "react-native";
import { colors, ScaleSize } from "../../../../utils/SharedStyles";
import AuthenticationProvider from "../../../../providers/AuthenticationProvider";

const OrganisationRootLayout = () => {
  return (
    <ProviderWrapper>
      <AuthenticationProvider>
        <SafeAreaView
          style={{ backgroundColor: colors.white, padding: ScaleSize(10) }}
        />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="[index]" />
          <Stack.Screen name="addactivity" />
          <Stack.Screen name="addcitizen" />
          <Stack.Screen name="editactivity" />
          <Stack.Screen name="weekplanscreen" />
        </Stack>
      </AuthenticationProvider>
    </ProviderWrapper>
  );
};

export default OrganisationRootLayout;
