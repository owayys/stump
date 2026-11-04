import { useEffect, useRef } from "react"

export const useDebouncedCallback = <Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
) => {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  return (...args: Args) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => callback(...args), delayMs)
  }
}
