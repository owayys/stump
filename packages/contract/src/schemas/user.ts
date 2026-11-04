import { z } from "zod"

export const UserSchema = z
  .object({
    id: z.uuid(),
    name: z.string().min(1),
    email: z.email(),
    emailVerified: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    image: z.string().nullish(),
  })
  .meta({
    description: "User object representing a registered user in the system.",
    examples: [
      {
        id: "c4489351-5a80-4b6e-9d70-d46c83742bac",
        name: "John Doe",
        email: "john.doe@dev.com",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  })
export type User = z.output<typeof UserSchema>

export const NewUserSchema = UserSchema.pick({
  name: true,
  email: true,
})
  .extend({
    password: z
      .string()
      .min(6, { error: "Password must be at least 6 characters long." }),
  })
  .meta({
    description:
      "Schema for creating a new user, including name, email, and password.",
    examples: [
      {
        name: "John Doe",
        email: "john.doe@dev.com",
        password: "suPerSeCreT@123!",
      },
    ],
  })
