import { SettingsSidebar } from "@/components/settings-sidebar"

interface SettingsLayoutProps {
  children: React.ReactNode
}

const sidebarNavItems = [
  {
    title: "Email Preferences",
    href: "/settings/email-preferences",
  },
  {
    title: "Account Settings",
    href: "/settings/account",
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
  },
  {
    title: "Security",
    href: "/settings/security",
  },
]

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="container max-w-6xl py-10">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences.
            </p>
          </div>
          <SettingsSidebar items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-3xl">{children}</div>
      </div>
    </div>
  )
} 