import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import Profile from "@/components/Profile"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

import { InfoSection } from "./infoSection"

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-40 w-full bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="hidden md:inline-block">
          <MainNav items={siteConfig.mainNav} />
        </div>
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-block md:hidden"
        >
          <div
            className={buttonVariants({
              size: "sm",
              variant: "ghost",
            })}
          >
            <Icons.home className="h-5 w-5 stroke-primary dark:hover:stroke-secondary" />
            <span className="sr-only">Home</span>
          </div>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
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
                <Icons.gitHub className="h-5 w-5 stroke-primary dark:hover:stroke-secondary" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <InfoSection />
            <ThemeToggle />
            {/* @ts-expect-error Server Component */}
            <Profile />
          </nav>
        </div>
      </div>
    </header>
  )
}
