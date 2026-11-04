import { authenticated, unwrap } from "@/web/orpc"

const base = authenticated.groceryList

export default base.router({
  getListById: base.getListById.handler(async ({ input, context }) =>
    unwrap(
      await context.deps.groceryLists.fetchGroceryListDetails(
        input.params.id,
        context.user,
      ),
    ),
  ),

  getStats: base.getStats.handler(async ({ context }) =>
    unwrap(await context.deps.groceryLists.getDashboardStats(context.user)),
  ),

  createGroceryList: base.createGroceryList.handler(
    async ({ input, context }) =>
      unwrap(
        await context.deps.groceryLists.createGroceryList(input, context.user),
      ),
  ),

  updateGroceryList: base.updateGroceryList.handler(
    async ({ input, context }) =>
      unwrap(
        await context.deps.groceryLists.updateGroceryList(
          input.params.id,
          input.body,
          context.user,
        ),
      ),
  ),

  deleteGroceryList: base.deleteGroceryList.handler(
    async ({ input, context }) =>
      unwrap(
        await context.deps.groceryLists.deleteGroceryList(
          input.params.id,
          context.user,
        ),
      ),
  ),

  getLists: base.getLists.handler(async ({ input, context }) =>
    unwrap(
      await context.deps.groceryLists.getGroceryListsWithFilters(
        context.user,
        input,
      ),
    ),
  ),

  fetchRecentLists: base.fetchRecentLists.handler(async ({ context }) =>
    unwrap(await context.deps.groceryLists.fetchRecentLists(context.user)),
  ),
})
