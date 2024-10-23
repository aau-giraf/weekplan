import { Stack } from "expo-router";
import ProviderWrapper from "../providers/ProviderWrapper";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../utils/colors";

const RootLayout = () => {
  return (
    <ProviderWrapper>
      <SafeAreaView style={{backgroundColor: colors.white}} />
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" />
        <Stack.Screen name="weekplanscreen" />
        <Stack.Screen name="viewactivity" />
        <Stack.Screen name="addactivity" />
        <Stack.Screen name="editactivity" />
        <Stack.Screen name="register" />
        <Stack.Screen name="login" />
      </Stack>
    </ProviderWrapper>
  );
};

export default RootLayout;
