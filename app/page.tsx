import { RegisterForm } from "./register-form";

export default function Home() {
  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Volunteer Registration</h1>
      <p className="mb-8 text-zinc-600 dark:text-zinc-400">
        Sign up to volunteer. Tell us when you&apos;re free and what you enjoy doing.
      </p>
      <RegisterForm />
    </main>
  );
}
