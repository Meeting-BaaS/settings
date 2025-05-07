"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export function SimpleSidebar({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex flex-col space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
            pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "text-foreground/60"
          )}
          onClick={(e) => {
            // For mobile: Allow event to propagate normally, but added for potential future use
            // with automatic sidebar closing on navigation
          }}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
} 