import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastProvider from "./ToastProvider";
import AuthenticationProvider from "./AuthenticationProvider";
import { ProfilePictureUpdaterProvider } from "./ProfilePictureUpdaterProvider";

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
      <AuthenticationProvider>
        <QueryClientProvider client={queryClient}>
          <ProfilePictureUpdaterProvider>{children}</ProfilePictureUpdaterProvider>
        </QueryClientProvider>
      </AuthenticationProvider>
    </ToastProvider>
  );
};

export default ProviderWrapper;
