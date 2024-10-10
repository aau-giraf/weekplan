import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DateProvider from './DateProvider';
import CitizenProvider from './CitizenProvider';

type CustomLayoutProps = {
  children: React.ReactNode;
};

const ProviderWrapper = ({ children }: CustomLayoutProps) => {
  const queryClient = new QueryClient();
  return (
    <CitizenProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <DateProvider>{children}</DateProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </CitizenProvider>
  );
};

export default ProviderWrapper;
