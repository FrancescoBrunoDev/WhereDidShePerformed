import { Icons } from "@/components/icons"

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Icons.loader className="h-5 w-5 animate-spin" />
    </div>
  )
}
