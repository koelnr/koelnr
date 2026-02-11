export const payuConfig = {
  merchantKey: process.env.PAYU_MERCHANT_KEY!,
  merchantSalt: process.env.PAYU_MERCHANT_SALT!,
  baseUrl: process.env.PAYU_BASE_URL || "https://test.payu.in/_payment",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

export const payuCallbacks = {
  success: `${payuConfig.appUrl}/api/payments/success`,
  failure: `${payuConfig.appUrl}/api/payments/failure`,
} as const;
