import { useForm } from "@tanstack/react-form"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link, useNavigate } from "@tanstack/react-router"
import { Save } from "lucide-react"
import { FieldShell } from "@/components/form/field-shell"
import { ListFormCard, ListItemList, ListPageLayout } from "@/components/lists"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { formatFieldErrors } from "@/shared/form/error-message"
import {
  listQueryOptions,
  useUpdateListMutation,
} from "@/shared/hooks/lists-hooks"

type ListUpdatePageProps = {
  id: string
}

export const ListUpdatePage = ({ id }: ListUpdatePageProps) => {
  const { data: list } = useSuspenseQuery(listQueryOptions(id))
  const updateMutation = useUpdateListMutation()
  const navigate = useNavigate({ from: "/lists/$id/edit" })

  const form = useForm({
    defaultValues: {
      name: list.name,
      description: list.description,
      active: list.active,
    },
    onSubmit: async ({ value }) => {
      await updateMutation.mutateAsync({
        params: { id },
        body: {
          name: value.name.trim(),
          description: value.description.trim(),
          active: value.active,
        },
      })

      await navigate({ to: "/lists/$id", params: { id } })
    },
  })

  return (
    <ListPageLayout
      back={{ label: "Back to List", to: "/lists/$id", params: { id } }}
    >
      <h2 className="font-semibold text-2xl">Edit List</h2>

      <form
        className="flex flex-col gap-6"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <ListFormCard title="List Information">
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                value.trim().length < 3
                  ? "Name must be at least 3 characters"
                  : undefined,
            }}
          >
            {(field) => (
              <FieldShell
                error={formatFieldErrors(field.state.meta.errors)}
                id="list-name"
                label="List Name"
                required
              >
                <Input
                  id="list-name"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter list name"
                  value={field.state.value}
                />
              </FieldShell>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <FieldShell id="list-description" label="Description">
                <Textarea
                  id="list-description"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter list description (optional)"
                  rows={3}
                  value={field.state.value}
                />
              </FieldShell>
            )}
          </form.Field>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">Active Status</p>
              <p className="text-muted-foreground text-sm">
                Active lists are visible in your main lists view
              </p>
            </div>
            <form.Field name="active">
              {(field) => (
                <Switch
                  aria-label="Active"
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
              )}
            </form.Field>
          </div>
        </ListFormCard>

        <ListFormCard
          title={
            <span className="flex items-center justify-between">
              Items ({list.items.length})
              <span className="font-medium text-amber-500 text-sm">
                View Only
              </span>
            </span>
          }
        >
          <p className="text-muted-foreground text-sm">
            Item editing requires additional backend API endpoints. You can view
            existing items below, but modifications must be done by creating a
            new list.
          </p>
          <ListItemList
            emptyMessage="No items in this list."
            items={list.items}
          />
        </ListFormCard>

        <div className="flex justify-between">
          <Button asChild variant="ghost">
            <Link params={{ id }} to="/lists/$id">
              Cancel
            </Link>
          </Button>
          <Button loading={updateMutation.isPending} type="submit">
            {!updateMutation.isPending && <Save />}
            Save Changes
          </Button>
        </div>
      </form>
    </ListPageLayout>
  )
}
