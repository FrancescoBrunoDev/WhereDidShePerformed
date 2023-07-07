import Link from "next/link"
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { UserAccountNav } from "@/components/UserAccountNav"

const Profile = async (): Promise<JSX.Element> => {
  const session = await getServerSession(authOptions)
  return (
    <>
      {!session?.user ? (
        <Link href="/sign-in">
          <div
            className={buttonVariants({
              size: "sm",
              variant: "ghost",
            })}
          >
            <Icons.login className="h-5 w-5" />
            <span className="sr-only">Login</span>
          </div>
        </Link>
      ) : <UserAccountNav user={session.user} />}
    </>
  )
}

export default Profile
