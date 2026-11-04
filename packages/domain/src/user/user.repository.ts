import type { RepoResult } from "@repo/domain/utils"
import type { NotFound } from "@repo/domain/utils/errors"
import type { User } from "./user.entity"

export interface UserUpdateData {
  name?: string
  email?: User["email"]
  emailVerified?: boolean
  image?: User["image"]
}

export interface UserRepository {
  create(user: User): RepoResult<User>
  findById(id: User["id"]): RepoResult<User, NotFound>
  findByEmail(email: User["email"]): RepoResult<User, NotFound>
  update(id: User["id"], updates: UserUpdateData): RepoResult<User, NotFound>
  delete(id: User["id"]): RepoResult<void, NotFound>
  exists(id: User["id"]): Promise<boolean>
  existsByEmail(email: User["email"]): Promise<boolean>
}
