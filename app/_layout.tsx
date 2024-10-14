import { Stack } from 'expo-router';
import ProviderWrapper from '../providers/ProviderWrapper';

const RootLayout = () => {
  return (
    <ProviderWrapper>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="weekplanscreen" />
        <Stack.Screen name="viewitem" />
        <Stack.Screen name="addactivity" />
        <Stack.Screen name="edititem" />
      </Stack>
    </ProviderWrapper>
  );
};

export default RootLayout;
