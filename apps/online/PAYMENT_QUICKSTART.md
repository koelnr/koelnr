# PayU Payment Integration - Quick Start

## 1. Install Dependencies ✅

Already done! `firebase-admin` has been installed.

## 2. Setup Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env.local
```

### Minimum Required Variables

```env
# Firebase Admin (get from Firebase Console > Service Accounts)
FIREBASE_PROJECT_ID=koelnr-9bd81
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@koelnr-9bd81.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key_Here\n-----END PRIVATE KEY-----\n"

# PayU Test Credentials (get from PayU Dashboard)
PAYU_MERCHANT_KEY=your_test_key
PAYU_MERCHANT_SALT=your_test_salt
PAYU_BASE_URL=https://test.payu.in/_payment

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Get Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (koelnr-9bd81)
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Copy the values to `.env.local`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters)

## 4. Get PayU Test Credentials

1. Sign up at [PayU India](https://payu.in/)
2. Get your test merchant key and salt from the dashboard
3. Add them to `.env.local`

**Don't have PayU account?** You can use these dummy values for local development (won't work for actual payments):

```env
PAYU_MERCHANT_KEY=gtKFFx
PAYU_MERCHANT_SALT=eCwWELxi
```

## 5. Deploy Firestore Security Rules

Create or update `firestore.rules` in your Firebase project:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders - users can only read their own
    match /orders/{orderId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if false; // Only server can write
    }

    // Subscriptions - users can only read their own
    match /subscriptions/{subId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if false; // Only server can write
    }
  }
}
```

Deploy the rules:

```bash
firebase deploy --only firestore:rules
```

## 6. Update Subscription Card with Real User Data

In `src/components/dashboard/subscription-card.tsx`, replace the placeholder user data:

```typescript
// TODO: Replace these with actual user data from auth context
const userId = "user_123"; // Get from useAuth() or similar
const userEmail = "user@example.com";
const userName = "John Doe";
const userPhone = "9876543210";
```

Example with context:

```typescript
import { useAuth } from "@/hooks/use-auth"; // Your auth hook

export function SubscriptionCard({ plan }: { plan: SubscriptionPlan }) {
  const { user } = useAuth(); // Get authenticated user

  const handleSubscribe = async () => {
    if (!user) {
      alert("Please sign in to subscribe");
      return;
    }

    const result = await createPaymentOrder({
      userId: user.uid,
      // ... rest of the data
      customerInfo: {
        name: user.displayName || "User",
        email: user.email || "",
        phone: user.phone || "",
      },
    });
    // ...
  };
  // ...
}
```

## 7. Start Development Server

```bash
bun run --cwd apps/online dev
```

## 8. Test the Payment Flow

1. Open http://localhost:3000/dashboard/subscriptions
2. Select a plan (e.g., Pro 6D)
3. Choose vehicle type (Hatch/Sedan or SUV/MUV)
4. Click "Subscribe to Pro 6D"
5. You should be redirected to PayU's test page

### Test Cards

**Success:**
```
Card: 5123456789012346
CVV: 123
Expiry: 12/2025
Name: Test User
```

**Failure:**
```
Card: 4111111111111111
CVV: 123
Expiry: 12/2025
Name: Test User
```

## 9. Verify in Firestore

After payment, check your Firestore collections:

### Orders Collection
```
orders/
  └── {orderId}
      ├── status: "paid"
      ├── payuTxnId: "TXN_1234567890_abc123"
      ├── payuPaymentId: "12345678"
      └── ... other fields
```

### Subscriptions Collection
```
subscriptions/
  └── {subId}
      ├── status: "active"
      ├── planName: "Pro 6D"
      ├── orderId: "{orderId}"
      └── ... other fields
```

## 10. Production Checklist

When ready to go live:

- [ ] Get production PayU credentials
- [ ] Update `PAYU_BASE_URL` to `https://secure.payu.in/_payment`
- [ ] Update `NEXT_PUBLIC_APP_URL` to your domain
- [ ] Add environment variables to Vercel/hosting platform
- [ ] Configure webhook URL in PayU dashboard:
  - URL: `https://yourdomain.com/api/payments/webhook`
- [ ] Test with ₹1 real transaction
- [ ] Monitor logs for any errors

## Troubleshooting

### "Cannot find module firebase-admin"

Make sure you installed dependencies:
```bash
bun install
```

### "Hash verification failed"

Check that your `PAYU_MERCHANT_SALT` is correct and matches your PayU account.

### "Order not created in Firestore"

1. Verify Firebase Admin credentials are correct
2. Check that the private key has `\n` newline characters
3. Look for errors in the server console

### "Payment stuck in 'created' status"

1. Check that callback URLs are accessible (not blocked by firewall)
2. Verify `NEXT_PUBLIC_APP_URL` is correct
3. Check the webhook configuration in PayU dashboard

## Need Help?

- Full setup guide: See `PAYU_SETUP.md`
- Implementation details: See `PAYMENT_IMPLEMENTATION.md`
- PayU docs: https://docs.payu.in/docs/prebuilt-checkout-page-integration
- Firebase docs: https://firebase.google.com/docs/admin/setup

## What's Next?

After basic setup works:

1. **Integrate with Authentication** - Replace placeholder user data
2. **Add Email Notifications** - Send confirmation emails
3. **Build Order History** - Show past payments to users
4. **Subscription Management** - Allow users to cancel/upgrade
5. **Error Monitoring** - Set up Sentry or similar for error tracking
