import { Badge } from "@/components/ui/badge"

export default function RootLayout({
  children,
  eventInfoModal,
  tableEventUserModal,
}: {
  children: React.ReactNode
  eventInfoModal: React.ReactNode
  tableEventUserModal: React.ReactNode
}) {
  return (
    <div className="container my-32">
      {children}
      {eventInfoModal}
      {tableEventUserModal}
      <div className="container fixed bottom-3 flex w-full justify-center">
        <Badge variant={"secondary"} className="text-sm">
          <span>this profile section is in technical preview</span>
        </Badge>
      </div>
    </div>
  )
}
