import { LogOutIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLogoutMutation } from "@/shared/hooks/auth-hooks"

const LogoutBtn = () => {
  const logoutMut = useLogoutMutation()

  return (
    <Button
      className="w-full justify-start"
      loading={logoutMut.isPending}
      onClick={() => logoutMut.mutate()}
      variant="ghost"
    >
      {!logoutMut.isPending && <LogOutIcon />}
      Logout
    </Button>
  )
}

export default LogoutBtn
