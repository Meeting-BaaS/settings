# Meeting BaaS Email API: Backend/Frontend Integration Guide

## Overview
This document describes the current backend API endpoints for email preferences and service-based emails, and how they map to the frontend requirements. It also lists any remaining work needed for full compatibility.

---

## Current API Endpoints (Rust Backend)

### 1. Email Sending Endpoints (Dual Auth: JWT or API Key)
- `POST /email/weekly_report` — Send usage report
- `POST /email/payment_activation` — Send payment activation email
- `POST /email/insufficient_tokens` — Send insufficient tokens notification

### 2. Email Preferences Endpoints (JWT Auth Required)
- `GET /email/preferences` — Get all email preferences
- `POST /email/preferences` — Update all preferences
- `POST /email/preferences/:email_type` — Update frequency for a single email type
- `POST /email/preferences/service/:service_name` — Update frequency for all emails in a service domain
- `POST /email/preferences/batch` — Batch update preferences
- `POST /email/preferences/unsubscribe` — Unsubscribe with token
- `GET /email/types` — List available email types
- `POST /email/:email_type/resend` — Resend latest email of a given type

### 3. Service-based Email Endpoints (JWT or API Key)
- `POST /email/announcements/product_updates` — Send product updates
- `POST /email/announcements/maintenance` — Send maintenance notifications
- `POST /email/announcements/company_news` — Send company news
- `POST /email/developer/api_changes` — Send API changes
- `POST /email/developer/resources` — Send developer resources
- `POST /email/account/security` — Send security alerts
- `POST /email/account/billing` — Send billing notifications

---

## Mapping to Frontend API Spec

The following frontend API functions are supported by the backend:

| Frontend Function              | Backend Endpoint(s)                                 | Status      |
|-------------------------------|----------------------------------------------------|-------------|
| updateEmailFrequency          | POST /email/preferences/:email_type                 | ✅ Working  |
| updateServiceFrequency        | POST /email/preferences/service/:service_name       | ✅ Working  |
| unsubscribeWithToken          | POST /email/preferences/unsubscribe                 | ✅ Working  |
| getEmailPreferences           | GET /email/preferences                              | ✅ Working  |
| resendLatestEmail             | POST /email/:email_type/resend                      | ✅ Working  |
| batchUpdatePreferences        | POST /email/preferences/batch                       | ✅ Working  |
| getAvailableEmailTypes        | GET /email/types                                    | ✅ Working  |

### Service-based Email Sending
- All service-based emails (announcements, developer updates, account) have dedicated endpoints as listed above.
- These are not directly called by the frontend UI, but are used for admin/ops or triggered actions.

---

## Remaining Work / TODOs

- **Ensure all endpoints return consistent JSON responses** (success, error, message fields) for easier frontend integration.
- **Document request/response schemas** for each endpoint (see handler.rs for details).
- **Add OpenAPI/Swagger documentation** for easier frontend consumption (optional but recommended).
- **Unify error handling and status codes** (currently some endpoints may return only status code, not JSON).
- **Frontend:** Replace all mock API calls with real API endpoints as listed above.
- **Frontend:** Use the `/email/preferences` and `/email/types` endpoints for managing preferences and available types.
- **Backend:** Ensure all new email types and frequencies are reflected in `/email/types`.

---

## Example: Update Email Frequency

**Request:**
```
POST /email/preferences/:email_type
Authorization: Bearer <JWT> or x-meeting-baas-api-key: <API_KEY>
Content-Type: application/json

{
  "frequency": "weekly"
}
```
**Response:**
```
{
  "success": true
}
```

---

## Contact
For questions or to request new endpoints, contact the backend team or open an issue in the repo.
