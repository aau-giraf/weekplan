import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootLayout = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>

      <GestureHandlerRootView>
        <Stack>
          <Stack.Screen name="index" />
          <Stack.Screen name="example/index" />
          <Stack.Screen name="weekplanscreen" />
          <Stack.Screen name="additem" />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default RootLayout;
