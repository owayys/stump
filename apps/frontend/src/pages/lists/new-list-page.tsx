import { useForm } from "@tanstack/react-form"
import { Link } from "@tanstack/react-router"
import { FieldShell } from "@/components/form/field-shell"
import { type ItemData, ItemManager, ListPageLayout } from "@/components/lists"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatFieldErrors } from "@/shared/form/error-message"
import { useNewListMutation } from "@/shared/hooks/lists-hooks"

const noItems: ItemData[] = []

export const NewListPage = () => {
  const newListMut = useNewListMutation()

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      items: noItems,
    },
    onSubmit: async ({ value }) => {
      await newListMut.mutateAsync({
        name: value.name,
        description: value.description,
        items: value.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          notes: item.notes || null,
        })),
      })
    },
  })

  return (
    <ListPageLayout back={{ label: "Back to Lists", to: "/lists" }} narrow>
      <Card>
        <CardHeader className="border-b text-center">
          <CardTitle className="text-2xl">Create New Grocery List</CardTitle>
          <CardDescription>
            Create a new list and add items to organize your groceries
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className="flex flex-col gap-6"
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  value.length < 3
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
                    disabled={form.state.isSubmitting}
                    id="list-name"
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Weekly Groceries"
                    value={field.state.value}
                  />
                </FieldShell>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <FieldShell id="list-description" label="Description">
                  <Textarea
                    disabled={form.state.isSubmitting}
                    id="list-description"
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Optional description for this list..."
                    rows={4}
                    value={field.state.value}
                  />
                </FieldShell>
              )}
            </form.Field>

            <form.Field name="items">
              {(field) => (
                <ItemManager
                  items={field.state.value}
                  onItemsChange={(items) => field.handleChange(items)}
                  title="List Items"
                />
              )}
            </form.Field>

            <div className="flex justify-end gap-2 border-t pt-6">
              <Button asChild variant="ghost">
                <Link to="/lists">Cancel</Link>
              </Button>
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button loading={isSubmitting} type="submit">
                    Create List
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </form>
        </CardContent>
      </Card>
    </ListPageLayout>
  )
}
