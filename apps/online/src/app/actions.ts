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
