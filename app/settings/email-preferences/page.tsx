"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { toast } from "sonner"

export default function EmailPreferencesPage() {
  const [preferences, setPreferences] = useState({
    "product-updates": true,
    "news-announcements": true,
    "maintenance-notifications": true,
    "security-alerts": true,
    "account-activity": true,
    "monthly-summary": true,
    "usage-alerts": true,
    "billing-notifications": true,
  })

  const handleToggle = (id: string) => {
    setPreferences((prev) => {
      const newPreferences = { ...prev, [id]: !prev[id as keyof typeof prev] }
      
      // In a real app, you would save this to the backend
      toast.success(`${newPreferences[id as keyof typeof prev] ? 'Subscribed to' : 'Unsubscribed from'} ${id.split('-').join(' ')}`)
      
      return newPreferences
    })
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Email Preferences</h1>
        <p className="text-muted-foreground mt-2">
          Manage which emails you receive from Meeting BaaS.
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>
            Stay informed about new features, updates, and announcements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Product Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Receive emails about new features and improvements.
                </p>
              </div>
              <Switch 
                checked={preferences["product-updates"]} 
                onCheckedChange={() => handleToggle("product-updates")}
                id="product-updates" 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">News & Announcements</h4>
                <p className="text-sm text-muted-foreground">
                  General company announcements and news.
                </p>
              </div>
              <Switch 
                checked={preferences["news-announcements"]} 
                onCheckedChange={() => handleToggle("news-announcements")}
                id="news-announcements" 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Maintenance Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Get notified about scheduled maintenance and downtime.
                </p>
              </div>
              <Switch 
                checked={preferences["maintenance-notifications"]} 
                onCheckedChange={() => handleToggle("maintenance-notifications")}
                id="maintenance-notifications" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account Notifications</CardTitle>
          <CardDescription>
            Notifications related to your account activity and security.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Security Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  Important security notifications about your account.
                </p>
              </div>
              <Switch 
                checked={preferences["security-alerts"]} 
                onCheckedChange={() => handleToggle("security-alerts")}
                id="security-alerts" 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Account Activity</h4>
                <p className="text-sm text-muted-foreground">
                  Login attempts, password changes, and other account activities.
                </p>
              </div>
              <Switch 
                checked={preferences["account-activity"]} 
                onCheckedChange={() => handleToggle("account-activity")}
                id="account-activity" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage Reports</CardTitle>
          <CardDescription>
            Receive reports about your Meeting BaaS usage and billing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Monthly Summary</h4>
                <p className="text-sm text-muted-foreground">
                  Monthly reports summarizing your usage and charges.
                </p>
              </div>
              <Switch 
                checked={preferences["monthly-summary"]} 
                onCheckedChange={() => handleToggle("monthly-summary")}
                id="monthly-summary" 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Usage Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  Get notified when you reach usage thresholds.
                </p>
              </div>
              <Switch 
                checked={preferences["usage-alerts"]} 
                onCheckedChange={() => handleToggle("usage-alerts")}
                id="usage-alerts" 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Billing Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive invoices and payment confirmations.
                </p>
              </div>
              <Switch 
                checked={preferences["billing-notifications"]} 
                onCheckedChange={() => handleToggle("billing-notifications")}
                id="billing-notifications" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
} 