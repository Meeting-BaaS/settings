"use client"

import { AlertCircle, Bell, Check, Info, Mail, RefreshCw } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define possible domain types and frequencies
type EmailDomain = 'reports' | 'announcements' | 'developers' | 'account';
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
  // {
  //   id: "meeting-summaries",
  //   name: "Meeting Summaries",
  //   description: "Automated summaries of your recorded meetings.",
  //   domain: "reports",
  //   frequencies: ["daily", "weekly", "monthly"]
  // },
  {
    id: "usage-reports",
    name: "Usage Reports",
    description: "Monthly reports on your Meeting BaaS usage and statistics.",
    domain: "reports",
    frequencies: ["daily", "weekly", "monthly"]
  },
  // {
  //   id: "ai-insights",
  //   name: "AI Insights",
  //   description: "AI-generated insights from your meeting transcripts.",
  //   domain: "reports",
  //   frequencies: ["weekly", "monthly"]
  // },

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
    frequencies: ["daily", "weekly", "monthly"]
  },
  {
    id: "developer-resources",
    name: "Developer Resources",
    description: "New resources, tutorials and documentation.",
    domain: "developers",
    frequencies: ["daily", "weekly", "monthly"]
  },
  // {
  //   id: "mcp-updates",
  //   name: "MCP Updates",
  //   description: "Updates to the Model Context Protocol (MCP) implementation.",
  //   domain: "developers",
  //   frequencies: ["weekly"]
  // },

  // Account notifications (required)
  {
    id: "security-alerts",
    name: "Security Alerts",
    description: "Important security notifications about your account.",
    domain: "account",
    frequencies: ["daily"],
    required: true
  },
  {
    id: "billing-notifications",
    name: "Billing Notifications",
    description: "Invoices and payment confirmations.",
    domain: "account",
    frequencies: ["daily", "weekly", "monthly"],
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
    badge: "text-blue-500 border-blue-200 bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
    name: "Reports",
    description: "Reports and metrics about your Meeting BaaS usage.",
    domain: "reports.meetingbaas.com"
  },
  announcements: {
    icon: <Bell className="h-4 w-4" />,
    color: "bg-green-500",
    badge: "text-green-500 border-green-200 bg-green-100 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
    name: "Announcements",
    description: "Product updates and important announcements.",
    domain: "announcements.meetingbaas.com"
  },
  developers: {
    icon: <Mail className="h-4 w-4" />,
    color: "bg-purple-500",
    badge: "text-purple-500 border-purple-200 bg-purple-100 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-400",
    name: "Developer Updates",
    description: "API updates and developer resources.",
    domain: "developers.meetingbaas.com"
  },
  account: {
    icon: <AlertCircle className="h-4 w-4" />,
    color: "bg-red-500",
    badge: "text-red-500 border-red-200 bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
    name: "Account",
    description: "Required notifications related to your account.",
    domain: "account.meetingbaas.com"
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
          // Instead of automatic unsubscribe, show the confirmation dialog
          setConfirmDialog({
            isOpen: true,
            emailId: unsubscribeType,
            emailName: emailType.name,
            newFrequency: 'none'
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

  // Function to handle service-level subscription changes
  const handleServiceSubscription = (domain: EmailDomain, frequency: EmailFrequency) => {
    // If unsubscribing from a service (setting to none)
    if (frequency === 'none') {
      // Show confirmation dialog for service-level unsubscribe
      setConfirmDialog({
        isOpen: true,
        emailId: `service-${domain}`,
        emailName: `all optional ${domainConfig[domain].name}`,
        newFrequency: 'none'
      });
      return;
    }

    // Otherwise, apply the selected frequency to all non-required emails in this service
    const emailsInDomain = getEmailsByDomain(domain);
    emailsInDomain.forEach(emailType => {
      if (!emailType.required) {
        // If the exact frequency is available, use it
        if (emailType.frequencies.includes(frequency)) {
          updatePreference(emailType.id, frequency);
        }
        // Otherwise, find the closest available frequency
        else if (emailType.frequencies.length > 0) {
          // Frequency priority order: daily -> weekly -> monthly -> none
          const frequencyOrder = ['daily', 'weekly', 'monthly', 'none'];
          const selectedIndex = frequencyOrder.indexOf(frequency);

          // Start by looking for frequencies with lower frequency (less frequent)
          let closestFrequency: EmailFrequency | undefined;

          // Look for less frequent options first (moving right in the array)
          for (let i = selectedIndex + 1; i < frequencyOrder.length; i++) {
            const option = frequencyOrder[i] as EmailFrequency;
            if (emailType.frequencies.includes(option)) {
              closestFrequency = option;
              break;
            }
          }

          // If no less frequent option, look for more frequent options (moving left in the array)
          if (!closestFrequency) {
            for (let i = selectedIndex - 1; i >= 0; i--) {
              const option = frequencyOrder[i] as EmailFrequency;
              if (emailType.frequencies.includes(option)) {
                closestFrequency = option;
                break;
              }
            }
          }

          // Apply the closest frequency found or the first available if nothing else works
          if (closestFrequency) {
            updatePreference(emailType.id, closestFrequency);
          } else {
            updatePreference(emailType.id, emailType.frequencies[0]);
          }
        }
      }
    });

    toast.success(`Updated all optional ${domainConfig[domain].name} preferences`);
  };

  // Function to check if all emails in a domain have the same frequency setting
  const getDomainFrequency = (domain: EmailDomain): EmailFrequency | 'mixed' => {
    // Only consider non-required emails for domain frequency
    const emailsInDomain = getEmailsByDomain(domain).filter(e => !e.required);

    // If there are no non-required emails in this domain, return 'none'
    if (emailsInDomain.length === 0) return 'none';

    const firstFreq = preferences[emailsInDomain[0].id];
    const allSame = emailsInDomain.every(e => preferences[e.id] === firstFreq);

    return allSame ? firstFreq : 'mixed';
  };

  // Modified handleConfirmUnsubscribe to handle service-level unsubscribes
  const handleConfirmUnsubscribe = () => {
    // Check if this is a service-level unsubscribe
    if (confirmDialog.emailId.startsWith('service-')) {
      const domain = confirmDialog.emailId.replace('service-', '') as EmailDomain;

      // Unsubscribe from all non-required emails in this domain
      const emailsInDomain = getEmailsByDomain(domain);
      emailsInDomain.forEach(emailType => {
        if (!emailType.required) {
          updatePreference(emailType.id, 'none');
        }
      });

      // Show success message
      setUnsubscribeSuccess({
        emailName: confirmDialog.emailName
      });
    } else {
      // Regular email-specific unsubscribe
      updatePreference(confirmDialog.emailId, 'none');

      // Show success message
      setUnsubscribeSuccess({
        emailName: confirmDialog.emailName
      });
    }

    setConfirmDialog({ isOpen: false, emailId: "", emailName: "", newFrequency: "none" });
  };

  // Function to determine if a specific domain should show service-wide controls
  const shouldShowServiceWideControls = (domain: EmailDomain): boolean => {
    // Don't show for account (all required) or reports (only one optional email)
    if (domain === 'account') return false;
    if (domain === 'reports') return false;

    // For other domains, show if there's more than one optional email
    const optionalEmails = getEmailsByDomain(domain).filter(e => !e.required);
    return optionalEmails.length > 1;
  };

  // Function to handle Resend Latest button click
  const handleResendLatest = (emailType: EmailType) => {
    // In a real app, you would call an API endpoint to resend the latest email
    toast.success(`Latest ${emailType.name} email will be resent shortly`);
  };

  // Function to render email preference with frequencies
  const renderEmailPreference = (emailType: EmailType) => {
    if (!(emailType.id in preferences)) return null;

    const currentFrequency = preferences[emailType.id];
    const isSelectable = !emailType.required || (emailType.required && emailType.frequencies.length > 1);

    return (
      <Card
        key={emailType.id}
        className={`bg-card/30 shadow-sm w-full mb-4 ${isSelectable ? 'hover:border-primary/50 transition-colors' : ''}`}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{emailType.name}</h4>
              {emailType.required && (
                <Badge variant="outline" className="text-xs py-0">Required</Badge>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleResendLatest(emailType);
              }}
              className="flex items-center text-xs text-primary hover:text-primary/80 p-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Resend Latest
            </button>
          </div>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            {emailType.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-2">
          <Label className="text-sm font-medium mb-2 block">Email Frequency</Label>
          <RadioGroup
            value={currentFrequency}
            onValueChange={(value) => handleFrequencyChange(emailType, value as EmailFrequency)}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3"
          >
            {emailType.frequencies.includes('daily') && (
              <label
                className={`flex items-center space-x-2 bg-muted/50 p-3 rounded-md hover:bg-muted/80 transition-colors cursor-pointer ${currentFrequency === 'daily' ? 'ring-1 ring-primary' : ''}`}
                htmlFor={`${emailType.id}-daily`}
              >
                <RadioGroupItem value="daily" id={`${emailType.id}-daily`} disabled={emailType.required && currentFrequency !== 'daily'} />
                <Label htmlFor={`${emailType.id}-daily`} className="text-sm cursor-pointer">Daily</Label>
              </label>
            )}

            {emailType.frequencies.includes('weekly') && (
              <label
                className={`flex items-center space-x-2 bg-muted/50 p-3 rounded-md hover:bg-muted/80 transition-colors cursor-pointer ${currentFrequency === 'weekly' ? 'ring-1 ring-primary' : ''}`}
                htmlFor={`${emailType.id}-weekly`}
              >
                <RadioGroupItem value="weekly" id={`${emailType.id}-weekly`} disabled={emailType.required && currentFrequency !== 'weekly'} />
                <Label htmlFor={`${emailType.id}-weekly`} className="text-sm cursor-pointer">Weekly</Label>
              </label>
            )}

            {emailType.frequencies.includes('monthly') && (
              <label
                className={`flex items-center space-x-2 bg-muted/50 p-3 rounded-md hover:bg-muted/80 transition-colors cursor-pointer ${currentFrequency === 'monthly' ? 'ring-1 ring-primary' : ''}`}
                htmlFor={`${emailType.id}-monthly`}
              >
                <RadioGroupItem value="monthly" id={`${emailType.id}-monthly`} disabled={emailType.required && currentFrequency !== 'monthly'} />
                <Label htmlFor={`${emailType.id}-monthly`} className="text-sm cursor-pointer">Monthly</Label>
              </label>
            )}

            {!emailType.required && (
              <label
                className={`flex items-center space-x-2 bg-muted/50 p-3 rounded-md hover:bg-muted/80 transition-colors cursor-pointer ${currentFrequency === 'none' ? 'ring-1 ring-primary' : ''}`}
                htmlFor={`${emailType.id}-none`}
              >
                <RadioGroupItem value="none" id={`${emailType.id}-none`} />
                <Label htmlFor={`${emailType.id}-none`} className="text-sm cursor-pointer">None</Label>
              </label>
            )}
          </RadioGroup>

          {currentFrequency !== 'none' && !emailType.required && (
            <p className="text-xs text-muted-foreground">
              You will receive {currentFrequency} emails.
            </p>
          )}
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

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Email Preferences</h1>
        <p className="text-muted-foreground mt-1">
          Manage which emails you receive from Meeting BaaS.
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="flex w-full mb-6">
          <TabsTrigger
            key="account"
            value="account"
            className="flex-1 flex items-center justify-center gap-2 relative group"
            style={{ minHeight: "40px" }}
          >
            <div className={`w-2 h-2 ${domainConfig.account.color} rounded-full`}></div>
            <span>{domainConfig.account.name}</span>
            <div className="absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300 ease-in-out" style={{ backgroundColor: `var(--account-color, #ef4444)` }}></div>
          </TabsTrigger>

          <TabsTrigger
            key="reports"
            value="reports"
            className="flex-1 flex items-center justify-center gap-2 relative group"
            style={{ minHeight: "40px" }}
          >
            <div className={`w-2 h-2 ${domainConfig.reports.color} rounded-full`}></div>
            <span>{domainConfig.reports.name}</span>
            <div className="absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300 ease-in-out" style={{ backgroundColor: `var(--reports-color, #3b82f6)` }}></div>
          </TabsTrigger>

          <TabsTrigger
            key="announcements"
            value="announcements"
            className="flex-1 flex items-center justify-center gap-2 relative group"
            style={{ minHeight: "40px" }}
          >
            <div className={`w-2 h-2 ${domainConfig.announcements.color} rounded-full`}></div>
            <span>{domainConfig.announcements.name}</span>
            <div className="absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300 ease-in-out" style={{ backgroundColor: `var(--announcements-color, #22c55e)` }}></div>
          </TabsTrigger>

          <TabsTrigger
            key="developers"
            value="developers"
            className="flex-1 flex items-center justify-center gap-2 relative group"
            style={{ minHeight: "40px" }}
          >
            <div className={`w-2 h-2 ${domainConfig.developers.color} rounded-full`}></div>
            <span>{domainConfig.developers.name}</span>
            <div className="absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300 ease-in-out" style={{ backgroundColor: `var(--developers-color, #a855f7)` }}></div>
          </TabsTrigger>
        </TabsList>

        {(Object.keys(domainConfig) as EmailDomain[]).map((domain) => (
          <TabsContent key={domain} value={domain} className="mt-0">
            {domain !== 'account' ? (
              <>
                <div className="flex items-center justify-between mb-6 p-4 bg-card/30 rounded-lg border border-border/50">
                  <div>
                    <h3 className="text-lg font-medium mb-1 flex items-center gap-2">
                      <div className={`w-3 h-3 ${domainConfig[domain].color} rounded-full`}></div>
                      {domainConfig[domain].name}
                    </h3>
                    <div className="flex items-center">
                      <Badge variant="outline" className={`${domainConfig[domain].badge} mr-2`}>
                        {domainConfig[domain].domain}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {domainConfig[domain].description}
                      </p>
                    </div>
                  </div>
                </div>

                {shouldShowServiceWideControls(domain) && (
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2 block">
                      Service-wide Frequency
                      <span className="text-xs font-normal ml-1 text-muted-foreground">(Optional emails only)</span>
                    </Label>
                    <RadioGroup
                      value={getDomainFrequency(domain) === 'mixed' ? '' : getDomainFrequency(domain)}
                      onValueChange={(value) => handleServiceSubscription(domain, value as EmailFrequency)}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2"
                    >
                      {domainConfig[domain].name !== "Security Alerts" && (
                        <>
                          <label
                            className={`flex items-center space-x-2 bg-muted/50 p-3 rounded-md hover:bg-muted/80 transition-colors cursor-pointer ${getDomainFrequency(domain) === 'daily' ? 'ring-1 ring-primary' : ''}`}
                            htmlFor={`service-${domain}-daily`}
                          >
                            <RadioGroupItem value="daily" id={`service-${domain}-daily`} />
                            <Label htmlFor={`service-${domain}-daily`} className="text-sm cursor-pointer">Daily</Label>
                          </label>
                          <label
                            className={`flex items-center space-x-2 bg-muted/50 p-3 rounded-md hover:bg-muted/80 transition-colors cursor-pointer ${getDomainFrequency(domain) === 'weekly' ? 'ring-1 ring-primary' : ''}`}
                            htmlFor={`service-${domain}-weekly`}
                          >
                            <RadioGroupItem value="weekly" id={`service-${domain}-weekly`} />
                            <Label htmlFor={`service-${domain}-weekly`} className="text-sm cursor-pointer">Weekly</Label>
                          </label>
                          <label
                            className={`flex items-center space-x-2 bg-muted/50 p-3 rounded-md hover:bg-muted/80 transition-colors cursor-pointer ${getDomainFrequency(domain) === 'monthly' ? 'ring-1 ring-primary' : ''}`}
                            htmlFor={`service-${domain}-monthly`}
                          >
                            <RadioGroupItem value="monthly" id={`service-${domain}-monthly`} />
                            <Label htmlFor={`service-${domain}-monthly`} className="text-sm cursor-pointer">Monthly</Label>
                          </label>
                          <label
                            className={`flex items-center space-x-2 bg-muted/50 p-3 rounded-md hover:bg-muted/80 transition-colors cursor-pointer ${getDomainFrequency(domain) === 'none' ? 'ring-1 ring-primary' : ''}`}
                            htmlFor={`service-${domain}-none`}
                          >
                            <RadioGroupItem value="none" id={`service-${domain}-none`} />
                            <Label htmlFor={`service-${domain}-none`} className="text-sm cursor-pointer">None</Label>
                          </label>
                        </>
                      )}
                      {getDomainFrequency(domain) === 'mixed' && (
                        <div className="text-xs text-muted-foreground mt-2">
                          Mixed settings (choose to make uniform)
                        </div>
                      )}
                    </RadioGroup>
                  </div>
                )}

                {getDomainFrequency(domain) !== 'none' && (
                  <div className="w-full space-y-4">
                    {getEmailsByDomain(domain).map(renderEmailPreference)}
                  </div>
                )}

                {getDomainFrequency(domain) === 'none' && (
                  <>
                    <div className="mb-6 text-center py-4 bg-muted/30 rounded-lg border border-border/50 text-muted-foreground">
                      <p>You've unsubscribed from all optional {domainConfig[domain].name} emails.</p>
                      <button
                        onClick={() => handleServiceSubscription(domain, 'monthly')}
                        className="text-sm text-primary underline mt-2 hover:text-primary/80"
                      >
                        Resubscribe
                      </button>
                    </div>

                    {/* Always show required emails, even when domain is set to 'none' */}
                    {getEmailsByDomain(domain)
                      .filter(email => email.required)
                      .map(renderEmailPreference)}
                  </>
                )}
              </>
            ) : (
              <>
                {/* Special layout for Account tab with required emails */}
                <div className="flex items-center justify-between mb-6 p-4 bg-card/30 rounded-lg border border-border/50">
                  <div>
                    <h3 className="text-lg font-medium mb-1 flex items-center gap-2">
                      <div className={`w-3 h-3 ${domainConfig[domain].color} rounded-full`}></div>
                      {domainConfig[domain].name}
                    </h3>
                    <div className="flex items-center">
                      <Badge variant="outline" className={`${domainConfig[domain].badge} mr-2`}>
                        {domainConfig[domain].domain}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {domainConfig[domain].description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6 bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2 text-amber-500 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <p className="text-sm font-medium">Required Notifications</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    These notifications cannot be disabled for security and billing purposes. You can adjust frequency where available.
                  </p>
                </div>

                <div className="w-full space-y-4">
                  {getEmailsByDomain(domain).map(renderEmailPreference)}
                </div>
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>

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