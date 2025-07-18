import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
export function Toaster() {
  const {
    toasts
  } = useToast();
  return <ToastProvider>
      {toasts.map(function ({
      id,
      title,
      description,
      action,
      ...props
    }) {
      return;
    })}
      <ToastViewport className="fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-[280px]" />
    </ToastProvider>;
}