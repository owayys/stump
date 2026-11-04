import type { Result } from "better-result"
import type { Validation } from "./errors"

export * from "./entity"
export * from "./errors"
export * from "./pagination.utils"

export type RepoResult<T, E = never> = Promise<Result<T, E | Validation>>
