import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"

export const FieldShell = ({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}) => (
  <div className="grid gap-2">
    <Label htmlFor={id}>
      {label}
      {required && <span className="text-destructive">*</span>}
    </Label>
    {children}
    {error && <p className="text-destructive text-sm">{error}</p>}
  </div>
)
