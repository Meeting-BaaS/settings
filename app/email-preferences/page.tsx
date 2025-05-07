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

// These types would match your DB schema
type EmailCategory = 'announcements' | 'account' | 'usage';

interface EmailType {
  id: string;           // Database ID/slug
  name: string;         // Display name
  description: string;  // Description text
  category: EmailCategory;
  required?: boolean;   // If true, can't be unsubscribed
}

// Email types that will match DB schema
const EMAIL_TYPES: EmailType[] = [
  {
    id: "product-updates",
    name: "Product Updates",
    description: "Receive emails about new features and improvements.",
    category: "announcements"
  },
  {
    id: "news-announcements", 
    name: "News & Announcements",
    description: "General company announcements and news.",
    category: "announcements"
  },
  {
    id: "maintenance-notifications",
    name: "Maintenance Notifications",
    description: "Get notified about scheduled maintenance and downtime.",
    category: "announcements"
  },
  {
    id: "security-alerts",
    name: "Security Alerts",
    description: "Important security notifications about your account.",
    category: "account",
    required: true
  },
  {
    id: "account-activity",
    name: "Account Activity",
    description: "Login attempts, password changes, and other account activities.",
    category: "account"
  },
  {
    id: "monthly-summary",
    name: "Monthly Summary",
    description: "Monthly reports summarizing your usage and charges.",
    category: "usage"
  },
  {
    id: "usage-alerts",
    name: "Usage Alerts",
    description: "Get notified when you reach usage thresholds.",
    category: "usage"
  },
  {
    id: "billing-notifications",
    name: "Billing Notifications",
    description: "Receive invoices and payment confirmations.",
    category: "usage",
    required: true
  }
];

// Group email types by category
const getEmailsByCategory = (category: EmailCategory) => {
  return EMAIL_TYPES.filter(email => email.category === category);
};

// Find email type by ID
const findEmailTypeById = (id: string): EmailType | undefined => {
  return EMAIL_TYPES.find(type => type.id === id);
};

export default function EmailPreferencesPage() {
  const searchParams = useSearchParams();
  const [preferences, setPreferences] = useState<Record<string, boolean>>(
    Object.fromEntries(
      EMAIL_TYPES.map(type => [type.id, true])
    )
  );
  
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    emailId: string;
    emailName: string;
  }>({
    isOpen: false,
    emailId: "",
    emailName: ""
  });

  const [unsubscribeSuccess, setUnsubscribeSuccess] = useState<string | null>(null);

  // Check for URL parameters - for handling unsubscribe links from emails
  useEffect(() => {
    const unsubscribeType = searchParams.get('unsubscribe');
    const token = searchParams.get('token'); // In a real app, you'd validate this token
    
    if (unsubscribeType && token) {
      const emailType = findEmailTypeById(unsubscribeType);
      
      if (emailType) {
        if (emailType.required) {
          toast.error(`${emailType.name} notifications cannot be disabled for security reasons.`);
        } else {
          // Auto-unsubscribe from URL parameter
          updatePreference(unsubscribeType, false);
          setUnsubscribeSuccess(emailType.name);
        }
      }
    }
  }, [searchParams]);

  const handleToggle = (emailType: EmailType) => {
    // If it's required, don't allow toggling
    if (emailType.required) {
      toast.error(`${emailType.name} notifications cannot be disabled for security reasons.`);
      return;
    }
    
    const currentValue = preferences[emailType.id];
    
    // If turning off, show confirmation
    if (currentValue && !emailType.required) {
      setConfirmDialog({
        isOpen: true,
        emailId: emailType.id,
        emailName: emailType.name
      });
      return;
    }
    
    // If turning on, just do it
    updatePreference(emailType.id, true);
  };
  
  const updatePreference = (id: string, value: boolean) => {
    setPreferences(prev => {
      const newPreferences = { ...prev, [id]: value };
      
      // In a real app, you would save this to the backend
      toast.success(`${value ? 'Subscribed to' : 'Unsubscribed from'} ${id.split('-').join(' ')}`);
      
      return newPreferences;
    });
  };
  
  const handleConfirmUnsubscribe = () => {
    updatePreference(confirmDialog.emailId, false);
    setConfirmDialog({ isOpen: false, emailId: "", emailName: "" });
  };

  // Function to render email preference section
  const renderEmailPreference = (emailType: EmailType) => (
    <div key={emailType.id}>
      <div className="flex items-center justify-between">
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
        <Switch 
          checked={preferences[emailType.id]} 
          onCheckedChange={() => handleToggle(emailType)}
          id={emailType.id}
          disabled={emailType.required}
        />
      </div>
      <Separator className="my-4" />
    </div>
  );

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
            You have been unsubscribed from {unsubscribeSuccess} emails.
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
        {/* Announcements Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Announcements</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Stay informed about new features, updates, and announcements.
          </p>
          
          <div>
            {getEmailsByCategory('announcements').map(renderEmailPreference)}
          </div>
        </div>

        {/* Account Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Account Notifications</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Notifications related to your account activity and security.
          </p>
          
          <div>
            {getEmailsByCategory('account').map(renderEmailPreference)}
          </div>
        </div>

        {/* Usage Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Usage Reports</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Receive reports about your Meeting BaaS usage and billing.
          </p>
          
          <div>
            {getEmailsByCategory('usage').map(renderEmailPreference)}
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