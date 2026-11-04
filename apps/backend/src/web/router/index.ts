import { authenticated } from "@/web/orpc"
import groceryListRouter from "./grocery-list"
import userRouter from "./user"

export const router = {
  authenticated: authenticated.router({
    user: userRouter,
    groceryList: groceryListRouter,
  }),
}
