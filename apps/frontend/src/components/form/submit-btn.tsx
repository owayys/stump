import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFormContext } from "@/shared/contexts/form-context"

const SubmitButton = ({
  label,
  fullWidth = false,
}: {
  label: string
  fullWidth?: boolean
}) => {
  const form = useFormContext()

  // Not disabled when invalid: submitting is what re-runs validation
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          className={cn(fullWidth && "w-full")}
          loading={isSubmitting}
          type="submit"
        >
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}

export default SubmitButton
