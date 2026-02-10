import {
  createOrder,
  updateOrderStatus,
  createSubscription,
} from "./firestore";

export interface PaymentConfig {
  type: "subscription" | "on_demand" | "addon";
  planName?: string;
  serviceName?: string;
  items: { name: string; price: number; quantity: number }[];
  totalAmount: number;
  vehicleType: "hatchSedan" | "suvMuv";
  scheduledSlot?: string;
  scheduledDate?: string;
  userId: string;
}

function generatePaymentId(): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `mock_pay_${Date.now()}_${random}`;
}

export async function initiatePayment(
  config: PaymentConfig,
): Promise<{ success: boolean; orderId: string }> {
  // 1. Create order in Firestore
  const orderId = await createOrder({
    userId: config.userId,
    type: config.type,
    items: config.items,
    totalAmount: config.totalAmount,
    scheduledSlot: config.scheduledSlot,
    scheduledDate: config.scheduledDate,
  });

  // 2. Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 3. Mark order as paid
  const paymentId = generatePaymentId();
  await updateOrderStatus(orderId, "paid", paymentId);

  // 4. Create subscription if needed
  if (config.type === "subscription" && config.planName) {
    await createSubscription({
      userId: config.userId,
      planName: config.planName,
      vehicleType: config.vehicleType,
      monthlyPrice: config.totalAmount,
      paymentId,
    });
  }

  return { success: true, orderId };
}
