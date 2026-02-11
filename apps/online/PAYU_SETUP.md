# PayU Payment Integration Setup Guide

This guide explains how to set up and test the PayU payment integration in the Koelnr app.

## Prerequisites

1. **PayU Account**: Sign up for a PayU merchant account
2. **Firebase Project**: Set up Firebase with Firestore enabled
3. **Firebase Service Account**: Download service account JSON from Firebase Console

## Environment Variables Setup

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

### 1. Firebase Client SDK (Public)

Get these from Firebase Console > Project Settings > General:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 2. Firebase Admin SDK (Server-side)

Download service account key from Firebase Console > Project Settings > Service Accounts:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
```

**Important**: Keep the quotes and `\n` newline characters in the private key.

### 3. PayU Credentials

Get test credentials from PayU Dashboard:

```env
PAYU_MERCHANT_KEY=your_test_merchant_key
PAYU_MERCHANT_SALT=your_test_merchant_salt
PAYU_BASE_URL=https://test.payu.in/_payment
```

For production, change to:
```env
PAYU_BASE_URL=https://secure.payu.in/_payment
```

### 4. Application URL

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production, use your deployed URL (e.g., `https://koelnr.com`).

## Firestore Security Rules

Deploy these security rules to ensure users can only access their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if false; // Only server can write
    }

    match /subscriptions/{subId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if false; // Only server can write
    }
  }
}
```

## Testing the Integration

### 1. Start Development Server

```bash
bun run --cwd apps/online dev
```

### 2. Navigate to Subscriptions

Go to `http://localhost:3000/dashboard/subscriptions`

### 3. Select a Plan

- Choose a subscription plan (Smart 3D, Pro 6D, or Elite 6D)
- Select vehicle type (Hatch/Sedan or SUV/MUV)
- Click "Subscribe to [Plan Name]"

### 4. PayU Test Cards

Use these test card numbers on the PayU hosted checkout page:

**Success:**
- Card Number: `5123456789012346`
- CVV: `123`
- Expiry: Any future date
- Name: Any name

**Failure:**
- Card Number: `4111111111111111`
- CVV: `123`
- Expiry: Any future date
- Name: Any name

### 5. Verify Results

**Success Flow:**
1. Complete payment on PayU page
2. Redirected to `/dashboard/payments/success`
3. Check Firestore:
   - Order status updated to "paid"
   - Subscription created with status "active"

**Failure Flow:**
1. Cancel or use failure test card
2. Redirected to `/dashboard/payments/failure`
3. Check Firestore:
   - Order status updated to "failed"
   - No subscription created

## Payment Flow Architecture

```
User → Subscribe Button → Server Action (createPaymentOrder)
  ↓
Creates Order in Firestore (status: "created")
  ↓
Generates PayU Hash (SHA-512)
  ↓
Returns PayU Form Data
  ↓
Client → redirectToPayU() → PayU Hosted Page
  ↓
User Completes Payment
  ↓
PayU → Success/Failure Callback (API Route)
  ↓
Verify Hash
  ↓
Update Order Status in Firestore
  ↓
Create Subscription (if success)
  ↓
Redirect to Success/Failure Page
  ↓
PayU → Webhook (async notification)
  ↓
Verify Hash & Update Order (idempotent)
```

## Production Deployment Checklist

- [ ] Add all environment variables to hosting platform (Vercel/etc)
- [ ] Get production PayU credentials
- [ ] Update `PAYU_BASE_URL` to production URL
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Deploy Firestore security rules
- [ ] Configure webhook URL in PayU dashboard: `https://yourdomain.com/api/payments/webhook`
- [ ] Test with small real transaction (₹1)
- [ ] Monitor logs for errors
- [ ] Set up payment success/failure email notifications (optional)

## Webhook Configuration

In PayU Dashboard, configure the webhook URL:

```
https://yourdomain.com/api/payments/webhook
```

The webhook handler is idempotent and will not process duplicate payments.

## Troubleshooting

### Hash Verification Failed

- Check that `PAYU_MERCHANT_SALT` matches your PayU account
- Verify the hash generation formula is correct
- Check for extra spaces or special characters in environment variables

### Order Not Created

- Verify Firebase Admin SDK credentials are correct
- Check Firestore security rules allow server writes
- Look for errors in server logs

### Payment Stuck in "created" Status

- Check if success callback is accessible (not blocked by firewall)
- Verify webhook is configured in PayU dashboard
- Check webhook handler logs for errors

### Redirect Not Working

- Ensure `NEXT_PUBLIC_APP_URL` is correct
- Check for CORS issues in production
- Verify PayU allows redirects to your domain

## Support

For PayU-specific issues, refer to:
- [PayU Integration Docs](https://docs.payu.in/docs/prebuilt-checkout-page-integration)
- [PayU Hash Generation](https://docs.payu.in/docs/hash-generation)

For Firebase issues:
- [Firebase Admin SDK Docs](https://firebase.google.com/docs/admin/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
