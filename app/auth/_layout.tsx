import { Stack } from "expo-router";
import ProviderWrapper from "../../providers/ProviderWrapper";
import { SafeAreaView } from "react-native";
import { colors, ScaleSize } from "../../utils/SharedStyles";

/*
The paths will be updated automatically updated within the .expo/types/router.d.ts everytime expo runs.
If the paths have not been updated then you may experience errors according to your IDE 
For instance, it may require you to write router.push(".index"), instead of just router.push("index") if routes have not yet been updated.
*/

const AuthRootLayout = () => {
  return (
    <ProviderWrapper>
      <SafeAreaView
        style={{ backgroundColor: colors.white, padding: ScaleSize(10) }}
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="profile/index" />
        <Stack.Screen name="profile/settings" />
        <Stack.Screen name="profile/editprofile" />
        <Stack.Screen name="profile/viewinvitation" />
        <Stack.Screen name="profile/organisation/[index]" />
        <Stack.Screen name="profile/organisation/addactivity" />
        <Stack.Screen name="profile/organisation/addcitizen" />
        <Stack.Screen name="profile/organisation/editactivity" />
        <Stack.Screen name="profile/organisation/weekplanscreen" />
      </Stack>
    </ProviderWrapper>
  );
};

export default AuthRootLayout;
