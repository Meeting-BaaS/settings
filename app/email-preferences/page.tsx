"use client"

import { AlertCircle, Bell, Check, Info, Mail } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Define possible domain types and frequencies
type EmailDomain = 'reports' | 'announcements' | 'developers';
type EmailFrequency = 'daily' | 'weekly' | 'monthly' | 'none';

// These types would match your DB schema
interface EmailType {
  id: string;               // Database ID/slug
  name: string;             // Display name
  description: string;      // Description text
  domain: EmailDomain;      // Which domain sends this email
  frequencies: EmailFrequency[]; // Available frequencies
  required?: boolean;       // If true, can't be unsubscribed
}

// Email types that will match DB schema
const EMAIL_TYPES: EmailType[] = [
  // Reports (reports.meetingbaas.com)
  {
    id: "meeting-summaries",
    name: "Meeting Summaries",
    description: "Automated summaries of your recorded meetings.",
    domain: "reports",
    frequencies: ["daily", "weekly", "monthly"]
  },
  {
    id: "usage-metrics",
    name: "Usage Metrics",
    description: "Reports on your Meeting BaaS usage and statistics.",
    domain: "reports",
    frequencies: ["weekly", "monthly"]
  },
  {
    id: "ai-insights",
    name: "AI Insights",
    description: "AI-generated insights from your meeting transcripts.",
    domain: "reports",
    frequencies: ["weekly", "monthly"]
  },

  // Announcements (announcements.meetingbaas.com)
  {
    id: "product-updates",
    name: "Product Updates",
    description: "New features and improvements to the platform.",
    domain: "announcements",
    frequencies: ["weekly", "monthly"]
  },
  {
    id: "maintenance-notifications",
    name: "Maintenance Notifications",
    description: "Scheduled maintenance and system updates.",
    domain: "announcements",
    frequencies: ["daily"]
  },
  {
    id: "company-news",
    name: "Company News",
    description: "News and announcements about Meeting BaaS.",
    domain: "announcements",
    frequencies: ["monthly"]
  },

  // Developers (developers.meetingbaas.com)
  {
    id: "api-changes",
    name: "API Changes",
    description: "Updates and changes to the Meeting BaaS API.",
    domain: "developers",
    frequencies: ["weekly", "monthly"]
  },
  {
    id: "developer-resources",
    name: "Developer Resources",
    description: "New resources, tutorials and documentation.",
    domain: "developers",
    frequencies: ["monthly"]
  },
  {
    id: "mcp-updates",
    name: "MCP Updates",
    description: "Updates to the Model Context Protocol (MCP) implementation.",
    domain: "developers",
    frequencies: ["weekly"]
  },

  // Required notifications (mixed domains)
  {
    id: "security-alerts",
    name: "Security Alerts",
    description: "Important security notifications about your account.",
    domain: "announcements",
    frequencies: ["daily"],
    required: true
  },
  {
    id: "billing-notifications",
    name: "Billing Notifications",
    description: "Invoices and payment confirmations.",
    domain: "reports",
    frequencies: ["monthly"],
    required: true
  }
];

// Group email types by domain
const getEmailsByDomain = (domain: EmailDomain) => {
  return EMAIL_TYPES.filter(email => email.domain === domain);
};

// Find email type by ID
const findEmailTypeById = (id: string): EmailType | undefined => {
  return EMAIL_TYPES.find(type => type.id === id);
};

// Domain config for styling
const domainConfig = {
  reports: {
    icon: <Info className="h-4 w-4" />,
    color: "bg-blue-500",
    badge: "text-blue-500 border-blue-200 bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400"
  },
  announcements: {
    icon: <Bell className="h-4 w-4" />,
    color: "bg-green-500",
    badge: "text-green-500 border-green-200 bg-green-100 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
  },
  developers: {
    icon: <Mail className="h-4 w-4" />,
    color: "bg-purple-500",
    badge: "text-purple-500 border-purple-200 bg-purple-100 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-400"
  }
};

