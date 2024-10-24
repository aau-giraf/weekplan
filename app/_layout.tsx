import { Stack } from "expo-router";
import ProviderWrapper from "../providers/ProviderWrapper";

const RootLayout = () => {
  return (
    <ProviderWrapper>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="weekplanscreen" />
        <Stack.Screen name="viewactivity" />
        <Stack.Screen name="addactivity" />
        <Stack.Screen name="editactivity" />
        <Stack.Screen name="vieworganisation" />
      </Stack>
    </ProviderWrapper>
  );
};

export default RootLayout;
