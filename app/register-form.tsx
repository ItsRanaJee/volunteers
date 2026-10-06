"use client";

import { useActionState } from "react";
import { registerVolunteer, type RegisterState } from "./actions";

const initial: RegisterState = { status: "idle" };

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerVolunteer, initial);

  if (state.status === "success") {
    return (
      <p role="status" className="rounded-md bg-emerald-50 p-4 text-emerald-900">
        {state.message}
      </p>
    );
  }

  const err = (name: string) => state.fieldErrors?.[name]?.[0];

  return (
    <form action={action} className="space-y-4" noValidate>
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-red-800">
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="full_name" className="mb-1 block text-sm font-medium">
          Full name *
        </label>
        <input id="full_name" name="full_name" required className={inputClass} />
        {err("full_name") && <p className="mt-1 text-sm text-red-700">{err("full_name")}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email *
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
        {err("email") && <p className="mt-1 text-sm text-red-700">{err("email")}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium">
          Phone
        </label>
        <input id="phone" name="phone" type="tel" className={inputClass} />
      </div>

      <div>
        <label htmlFor="availability" className="mb-1 block text-sm font-medium">
          Availability
        </label>
        <input
          id="availability"
          name="availability"
          placeholder="e.g. Weekends, weekday evenings"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="skills" className="mb-1 block text-sm font-medium">
          Skills / interests
        </label>
        <textarea id="skills" name="skills" rows={3} className={inputClass} />
      </div>

      {/* Honeypot: hidden from people and assistive tech, bots tend to fill it. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Register"}
      </button>
    </form>
  );
}