export default function EmailPreferencesPage() {
  const searchParams = useSearchParams();

  // State for preferences (email type ID → selected frequency)
  const [preferences, setPreferences] = useState<Record<string, EmailFrequency>>({});

  // Initialize preferences based on EMAIL_TYPES
  useEffect(() => {
    const initialPreferences: Record<string, EmailFrequency> = {};

    EMAIL_TYPES.forEach(emailType => {
      // Default to the first available frequency or 'none'
      initialPreferences[emailType.id] = emailType.frequencies[0] || 'none';
    });

    setPreferences(initialPreferences);
  }, []);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    emailId: string;
    emailName: string;
    newFrequency: EmailFrequency;
  }>({
    isOpen: false,
    emailId: "",
    emailName: "",
    newFrequency: "none"
  });

  const [unsubscribeSuccess, setUnsubscribeSuccess] = useState<{
    emailName: string;
    frequency?: EmailFrequency;
  } | null>(null);

  // Check for URL parameters - for handling unsubscribe links from emails
  useEffect(() => {
    const unsubscribeType = searchParams.get('unsubscribe');
    const frequency = searchParams.get('frequency') as EmailFrequency | null;
    const token = searchParams.get('token'); // In a real app, you'd validate this token

    if (unsubscribeType && token) {
      const emailType = findEmailTypeById(unsubscribeType);

      if (emailType) {
        if (emailType.required) {
          toast.error(`${emailType.name} notifications cannot be disabled for security reasons.`);
        } else {
          // Set to 'none' (unsubscribe)
          updatePreference(unsubscribeType, 'none');
          setUnsubscribeSuccess({
            emailName: emailType.name,
            frequency: frequency || undefined
          });
        }
      }
    }
  }, [searchParams]);

  const handleFrequencyChange = (emailType: EmailType, frequency: EmailFrequency) => {
    // If it's required, don't allow changing to 'none'
    if (emailType.required && frequency === 'none') {
      toast.error(`${emailType.name} notifications cannot be disabled for security reasons.`);
      return;
    }

    // If changing to 'none', show confirmation
    if (frequency === 'none' && !emailType.required) {
      setConfirmDialog({
        isOpen: true,
        emailId: emailType.id,
        emailName: emailType.name,
        newFrequency: frequency
      });
      return;
    }

    // Otherwise, update the preference
    updatePreference(emailType.id, frequency);
  };

  const updatePreference = (id: string, frequency: EmailFrequency) => {
    setPreferences((prev) => {
      const newPreferences = {
        ...prev,
        [id]: frequency
      };

      // In a real app, you would save this to the backend
      const emailType = findEmailTypeById(id);

      if (frequency === 'none') {
        toast.success(`Unsubscribed from ${emailType?.name || id} emails`);
      } else {
        const frequencyText = frequency.charAt(0).toUpperCase() + frequency.slice(1);
        toast.success(`Now receiving ${frequencyText} ${emailType?.name || id} emails`);
      }

      return newPreferences;
    });
  };

  const handleConfirmUnsubscribe = () => {
    updatePreference(confirmDialog.emailId, 'none');
    setConfirmDialog({ isOpen: false, emailId: "", emailName: "", newFrequency: "none" });
  };

  // Function to render email preference with frequencies
  const renderEmailPreference = (emailType: EmailType) => {
    if (!(emailType.id in preferences)) return null;

    return (
      <Card key={emailType.id} className="mb-4 bg-card/30 shadow-sm">
        <CardHeader className="p-4 pb-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{emailType.name}</h4>
              {emailType.required && (
                <Badge variant="outline" className="text-xs py-0">Required</Badge>
              )}
            </div>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            {emailType.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-2">
          <div className="mt-2">
            <Label className="text-sm font-medium mb-2 block">Email Frequency</Label>
            <RadioGroup
              value={preferences[emailType.id]}
              onValueChange={(value) => handleFrequencyChange(emailType, value as EmailFrequency)}
              className="flex flex-wrap gap-2"
            >
              {emailType.frequencies.includes('daily') && (
                <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded-md">
                  <RadioGroupItem value="daily" id={`${emailType.id}-daily`} disabled={emailType.required && preferences[emailType.id] !== 'daily'} />
                  <Label htmlFor={`${emailType.id}-daily`} className="text-xs cursor-pointer">Daily</Label>
                </div>
              )}

              {emailType.frequencies.includes('weekly') && (
                <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded-md">
                  <RadioGroupItem value="weekly" id={`${emailType.id}-weekly`} disabled={emailType.required && preferences[emailType.id] !== 'weekly'} />
                  <Label htmlFor={`${emailType.id}-weekly`} className="text-xs cursor-pointer">Weekly</Label>
                </div>
              )}

              {emailType.frequencies.includes('monthly') && (
                <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded-md">
                  <RadioGroupItem value="monthly" id={`${emailType.id}-monthly`} disabled={emailType.required && preferences[emailType.id] !== 'monthly'} />
                  <Label htmlFor={`${emailType.id}-monthly`} className="text-xs cursor-pointer">Monthly</Label>
                </div>
              )}

              {!emailType.required && (
                <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded-md">
                  <RadioGroupItem value="none" id={`${emailType.id}-none`} />
                  <Label htmlFor={`${emailType.id}-none`} className="text-xs cursor-pointer">None</Label>
                </div>
              )}
            </RadioGroup>

            {preferences[emailType.id] !== 'none' && !emailType.required && (
              <p className="text-xs text-muted-foreground mt-2">
                You will receive {preferences[emailType.id]} emails. Select "None" to unsubscribe.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // If preferences haven't loaded yet, show loading state
  if (Object.keys(preferences).length === 0) {
    return <div>Loading preferences...</div>;
  }

  return (
    <>
      {/* Success banner for unsubscribe from email link */}
      {unsubscribeSuccess && (
        <Card className="mb-6 border-green-500 bg-green-500/5">
          <CardContent className="flex flex-col gap-1 p-4">
            <div className="text-green-500 font-medium flex items-center gap-2">
              <Check className="h-4 w-4" />
              Successfully Unsubscribed
            </div>
            <p className="text-sm">
              You have been unsubscribed from {unsubscribeSuccess.emailName} emails.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Email Preferences</h1>
        <p className="text-muted-foreground mt-1">
          Manage which emails you receive from Meeting BaaS.
        </p>
      </div>

      <div className="space-y-12">
        {/* Reports Section */}
        <div>
          <div className="flex items-center mb-4">
            <div className={`w-3 h-3 ${domainConfig.reports.color} rounded-full mr-2`}></div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Reports
              <Badge variant="outline" className={domainConfig.reports.badge}>
                reports.meetingbaas.com
              </Badge>
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Reports and metrics about your Meeting BaaS usage.
          </p>

          <div className="grid gap-4">
            {getEmailsByDomain('reports').map(renderEmailPreference)}
          </div>
        </div>

        {/* Announcements Section */}
        <div>
          <div className="flex items-center mb-4">
            <div className={`w-3 h-3 ${domainConfig.announcements.color} rounded-full mr-2`}></div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Announcements
              <Badge variant="outline" className={domainConfig.announcements.badge}>
                announcements.meetingbaas.com
              </Badge>
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Product updates and important announcements.
          </p>

          <div className="grid gap-4">
            {getEmailsByDomain('announcements').map(renderEmailPreference)}
          </div>
        </div>

        {/* Developers Section */}
        <div>
          <div className="flex items-center mb-4">
            <div className={`w-3 h-3 ${domainConfig.developers.color} rounded-full mr-2`}></div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Developer Updates
              <Badge variant="outline" className={domainConfig.developers.badge}>
                developers.meetingbaas.com
              </Badge>
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            API updates and developer resources.
          </p>

          <div className="grid gap-4">
            {getEmailsByDomain('developers').map(renderEmailPreference)}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(isOpen: boolean) => {
          if (!isOpen) setConfirmDialog(prev => ({ ...prev, isOpen }));
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Confirm unsubscribe
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unsubscribe from <strong>{confirmDialog.emailName}</strong> emails?
              You may miss important updates related to your account or service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUnsubscribe}>
              Yes, unsubscribe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 