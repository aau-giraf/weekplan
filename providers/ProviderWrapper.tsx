import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DateProvider from "./DateProvider";
import CitizenProvider from "./CitizenProvider";
import ToastProvider from "./ToastProvider";

type CustomLayoutProps = {
  children: React.ReactNode;
};
/**
 * Wrapper for providers
 * @param children
 * @constructor
 * @return {ReactNode}
 */
const ProviderWrapper = ({ children }: CustomLayoutProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 1,
      },
      mutations: {
        retry: 1,
      },
    },
  });

  return (
    <ToastProvider>
      <CitizenProvider>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView>
            <DateProvider>{children}</DateProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </CitizenProvider>
    </ToastProvider>
  );
};

export default ProviderWrapper;
