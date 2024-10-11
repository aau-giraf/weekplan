import { Stack } from "expo-router";
import ProviderWrapper from "../providers/ProviderWrapper";
import activityId from "./activity/[activityId]";

const RootLayout = () => {
  return (
    <ProviderWrapper>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="weekplanscreen" />
        <Stack.Screen name="additem" />
        <Stack.Screen name="activity"  />
      </Stack>
    </ProviderWrapper>
  );
};

export default RootLayout;
