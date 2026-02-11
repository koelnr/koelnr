"use server";

import { z } from "zod";
import { adminDb } from "@/lib/firebase-admin";
import { generatePayUHash } from "@/lib/payu-hash";
import { payuConfig, payuCallbacks } from "@/lib/payu-config";
import type { CreateOrderData } from "@/types/payment";
import type { PayUFormData } from "@/lib/payu-redirect";
import { FieldValue } from "firebase-admin/firestore";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  service: z.string().min(1, "Please select a service"),
  vehicle: z.string().min(1, "Please select a vehicle type"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export async function submitContactForm(formData: ContactFormData) {
  try {
    // Validate the form data
    const validatedData = contactFormSchema.parse(formData);

    // TODO: Implement actual form submission logic
    // This could be:
    // - Send email via service like Resend, SendGrid, etc.
    // - Store in database
    // - Send to CRM
    // - Send notification via webhook

    console.log("Contact form submitted:", validatedData);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Please check your form inputs",
        errors: error.errors.reduce(
          (acc, err) => {
            acc[err.path[0]] = err.message;
            return acc;
          },
          {} as Record<string, string>,
        ),
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

// Auth Actions
// TODO: Integrate with Firebase Auth when ready

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type SignInData = z.infer<typeof signInSchema>;
export type SignUpData = z.infer<typeof signUpSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export async function signIn(formData: SignInData) {
  try {
    const validatedData = signInSchema.parse(formData);

    // TODO: Implement Firebase Auth signIn
    console.log("Sign in attempt:", validatedData.email);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Placeholder - will be replaced with actual Firebase auth
    return {
      success: true,
      message: "Sign in successful!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Please check your form inputs",
        errors: error.errors.reduce(
          (acc, err) => {
            acc[err.path[0]] = err.message;
            return acc;
          },
          {} as Record<string, string>,
        ),
      };
    }

    return {
      success: false,
      message: "Invalid email or password.",
    };
  }
}

export async function signUp(formData: SignUpData) {
  try {
    const validatedData = signUpSchema.parse(formData);

    if (validatedData.password !== validatedData.confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match",
        errors: { confirmPassword: "Passwords do not match" },
      };
    }

    // TODO: Implement Firebase Auth signUp
    console.log("Sign up attempt:", validatedData.email);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Placeholder - will be replaced with actual Firebase auth
    return {
      success: true,
      message: "Account created successfully!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Please check your form inputs",
        errors: error.errors.reduce(
          (acc, err) => {
            acc[err.path[0]] = err.message;
            return acc;
          },
          {} as Record<string, string>,
        ),
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function forgotPassword(formData: ForgotPasswordData) {
  try {
    const validatedData = forgotPasswordSchema.parse(formData);

    // TODO: Implement Firebase Auth password reset
    console.log("Password reset requested for:", validatedData.email);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Placeholder - will be replaced with actual Firebase auth
    return {
      success: true,
      message: "Password reset link sent to your email!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Please check your form inputs",
        errors: error.errors.reduce(
          (acc, err) => {
            acc[err.path[0]] = err.message;
            return acc;
          },
          {} as Record<string, string>,
        ),
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function signInWithGoogle() {
  // TODO: Implement Google OAuth with Firebase
  console.log("Google sign in attempt");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: "Signed in with Google!",
  };
}

// Payment Actions

const createOrderSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  type: z.enum(["subscription", "on_demand", "addon"]),
  items: z.array(
    z.object({
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
    }),
  ).min(1, "At least one item is required"),
  planName: z.string().optional(),
  vehicleType: z.enum(["hatchSedan", "suvMuv"]).optional(),
  customerInfo: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
  }),
});

export async function createPaymentOrder(data: CreateOrderData): Promise<{
  success: boolean;
  payuParams?: PayUFormData;
  payuUrl?: string;
  message?: string;
}> {
  try {
    // Validate input
    const validatedData = createOrderSchema.parse(data);

    // Calculate total amount
    const totalAmount = validatedData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Generate unique transaction ID
    const txnid = `TXN_${Date.now()}_${validatedData.userId.slice(0, 8)}`;

    // Create order in Firestore
    const orderRef = adminDb.collection("orders").doc();
    const orderId = orderRef.id;

    const orderData = {
      id: orderId,
      userId: validatedData.userId,
      type: validatedData.type,
      items: validatedData.items,
      totalAmount,
      currency: "INR" as const,
      status: "created" as const,
      paymentGateway: "payu" as const,
      payuTxnId: txnid,
      createdAt: FieldValue.serverTimestamp(),
    };

    await orderRef.set(orderData);

    // Generate PayU hash
    const amount = totalAmount.toFixed(2);
    const productinfo = validatedData.items.map((item) => item.name).join(", ");

    const hashParams = {
      key: payuConfig.merchantKey,
      txnid,
      amount,
      productinfo,
      firstname: validatedData.customerInfo.name,
      email: validatedData.customerInfo.email,
      udf1: orderId,
      udf2: validatedData.type,
      udf3: validatedData.planName || "",
      udf4: validatedData.vehicleType || "",
      udf5: validatedData.userId,
    };

    const hash = generatePayUHash(hashParams);

    // Prepare PayU form data
    const payuParams: PayUFormData = {
      key: payuConfig.merchantKey,
      txnid,
      amount,
      productinfo,
      firstname: validatedData.customerInfo.name,
      email: validatedData.customerInfo.email,
      phone: validatedData.customerInfo.phone,
      surl: payuCallbacks.success,
      furl: payuCallbacks.failure,
      hash,
      udf1: orderId,
      udf2: validatedData.type,
      udf3: validatedData.planName || "",
      udf4: validatedData.vehicleType || "",
      udf5: validatedData.userId,
    };

    return {
      success: true,
      payuParams,
      payuUrl: payuConfig.baseUrl,
    };
  } catch (error) {
    console.error("Error creating payment order:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Invalid order data: " + error.errors.map((e) => e.message).join(", "),
      };
    }

    return {
      success: false,
      message: "Failed to create payment order. Please try again.",
    };
  }
}
