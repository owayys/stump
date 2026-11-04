import type { ComponentProps } from "react"
import { Input } from "@/components/ui/input"
import { useFieldContext } from "@/shared/contexts/form-context"
import { formatFieldErrors } from "@/shared/form/error-message"
import { FieldShell } from "./field-shell"

type TextFieldProps = Omit<
  ComponentProps<typeof Input>,
  "id" | "name" | "value" | "onChange" | "onBlur"
> & { label: string }

const TextField = ({ label, required, ...rest }: TextFieldProps) => {
  const field = useFieldContext<string>()
  const error = formatFieldErrors(field.state.meta.errors)

  return (
    <FieldShell error={error} id={field.name} label={label} required={required}>
      <Input
        aria-invalid={!field.state.meta.isValid}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        required={required}
        value={field.state.value}
        {...rest}
      />
    </FieldShell>
  )
}

export default TextField
