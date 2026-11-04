import type { ErrorComponentProps } from "@tanstack/react-router"
import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

const DefaultErrorBoundary = ({ error }: ErrorComponentProps) => {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-8 px-4">
      <ErrorComponent error={error} />

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => router.invalidate()} variant="secondary">
          Try Again
        </Button>
        <Button asChild variant="secondary">
          <Link to="/">{isRoot ? "Home" : "Go Back"}</Link>
        </Button>
      </div>
    </div>
  )
}

export default DefaultErrorBoundary
