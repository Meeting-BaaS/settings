"use client"

import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { AlertCircle } from "lucide-react"
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
import { useSearchParams } from "next/navigation"

// Define possible domain types and frequencies
type EmailDomain = 'reports' | 'announcements' | 'developers';
type EmailFrequency = 'daily' | 'weekly' | 'monthly';

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

export default function EmailPreferencesPage() {
  const searchParams = useSearchParams();
  
  // State for preferences (email type ID + frequency)
  const [preferences, setPreferences] = useState<Record<string, Record<EmailFrequency, boolean>>>({});
  
  // Initialize preferences based on EMAIL_TYPES
  useEffect(() => {
    const initialPreferences: Record<string, Record<EmailFrequency, boolean>> = {};
    
    EMAIL_TYPES.forEach(emailType => {
      initialPreferences[emailType.id] = {
        daily: emailType.frequencies.includes('daily'),
        weekly: emailType.frequencies.includes('weekly'),
        monthly: emailType.frequencies.includes('monthly')
      };
    });
    
    setPreferences(initialPreferences);
  }, []);
  
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    emailId: string;
    emailName: string;
    frequency: EmailFrequency;
  }>({
    isOpen: false,
    emailId: "",
    emailName: "",
    frequency: "daily"
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
          // Auto-unsubscribe from URL parameter
          if (frequency && emailType.frequencies.includes(frequency)) {
            updatePreference(unsubscribeType, frequency, false);
            setUnsubscribeSuccess({
              emailName: emailType.name,
              frequency: frequency
            });
          } else {
            // Unsubscribe from all frequencies if no specific one is provided
            emailType.frequencies.forEach(freq => {
              updatePreference(unsubscribeType, freq, false);
            });
            setUnsubscribeSuccess({
              emailName: emailType.name
            });
          }
        }
      }
    }
  }, [searchParams]);

  const handleToggle = (emailType: EmailType, frequency: EmailFrequency) => {
    // If it's required, don't allow toggling
    if (emailType.required) {
      toast.error(`${emailType.name} notifications cannot be disabled for security reasons.`);
      return;
    }
    
    // If the email type doesn't support this frequency, don't toggle
    if (!emailType.frequencies.includes(frequency)) {
      return;
    }
    
    const currentValue = preferences[emailType.id]?.[frequency];
    
    // If turning off, show confirmation
    if (currentValue && !emailType.required) {
      setConfirmDialog({
        isOpen: true,
        emailId: emailType.id,
        emailName: emailType.name,
        frequency: frequency
      });
      return;
    }
    
    // If turning on, just do it
    updatePreference(emailType.id, frequency, true);
  };
  
  const updatePreference = (id: string, frequency: EmailFrequency, value: boolean) => {
    setPreferences(prev => {
      const newPreferences = { 
        ...prev,
        [id]: {
          ...prev[id],
          [frequency]: value
        }
      };
      
      // In a real app, you would save this to the backend
      const emailType = findEmailTypeById(id);
      const frequencyText = frequency.charAt(0).toUpperCase() + frequency.slice(1);
      
      toast.success(`${value ? 'Subscribed to' : 'Unsubscribed from'} ${frequencyText} ${emailType?.name || id}`);
      
      return newPreferences;
    });
  };
  
  const handleConfirmUnsubscribe = () => {
    updatePreference(confirmDialog.emailId, confirmDialog.frequency, false);
    setConfirmDialog({ isOpen: false, emailId: "", emailName: "", frequency: "daily" });
  };

  // Function to render email preference with frequencies
  const renderEmailPreference = (emailType: EmailType) => {
    if (!preferences[emailType.id]) return null;
    
    return (
      <div key={emailType.id} className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center">
              <h4 className="font-medium">{emailType.name}</h4>
              {emailType.required && (
                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Required</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {emailType.description}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 ml-6 mt-3">
          {emailType.frequencies.includes('daily') && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Daily</span>
              <Switch 
                checked={preferences[emailType.id]?.daily || false} 
                onCheckedChange={() => handleToggle(emailType, 'daily')}
                id={`${emailType.id}-daily`}
                disabled={emailType.required}
              />
            </div>
          )}
          
          {emailType.frequencies.includes('weekly') && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Weekly</span>
              <Switch 
                checked={preferences[emailType.id]?.weekly || false} 
                onCheckedChange={() => handleToggle(emailType, 'weekly')}
                id={`${emailType.id}-weekly`}
                disabled={emailType.required}
              />
            </div>
          )}
          
          {emailType.frequencies.includes('monthly') && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Monthly</span>
              <Switch 
                checked={preferences[emailType.id]?.monthly || false} 
                onCheckedChange={() => handleToggle(emailType, 'monthly')}
                id={`${emailType.id}-monthly`}
                disabled={emailType.required}
              />
            </div>
          )}
        </div>
        
        <Separator className="mt-4" />
      </div>
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
        <div className="mb-6 bg-green-500/10 border border-green-500 rounded-md p-4">
          <h3 className="text-green-500 font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            Successfully Unsubscribed
          </h3>
          <p className="text-sm mt-1">
            You have been unsubscribed from {unsubscribeSuccess.frequency 
              ? `${unsubscribeSuccess.frequency} ${unsubscribeSuccess.emailName} emails`
              : `all ${unsubscribeSuccess.emailName} emails`}.
          </p>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold">Email Preferences</h1>
        <p className="text-muted-foreground text-sm mt-1 mb-5">
          Manage which emails you receive from Meeting BaaS.
        </p>
      </div>
      
      <div className="space-y-8">
        {/* Reports Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Reports
            <span className="text-xs text-muted-foreground ml-2">(reports.meetingbaas.com)</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Reports and metrics about your Meeting BaaS usage.
          </p>
          
          <div>
            {getEmailsByDomain('reports').map(renderEmailPreference)}
          </div>
        </div>

        {/* Announcements Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Announcements
            <span className="text-xs text-muted-foreground ml-2">(announcements.meetingbaas.com)</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Product updates and important announcements.
          </p>
          
          <div>
            {getEmailsByDomain('announcements').map(renderEmailPreference)}
          </div>
        </div>

        {/* Developers Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Developer Updates
            <span className="text-xs text-muted-foreground ml-2">(developers.meetingbaas.com)</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            API updates and developer resources.
          </p>
          
          <div>
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
              Are you sure you want to unsubscribe from <strong>{confirmDialog.frequency} {confirmDialog.emailName}</strong> emails? 
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