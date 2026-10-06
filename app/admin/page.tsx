import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // RLS only returns rows if this user is listed in public.admins.
  const { data: volunteers, error } = await supabase
    .from("volunteers")
    .select("id, full_name, email, phone, availability, skills, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Registrations ({volunteers?.length ?? 0})</h1>
        <form action={logout}>
          <button className="rounded-md border px-3 py-1 text-sm">Sign out</button>
        </form>
      </div>

      {error && <p className="text-red-700">Could not load registrations.</p>}
      {!error && volunteers?.length === 0 && (
        <p className="text-zinc-600">
          No registrations yet. If you expected some, make sure your user is in the admins table.
        </p>
      )}

      {volunteers && volunteers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Availability</th>
                <th className="py-2 pr-4">Skills</th>
                <th className="py-2">Registered</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v) => (
                <tr key={v.id} className="border-b align-top">
                  <td className="py-2 pr-4">{v.full_name}</td>
                  <td className="py-2 pr-4">{v.email}</td>
                  <td className="py-2 pr-4">{v.phone}</td>
                  <td className="py-2 pr-4">{v.availability}</td>
                  <td className="py-2 pr-4">{v.skills}</td>
                  <td className="py-2">{new Date(v.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
