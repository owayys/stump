import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = (props: ToasterProps) => (
  <Sonner
    className="toaster group"
    closeButton
    richColors
    theme="dark"
    {...props}
  />
)

export { Toaster }
