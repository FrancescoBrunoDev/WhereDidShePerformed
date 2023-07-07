import { useRouter } from "next/navigation"
import { useStoreProfile } from "@/store/useStoreProfile"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

import { EventModifyPayload } from "@/lib/validators/modifyEvent"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { buttonVariants } from "./ui/button"

interface DeleteButtonProps {
  uid: any
  isLoading?: boolean
  setEventList?: any
}

const DeleteButton: React.FC<DeleteButtonProps> = (uid, setEventList) => {
  const [fetchData, userId] = useStoreProfile((state) => [
    state.fetchData,
    state.userId,
  ])
  const router = useRouter()
  const { mutate: deleteEvent, isLoading } = useMutation({
    mutationFn: async (eventId) => {
      const payload: EventModifyPayload = {
        eventId: eventId,
      }
      console.log(payload, "payload")
      const { data } = await axios.post("/api/create/deleteEvent", payload)
      return data as String
    },
    onSuccess: () => {
      // Remove the deleted event from the event list
      console.log("Event deleted")
      router.refresh()
    },
  })
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={buttonVariants({
          className: "w-full py-2",
          size: "xs",
          variant: "destructive",
        })}
      >
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            event.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive"
            onClick={() => {
              deleteEvent(uid.uid)
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteButton
