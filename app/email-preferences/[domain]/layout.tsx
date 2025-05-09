import { SidebarTrigger } from "@/components/ui/sidebar"

export default async function DomainLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="block px-1 md:hidden" />
          <h1 className="font-bold text-3xl">Email Preferences</h1>
        </div>
        <p className="mt-1 text-muted-foreground">
          Manage which emails you receive from Meeting BaaS.
        </p>
      </div>
      {children}
    </>
  )
}
