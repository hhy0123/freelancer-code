import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import type { SpecItem } from "@/lib/judge";
import ClientView from "./ClientView";
import OwnerView from "./OwnerView";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const { data: p } = await db
    .from("project")
    .select("*")
    .or(`owner_token.eq.${token},client_token.eq.${token}`)
    .maybeSingle();
  if (!p) notFound();

  const [{ data: items }, { data: requests }, { data: approvals }] = await Promise.all([
    db.from("spec_item").select("*").eq("project_id", p.id).order("sort"),
    db.from("request").select("*").eq("project_id", p.id).order("created_at", { ascending: false }),
    db.from("approval").select("*").eq("project_id", p.id).order("approved_at"),
  ]);

  const props = {
    token,
    project: p,
    items: (items ?? []) as SpecItem[],
    requests: requests ?? [],
    approvals: approvals ?? [],
    freeUsed: (requests ?? []).filter((r) => r.verdict === "free").length,
  };

  return token === p.owner_token ? <OwnerView {...props} /> : <ClientView {...props} />;
}
