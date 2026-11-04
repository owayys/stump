import { createFormHook } from "@tanstack/react-form"
import SubmitButton from "@/components/form/submit-btn"
import TextAreaField from "@/components/form/text-area-field"
import TextField from "@/components/form/text-field"
import { fieldContext, formContext } from "@/shared/contexts/form-context"

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    TextAreaField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})
