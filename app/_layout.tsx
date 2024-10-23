import { Stack } from "expo-router";
import ProviderWrapper from "../providers/ProviderWrapper";
import { SafeAreaView } from "react-native-safe-area-context";

const RootLayout = () => {
  return (
    <ProviderWrapper>
      <SafeAreaView style={{backgroundColor: ''}} />
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" />
        <Stack.Screen name="weekplanscreen" />
        <Stack.Screen name="viewactivity" />
        <Stack.Screen name="addactivity" />
        <Stack.Screen name="editactivity" />
        <Stack.Screen name="register" />
        
      </Stack>
    </ProviderWrapper>
  );
};

export default RootLayout;
