"use server";

import { z } from "zod";

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
