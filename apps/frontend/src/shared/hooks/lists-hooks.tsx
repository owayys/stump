import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { z } from "zod"
import { orpc } from "@/shared/orpc"

export const ListsSearchSchema = z.object({
  search: z.string().default(""),
  status: z.enum(["active", "inactive", ""]).default(""),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).default(10),
})
export type ListsSearch = z.infer<typeof ListsSearchSchema>

export const listsQueryOptions = ({
  search,
  status,
  page,
  limit,
}: ListsSearch) =>
  orpc.authenticated.groceryList.getLists.queryOptions({
    input: {
      pagination: { page, limit },
      filters: { search, status: status || undefined },
    },
  })

export const listQueryOptions = (id: string) =>
  orpc.authenticated.groceryList.getListById.queryOptions({
    input: { params: { id } },
  })

const listsKey = orpc.authenticated.groceryList.getLists.key()

export const useNewListMutation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation(
    orpc.authenticated.groceryList.createGroceryList.mutationOptions({
      onError: (err) => {
        toast.error("Failed to create grocery list", {
          description: err.message,
        })
      },
      onSuccess: async (data) => {
        queryClient.setQueryData(listQueryOptions(data.id).queryKey, data)
        await queryClient.invalidateQueries({ queryKey: listsKey })
        toast.success(`List ${data.name} created successfully!`)
        await navigate({ to: "/lists/$id", params: { id: data.id } })
      },
    }),
  )
}

export const useUpdateListMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.authenticated.groceryList.updateGroceryList.mutationOptions({
      onError: (err) => {
        toast.error("Failed to update grocery list", {
          description: err.message,
        })
      },
      onSuccess: async (data) => {
        queryClient.setQueryData(listQueryOptions(data.id).queryKey, data)
        await queryClient.invalidateQueries({ queryKey: listsKey })
        toast.success(`List ${data.name} updated successfully!`)
      },
    }),
  )
}

export const useDeleteListMutation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation(
    orpc.authenticated.groceryList.deleteGroceryList.mutationOptions({
      onError: (err) => {
        toast.error("Failed to delete grocery list", {
          description: err.message,
        })
      },
      onSuccess: async (data) => {
        toast.success("List deleted successfully!")
        queryClient.removeQueries({
          queryKey: listQueryOptions(data.id).queryKey,
        })
        queryClient.invalidateQueries({ queryKey: listsKey })
        await navigate({ to: "/lists" })
      },
    }),
  )
}
