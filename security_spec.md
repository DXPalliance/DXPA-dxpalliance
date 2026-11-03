# Firestore Security Specification — Tdex Campaign Studio

## 1. Data Invariants & Master Source of Truth

1. **Identity Root (`/users/{userId}`)**:
   - Every authenticated human user with `email_verified == true` has a root profile at `/users/{userId}` where `userId == request.auth.uid`.
   - PII (`email`) is strictly isolated in `/users/{userId}/private/info` (Pillar 6 Split Collection) and guarded by parent existence (`exists(/users/{userId})` or `existsAfter(/users/{userId})` for atomic onboarding).
2. **Campaign Ownership (`/campaigns/{campaignId}`)**:
   - Every campaign document requires an existing owner profile (`exists(/users/$(request.auth.uid))`), sets `ownerId == request.auth.uid`, enforces strict `hasAll` + `hasOnly` scalar field schemas with `maxLength` bounds from `firebase-blueprint.json`, and enforces `createdAt == request.time` / `updatedAt == request.time`.
   - `ownerId` and `createdAt` are immutable across updates.
3. **CRM Connection Metadata (`/crmConnections/{connectionId}`)**:
   - Stores only non-secret connection state (`mailchimp`, `hubspot`, `salesforce`), never raw OAuth tokens or secrets.
   - Scoped strictly to `ownerId == request.auth.uid` with verified parent `/users/{uid}`.
4. **Scheduled Dispatches (`/scheduledDispatches/{dispatchId}`)**:
   - Cannot be created unless `/campaigns/$(incoming().campaignId)` exists AND is owned by `request.auth.uid` (Global Consistency Invariant #11).
   - Enforces **Terminal State Locking**: once `status` reaches `'sent'` or `'cancelled'`, all subsequent updates are rejected.
5. **Multi-Turn Chat History (`/chatMessages/{messageId}`)**:
   - Immutable (`allow update: if false`) owner-scoped messages (`ownerId == request.auth.uid`), deletable only by the verified owner when resetting a thread.

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Shadow Field Injection on Campaign Create**: `{ ...validCampaign, "isAdmin": true }` → Rejected by `data.keys().hasOnly(...)`.
2. **Unverified Email Write**: Authenticated user with `email_verified: false` writing `/campaigns/camp_1` → Rejected by `isVerifiedUser()`.
3. **Cross-Tenant Identity Spoofing**: User `uid_A` creating `/campaigns/camp_1` with `ownerId: "uid_B"` → Rejected by `data.ownerId == request.auth.uid`.
4. **PII Scrape Attempt**: Authenticated user `uid_B` calling `get(/users/uid_A/private/info)` → Rejected by `isOwner(userId)`.
5. **Unfiltered Collection List Scraping**: Client calling `getDocs(collection(db, 'campaigns'))` without `where('ownerId', '==', uid)` → Rejected by `resource.data.ownerId == request.auth.uid`.
6. **ID Poisoning (2KB Document ID)**: Creating `/campaigns/<2000-char-junk>` → Rejected by `isValidId(campaignId)` (`size() <= 128` & `^[a-zA-Z0-9_\-]+$`).
7. **Denial-of-Wallet 1MB Field Payload**: Updating `sec1Body` with a 500KB string → Rejected by `isValidCampaign(incoming())` (`sec1Body.size() <= 4000`).
8. **Orphaned Dispatch Creation**: Creating `/scheduledDispatches/disp_1` referencing nonexistent or foreign `campaignId` → Rejected by `exists(...) && get(...).data.ownerId == request.auth.uid`.
9. **Terminal State Reversal**: Updating `/scheduledDispatches/disp_1` from `status: 'sent'` back to `'scheduled'` → Rejected by `!(existing().status in ['sent', 'cancelled'])`.
10. **Immortal Field Tampering**: Updating `createdAt` or `ownerId` on an existing `/campaigns/camp_1` → Rejected by `incoming().ownerId == existing().ownerId && incoming().createdAt == existing().createdAt`.
11. **Forged Client Timestamp**: Creating `/chatMessages/msg_1` with backdated `createdAt` → Rejected by `incoming().createdAt == request.time`.
12. **Chat History Mutation**: Attempting `updateDoc` on `/chatMessages/msg_1` to rewrite assistant audit history → Rejected by `allow update: if false`.

## 3. Red Team Audit Conflict Report

- **Users & Private PII**: Passed Shadow Update, Email Spoofing, PII Blanket, and Resource Poisoning checks.
- **Campaigns**: Passed Query Trust (`resource.data.ownerId == request.auth.uid` with zero `get()` calls in `list`), Value Poisoning (`isValidCampaign(incoming())` wraps `allow update`), and Immortal Field checks.
- **CRM Connections**: Passed Enum allowlist (`['mailchimp', 'hubspot', 'salesforce']`) and Action-based update key gating.
- **Scheduled Dispatches**: Passed Relational Consistency check on `campaignId` and Terminal State Locking on `'sent'`/`'cancelled'`.
- **Chat Messages**: Passed Append-Only immutability and owner-isolated `list` enforcement.
