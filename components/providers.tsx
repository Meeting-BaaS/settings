"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { SidebarProvider } from "@/components/ui/sidebar"
import { JwtProvider } from "@/contexts/jwt-context"
import { EmailTypesProvider } from "@/contexts/email-types-context"
import type { EmailType } from "@/lib/email-types"

const queryClient = new QueryClient()

export default function Providers({
  children,
  jwt,
  emailTypes
}: Readonly<{
  children: React.ReactNode
  jwt: string
  emailTypes: EmailType[]
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
      <JwtProvider jwt={jwt}>
        <EmailTypesProvider emailTypes={emailTypes}>
          <QueryClientProvider client={queryClient}>
            <SidebarProvider className="flex flex-col">{children}</SidebarProvider>
          </QueryClientProvider>
        </EmailTypesProvider>
      </JwtProvider>
    </ThemeProvider>
  )
}
