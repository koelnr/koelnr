import { httpsCallable } from "firebase/functions";
import { getFunctions } from "firebase/functions";
import { app } from "./firebase";

const functions = getFunctions(app, "asia-south1");

const createOrderFn = httpsCallable<
  {
    type: "subscription" | "on_demand" | "addon";
    planName?: string;
    serviceName?: string;
    items: { name: string; price: number; quantity: number }[];
    totalAmount: number;
    vehicleType: "hatchSedan" | "suvMuv";
    scheduledSlot?: string;
    scheduledDate?: string;
  },
  {
    razorpayOrderId: string;
    orderId: string;
    amount: number;
    currency: string;
  }
>(functions, "createOrder");

const verifyPaymentFn = httpsCallable<
  {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderId: string;
  },
  { success: boolean; orderId: string }
>(functions, "verifyPayment");

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.head.appendChild(script);
  });
}

export interface PaymentConfig {
  type: "subscription" | "on_demand" | "addon";
  planName?: string;
  serviceName?: string;
  items: { name: string; price: number; quantity: number }[];
  totalAmount: number;
  vehicleType: "hatchSedan" | "suvMuv";
  scheduledSlot?: string;
  scheduledDate?: string;
  userName: string;
  userEmail: string;
}

export async function initiatePayment(
  config: PaymentConfig,
): Promise<{ success: boolean; orderId: string }> {
  // 1. Create order via Cloud Function
  const { data } = await createOrderFn({
    type: config.type,
    planName: config.planName,
    serviceName: config.serviceName,
    items: config.items,
    totalAmount: config.totalAmount,
    vehicleType: config.vehicleType,
    scheduledSlot: config.scheduledSlot,
    scheduledDate: config.scheduledDate,
  });

  // 2. Load Razorpay checkout script
  await loadRazorpayScript();

  // 3. Open Razorpay checkout modal
  return new Promise((resolve, reject) => {
    const options: RazorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Koelnr",
      description:
        config.type === "subscription"
          ? `${config.planName} Subscription`
          : config.items.map((i) => i.name).join(", "),
      order_id: data.razorpayOrderId,
      prefill: {
        name: config.userName,
        email: config.userEmail,
      },
      theme: { color: "#0a0a0a" },
      handler: async (response) => {
        try {
          // 4. Verify payment via Cloud Function
          const { data: verifyData } = await verifyPaymentFn({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            orderId: data.orderId,
          });
          resolve({ success: true, orderId: verifyData.orderId });
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => {
          resolve({ success: false, orderId: data.orderId });
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  });
}
