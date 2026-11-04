import { createFileRoute } from "@tanstack/react-router"
import { ListUpdatePage } from "@/pages/lists/update-page"
import { listQueryOptions } from "@/shared/hooks/lists-hooks"

const ListUpdatePageWrapper = () => {
  const { id } = Route.useParams()

  return <ListUpdatePage id={id} />
}

export const Route = createFileRoute("/_private/lists/$id/edit")({
  component: ListUpdatePageWrapper,
  head: () => ({ meta: [{ title: "Edit List" }] }),
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(listQueryOptions(params.id)),
})
