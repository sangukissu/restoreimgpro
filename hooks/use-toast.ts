import { toast } from "sonner"

export const useToast = () => {
  return {
    toast,
    dismiss: toast.dismiss,
    error: (message: string, options?: Parameters<typeof toast.error>[1]) => toast.error(message, options),
    success: (message: string, options?: Parameters<typeof toast.success>[1]) => toast.success(message, options),
    warning: (message: string, options?: Parameters<typeof toast.warning>[1]) => toast.warning(message, options),
    info: (message: string, options?: Parameters<typeof toast.info>[1]) => toast.info(message, options),
    loading: (message: string, options?: Parameters<typeof toast.loading>[1]) => toast.loading(message, options),
    promise: toast.promise,
  }
}
