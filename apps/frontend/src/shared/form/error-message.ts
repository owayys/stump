export const formatFieldErrors = (errors: ReadonlyArray<unknown>) =>
  errors
    .map((err) =>
      typeof err === "string"
        ? err
        : (err as { message?: string } | undefined)?.message,
    )
    .filter(Boolean)
    .join(", ")
