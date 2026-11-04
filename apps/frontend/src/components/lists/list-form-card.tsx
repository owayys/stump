import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ListFormCardProps = {
  title?: ReactNode
  children: ReactNode
}

export const ListFormCard = ({ title, children }: ListFormCardProps) => (
  <Card>
    {title && (
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
    )}
    <CardContent className="flex flex-col gap-4">{children}</CardContent>
  </Card>
)
