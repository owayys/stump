import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

const PageNotFound = () => (
  <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-16 text-center">
    <h1 className="font-bold text-4xl">Nothing to see here</h1>
    <p className="text-lg text-muted-foreground">
      Page you are trying to open does not exist. You may have mistyped the
      address, or the page has been moved to another URL. If you think this is
      an error contact support.
    </p>
    <Button asChild size="lg">
      <Link preload="intent" to="/">
        Take me back to home page
      </Link>
    </Button>
  </div>
)

export default PageNotFound
