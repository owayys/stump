import type { ComponentProps } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useFieldContext } from "@/shared/contexts/form-context"
import { formatFieldErrors } from "@/shared/form/error-message"
import { FieldShell } from "./field-shell"

type TextAreaFieldProps = Omit<
  ComponentProps<typeof Textarea>,
  "id" | "name" | "value" | "onChange" | "onBlur"
> & { label: string }

const TextAreaField = ({ label, required, ...rest }: TextAreaFieldProps) => {
  const field = useFieldContext<string>()
  const error = formatFieldErrors(field.state.meta.errors)

  return (
    <FieldShell error={error} id={field.name} label={label} required={required}>
      <Textarea
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

export default TextAreaField
