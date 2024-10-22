import { Stack } from "expo-router";
import ProviderWrapper from "../providers/ProviderWrapper";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const RootLayout = () => {
  return (
    <ProviderWrapper>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="weekplanscreen" />
        <Stack.Screen name="viewactivity" />
        <Stack.Screen name="addactivity" />
        <Stack.Screen name="editactivity" />
        <Stack.Screen name="mainscreen" />
      </Stack>
    </ProviderWrapper>
  );
};

export default RootLayout;
