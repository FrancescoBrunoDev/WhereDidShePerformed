"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Icons.sun className="rotate-0 scale-100 stroke-primary transition-all dark:-rotate-90 dark:scale-0 dark:hover:stroke-secondary" />
      <Icons.moon className="absolute rotate-90 scale-0 stroke-primary transition-all dark:rotate-0 dark:scale-100 dark:hover:stroke-secondary" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
