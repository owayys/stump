import { Link, type LinkOptions } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ValidAppLink } from "@/types"

type ListPageLayoutProps = {
  children: ReactNode
  back: LinkOptions & { label: string }
  narrow?: boolean
  notFound?: {
    message: string
    backTo: ValidAppLink
    backLabel: string
  }
}

export const ListPageLayout = ({
  children,
  back: { label: backLabel, ...backLink },
  narrow = false,
  notFound,
}: ListPageLayoutProps) => (
  <div
    className={cn(
      "mx-auto flex w-full flex-col gap-6 p-8",
      narrow ? "max-w-2xl" : "max-w-4xl",
    )}
  >
    {notFound ? (
      <div className="flex flex-col items-center gap-4">
        <p className="text-lg text-muted-foreground">{notFound.message}</p>
        <Button asChild variant="ghost">
          <Link to={notFound.backTo}>{notFound.backLabel}</Link>
        </Button>
      </div>
    ) : (
      <>
        <Button asChild className="self-start" variant="ghost">
          <Link {...backLink}>
            <ArrowLeft />
            {backLabel}
          </Link>
        </Button>
        {children}
      </>
    )}
  </div>
)
