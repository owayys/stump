import { Link } from "@tanstack/react-router"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type ListActionButtonsProps = {
  listId: string
  onDelete: () => void
  isDeleting?: boolean
}

export const ListActionButtons = ({
  listId,
  onDelete,
  isDeleting = false,
}: ListActionButtonsProps) => (
  <div className="flex gap-2">
    <Button asChild variant="secondary">
      <Link params={{ id: listId }} to="/lists/$id/edit">
        <Edit />
        Edit
      </Link>
    </Button>
    <Button loading={isDeleting} onClick={onDelete} variant="destructive">
      {!isDeleting && <Trash2 />}
      Delete
    </Button>
  </div>
)
