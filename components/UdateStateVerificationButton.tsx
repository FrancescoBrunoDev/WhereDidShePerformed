import { Role, StateVerification } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

import { Button } from "@/components/ui/button"

interface Event {
  uid: string
  stateVerification: StateVerification
}

interface UpdateStateVerificationButtonProps {
  uid: {
    eventId: Event[]
  }
  userRole?: Role
}

const UpdateStateVerificationButton: React.FC<
  UpdateStateVerificationButtonProps
> = ({ uid, userRole }) => {
  const events = uid.eventId
  let allEventsPending: Event[] = []

  if (userRole === Role.USER) {
    allEventsPending = events
      .filter((event) => event.stateVerification === StateVerification.NONE)
      .map((event) => ({
        uid: event.uid,
        stateVerification: StateVerification.PENDING,
      }))
  } else if (userRole === Role.ADMIN) {
    allEventsPending = events
      .filter((event) => event.stateVerification === StateVerification.PENDING)
      .map((event) => ({
        uid: event.uid,
        stateVerification: StateVerification.VERIFIED,
      }))
  }

  const { mutate: updateStateVerification, isLoading } = useMutation({
    mutationFn: async (eventData: Event[]) => {
      // Change the state verification of all events
      const { data } = await axios.post(
        "/api/create/updateVerificationEvent",
        eventData
      )
      return data as string
    },
  })

  return (
    <>
      {allEventsPending.length > 0 && (
        <Button
          isLoading={isLoading}
          onClick={() => updateStateVerification(allEventsPending)}
          size={"xs"}
        >
          {userRole === Role.USER
            ? `Submit ${allEventsPending.length} for Verification`
            : userRole === Role.ADMIN
            ? `Verify ${allEventsPending.length}`
            : null}
        </Button>
      )}
    </>
  )
}

export default UpdateStateVerificationButton
