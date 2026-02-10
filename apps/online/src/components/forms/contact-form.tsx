"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { submitContactForm, type ContactFormData } from "@/app/actions";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data: ContactFormData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      service: formData.get("service") as string,
      vehicle: formData.get("vehicle") as string,
      message: formData.get("message") as string,
    };

    startTransition(async () => {
      const result = await submitContactForm(data);

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage({ type: "error", text: result.message });
        if (result.errors) {
          setErrors(result.errors);
        }
      }
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {message && (
        <div
          className={`rounded-md p-4 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Your phone"
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="service" className="mb-2 block text-sm font-medium">
          Interested In
        </label>
        <select
          id="service"
          name="service"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select an option</option>
          <option value="smart-3d">Smart 3D Subscription</option>
          <option value="pro-6d">Pro 6D Subscription</option>
          <option value="elite-6d">Elite 6D Subscription</option>
          <option value="on-demand">On-Demand Wash</option>
          <option value="deep-interior">Deep Interior</option>
        </select>
        {errors.service && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.service}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="vehicle" className="mb-2 block text-sm font-medium">
          Vehicle Type
        </label>
        <select
          id="vehicle"
          name="vehicle"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select vehicle type</option>
          <option value="hatch-sedan">Hatchback / Sedan</option>
          <option value="suv-muv">SUV / MUV</option>
        </select>
        {errors.vehicle && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.vehicle}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Your address, preferred slot, or any questions"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
