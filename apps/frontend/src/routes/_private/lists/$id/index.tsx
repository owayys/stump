import { createFileRoute } from "@tanstack/react-router"
import { ListDetailsPage } from "@/pages/lists/details-page"
import { listQueryOptions } from "@/shared/hooks/lists-hooks"

const ListDetailPageWrapper = () => {
  const { id } = Route.useParams()

  return <ListDetailsPage id={id} />
}

export const Route = createFileRoute("/_private/lists/$id/")({
  component: ListDetailPageWrapper,
  head: () => ({ meta: [{ title: "List Detail" }] }),
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(listQueryOptions(params.id)),
})
