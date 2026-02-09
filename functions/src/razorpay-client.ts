import Razorpay from "razorpay";
import { defineString } from "firebase-functions/params";

const razorpayKeyId = defineString("RAZORPAY_KEY_ID");
const razorpayKeySecret = defineString("RAZORPAY_KEY_SECRET");

let instance: InstanceType<typeof Razorpay> | null = null;

export function getRazorpay(): InstanceType<typeof Razorpay> {
  if (!instance) {
    instance = new Razorpay({
      key_id: razorpayKeyId.value(),
      key_secret: razorpayKeySecret.value(),
    });
  }
  return instance;
}

export function getRazorpayKeySecret(): string {
  return razorpayKeySecret.value();
}
