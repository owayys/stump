import type { ReactNode } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const AuthCard = ({
  title,
  description,
  children,
}: {
  title: string
  description: ReactNode
  children: ReactNode
}) => (
  <Card className="w-full">
    <CardHeader className="text-center">
      <CardTitle className="text-2xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
)
