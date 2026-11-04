import { useForm } from "@tanstack/react-form"
import { Edit2, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { FieldShell } from "@/components/form/field-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatFieldErrors } from "@/shared/form/error-message"

export type ItemData = {
  id?: string
  name: string
  quantity: number
  notes?: string
}

type ItemFormProps = {
  initialData?: ItemData
  onSubmit: (item: ItemData) => void
  onCancel: () => void
  isEditing?: boolean
}

const ItemForm = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: ItemFormProps) => {
  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      quantity: initialData?.quantity || 1,
      notes: initialData?.notes || "",
    },
    onSubmit: ({ value }) => {
      onSubmit({
        ...initialData,
        ...value,
        notes: value.notes.trim() || undefined,
      })
    },
  })

  // Not a <form>: this sits inside the list form
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            !value.trim() ? "Item name is required" : undefined,
        }}
      >
        {(field) => (
          <FieldShell
            error={formatFieldErrors(field.state.meta.errors)}
            id="item-name"
            label="Item Name"
            required
          >
            <Input
              id="item-name"
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="e.g. Milk, Bread, Apples"
              value={field.state.value}
            />
          </FieldShell>
        )}
      </form.Field>

      <form.Field
        name="quantity"
        validators={{
          onChange: ({ value }) =>
            value < 1 ? "Quantity must be at least 1" : undefined,
        }}
      >
        {(field) => (
          <FieldShell
            error={formatFieldErrors(field.state.meta.errors)}
            id="item-quantity"
            label="Quantity"
          >
            <Input
              id="item-quantity"
              min={1}
              onChange={(e) => field.handleChange(Number(e.target.value) || 1)}
              type="number"
              value={field.state.value}
            />
          </FieldShell>
        )}
      </form.Field>

      <form.Field name="notes">
        {(field) => (
          <FieldShell id="item-notes" label="Notes (optional)">
            <Textarea
              id="item-notes"
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Any additional notes..."
              rows={2}
              value={field.state.value}
            />
          </FieldShell>
        )}
      </form.Field>

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} size="sm" type="button" variant="ghost">
          Cancel
        </Button>
        <Button onClick={() => form.handleSubmit()} size="sm" type="button">
          {isEditing ? <Edit2 /> : <Plus />}
          {isEditing ? "Update" : "Add"} Item
        </Button>
      </div>
    </div>
  )
}

type ItemManagerProps = {
  items: ItemData[]
  onItemsChange: (items: ItemData[]) => void
  title?: string
}

export const ItemManager = ({
  items,
  onItemsChange,
  title = "Items",
}: ItemManagerProps) => {
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-4 rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">
          {title} ({items.length})
        </h3>
        {!isAddingItem && (
          <Button
            onClick={() => setIsAddingItem(true)}
            size="sm"
            type="button"
            variant="secondary"
          >
            <Plus />
            Add Item
          </Button>
        )}
      </div>

      {isAddingItem && (
        <ItemForm
          onCancel={() => setIsAddingItem(false)}
          onSubmit={(newItem) => {
            onItemsChange([...items, newItem])
            setIsAddingItem(false)
          }}
        />
      )}

      {items.length === 0 && !isAddingItem ? (
        <p className="py-8 text-center text-muted-foreground">
          No items added yet. Click "Add Item" to get started.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, index) =>
            editingIndex === index ? (
              <ItemForm
                initialData={item}
                isEditing
                key={item.id || `item-${index}`}
                onCancel={() => setEditingIndex(null)}
                onSubmit={(updatedItem) => {
                  onItemsChange(
                    items.map((it, i) => (i === index ? updatedItem : it)),
                  )
                  setEditingIndex(null)
                }}
              />
            ) : (
              <div
                className="flex items-start justify-between gap-4 rounded-lg border p-3"
                key={item.id || `item-${index}`}
              >
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  {item.notes && (
                    <p className="text-muted-foreground text-xs">
                      {item.notes}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary">{item.quantity}x</Badge>
                  <Button
                    aria-label="Edit item"
                    onClick={() => setEditingIndex(index)}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  >
                    <Edit2 />
                  </Button>
                  <Button
                    aria-label="Delete item"
                    onClick={() =>
                      onItemsChange(items.filter((_, i) => i !== index))
                    }
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  )
}
