import Link from "next/link"
import { siteConfig } from "@/config/site"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Icons } from "@/components/icons"

const randomNumber = Math.floor(Math.random() * 1000) + 1;

export function InfoSection() {
  return (
    <Dialog>
      <div
        className={buttonVariants({
          size: "sm",
          variant: "ghost",
        })}
      >
        <DialogTrigger>
          <Icons.info className="h-5 w-5" />
          <span className="sr-only">Info</span>
        </DialogTrigger>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <h1 className="text-4xl font-black">Hi there!</h1>
          </DialogTitle>
          <DialogDescription>
            <div className="text-justify indent-4">
              <p>
                I&apos;m{" "}
                <Link
                  className="hover:rounded-md hover:bg-secondary hover:p-1"
                  href={"https://www.francesco-bruno.com/"}
                  target="_blank"
                  rel="noreferrer"
                >
                  Francesco Bruno
                  <Icons.externalLink className="inline-block h-4 w-4 align-text-top" />{" "}
                </Link>
                , a musicologist and developer. Here, you can search for
                performers and explore where they have played throughout their
                lives using the vast{" "}
                <Link
                  className="hover:rounded-md hover:bg-secondary hover:p-1"
                  href={"https://performance.musiconn.de/"}
                  target="_blank"
                  rel="noreferrer"
                >
                  Musiconn performance
                  <Icons.externalLink className="inline-block h-4 w-4 align-text-top" />
                </Link>{" "}
                database.
              </p>
              <p className="mt-5">
                Discover the spatial locations where well-known musicians or
                hidden gems have left their musical mark. With a user-friendly
                interface and comprehensive data, this platform is your gateway
                to a captivating journey through the performances of talented
                musicians. Start exploring and unravel the rich tapestry of
                their musical experiences. Thank you for visiting, and enjoy
                your exploration of the world on this website!
              </p>
            </div>

            <div className="mt-5 flex w-full flex-col px-5 text-center">
              <h1 className="text-xl font-black text-primary">Legend</h1>
              <div className="flex-col-2 mt-2 flex items-center">
                <div className="pr-2">
                  <Badge>{randomNumber}</Badge>
                </div>
                <div className="text-left font-normal">
                  <p>
                    Reference ID on the Musiconn performance database. Every
                    place, person, and event has a unique number. If you click
                    on it, you will be directed to the corresponding page on the
                    database.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-10 flex w-full flex-col px-5 text-center">
              <div className="flex-col-2 mt-2 flex items-center justify-center gap-x-2">
                <p>made with:</p>
                <Link
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                  href={"https://nextjs.org/"}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.nextjs className="h-5 w-5 " />
                </Link>
                <Link
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                  href={"https://tailwindcss.com/"}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.tailwind className="h-5 w-5" />
                </Link>
                <Link
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                  href={"https://react-simple-maps.io/"}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.reactsimpleMaps className="h-6 w-6" />
                </Link>
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    <Icons.gitHub className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </div>
                </Link>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
