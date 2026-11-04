import { TaggedError } from "better-result"

export interface ValidationIssue {
  message: string
  path?: string[]
  field?: string
  value?: unknown
}

export class NotFound extends TaggedError("NotFound")<{
  resource: string
  id: string
  message: string
}> {}

export class Forbidden extends TaggedError("Forbidden")<{ message: string }> {}

export class Validation extends TaggedError("Validation")<{
  message: string
  issues: ValidationIssue[]
}> {}

export class Conflict extends TaggedError("Conflict")<{ message: string }> {}

export type DomainError = NotFound | Forbidden | Validation | Conflict

export const notFound = (resource: string, id: string) =>
  new NotFound({
    resource,
    id,
    message: `${resource} with id '${id}' not found`,
  })

export const invalid = (issues: ValidationIssue[]) =>
  new Validation({
    message: `Validation failed with ${issues.length} error(s): ${issues.map((i) => i.message).join(", ")}`,
    issues,
  })
