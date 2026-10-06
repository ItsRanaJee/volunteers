"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type RegisterState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(254),
  phone: z.string().trim().max(30).optional(),
  availability: z.string().trim().max(500).optional(),
  skills: z.string().trim().max(500).optional(),
});

export async function registerVolunteer(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  // Honeypot: real users never fill this hidden field. Pretend success to bots.
  if (formData.get("website")) {
    return { status: "success", message: "Thank you for registering!" };
  }

  const parsed = schema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    availability: formData.get("availability") || undefined,
    skills: formData.get("skills") || undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  // No .select(): anonymous users are not allowed to read rows back (RLS).
  const { error } = await supabase.from("volunteers").insert(parsed.data);

  if (error) {
    if (error.code === "23505") {
      return { status: "error", message: "This email is already registered." };
    }
    console.error("register failed", error.code, error.message);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  return { status: "success", message: "Thank you for registering! We'll be in touch." };
}
