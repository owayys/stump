import { useSuspenseQuery } from "@tanstack/react-query"
import {
  ListActionButtons,
  ListItemList,
  ListPageLayout,
  ListStatsCard,
} from "@/components/lists"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  listQueryOptions,
  useDeleteListMutation,
} from "@/shared/hooks/lists-hooks"

type ListDetailsPageProps = {
  id: string
}

export const ListDetailsPage = ({ id }: ListDetailsPageProps) => {
  const { data: list } = useSuspenseQuery(listQueryOptions(id))
  const deleteMut = useDeleteListMutation()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this list?")) return
    await deleteMut.mutateAsync({ params: { id } })
  }

  return (
    <ListPageLayout back={{ label: "Back to Lists", to: "/lists" }}>
      <Card>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-2xl">{list.name}</h2>
              <p className="text-muted-foreground text-sm">
                Created {new Date(list.createdAt).toLocaleDateString()}
              </p>
            </div>
            <ListActionButtons
              isDeleting={deleteMut.isPending}
              listId={id}
              onDelete={handleDelete}
            />
          </div>

          {list.description && (
            <div>
              <p className="mb-1 font-medium">Description</p>
              <p className="text-muted-foreground">{list.description}</p>
            </div>
          )}

          <div className="grid gap-2">
            <p className="font-medium">Details</p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Updated:</span>
              <span>{new Date(list.updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={list.active ? "default" : "secondary"}>
                {list.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <ListStatsCard stats={list.stats} />
          <ListItemList items={list.items} />
        </CardContent>
      </Card>
    </ListPageLayout>
  )
}
