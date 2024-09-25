import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";

const RootLayout = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="example/index" />
      </Stack>
    </QueryClientProvider>
  );
};

export default RootLayout;
