import { Loader2Icon } from "lucide-react"

export const PageSuspenseFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
  </div>
)
