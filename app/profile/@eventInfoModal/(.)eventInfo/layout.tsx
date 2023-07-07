import CloseModal from "@/components/CloseModal"

export default function LayoutEventInfo({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100">
      <div className="container mx-auto flex h-full max-w-fit items-center">
        <div className="relative h-[90vh] w-full rounded-lg border bg-background px-2 pb-4 pt-8">
          <div className="absolute right-4 top-4">
            <CloseModal />
          </div>
          <div className="h-full overflow-y-auto p-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
