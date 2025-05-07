import { menuOptions } from "@/components/header/menu-options"
import { ThemeToggle } from "@/components/header/theme-toggle"
import { UserAvatar } from "@/components/header/user-avatar"
import { GitHubLogo } from "@/components/icons/github"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/auth/types"
import Image from "next/image"
import Link from "next/link"

export default function Header({ user }: { user: User }) {
  return (
    <header className="sticky top-0 z-50 mx-auto box-content w-full max-w-container border-b bg-background/90 backdrop-blur-lg lg:mt-2 lg:w-[calc(100%-4rem)] lg:rounded-2xl lg:border">
      <nav className="flex h-16 w-full flex-row items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Meeting BaaS logo"
            priority
            width={20}
            height={20}
            className="h-5 w-5"
          />
          <span className="font-bold text-md">Meeting BaaS</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="fill-foreground h-9 w-9 p-0"
              asChild
              aria-label="Github repository"
            >
              <Link
                href="https://github.com/Yusuf023/meeting-baas-logs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubLogo />
              </Link>
            </Button>
            <ThemeToggle className="hidden md:flex" />
          </div>
          <UserAvatar user={user} menuOptions={menuOptions} />
        </div>
      </nav>
    </header>
  )
}
