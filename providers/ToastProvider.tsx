import { createContext, useContext, useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import Toast, { ToastProps } from "../components/Toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScaleSize } from "../utils/SharedStyles";

type ToastProviderValues = {
  addToast: (toast: Omit<ToastProps, "id" | "onClose">, duration?: number) => void;
  toasts: Omit<ToastProps, "onClose">[];
  removeToast: (id: number) => void;
};

const ToastContext = createContext<ToastProviderValues | undefined>(undefined);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Omit<ToastProps, "onClose">[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastProps, "id" | "onClose">, duration = 5000) => {
      const id = new Date().getTime();
      const toastWithId = { id, duration, ...toast };
      setToasts((prev) => [...prev, toastWithId]);
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, toasts, removeToast }}>
      {children}
      <SafeAreaView style={styles.container}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </SafeAreaView>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    position: "absolute",
    top: 0,
    alignSelf: "center",
    gap: ScaleSize(10),
  },
});

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default ToastProvider;
