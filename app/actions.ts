"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { PRESETS } from "@/lib/presets";
import { judge, type SpecItem } from "@/lib/judge";

export async function createProject(fd: FormData) {
  const kind = String(fd.get("kind") || "dev");
  const preset = PRESETS[kind] ?? PRESETS.dev;
  const owner_token = crypto.randomUUID();

  const { data: p, error } = await db
    .from("project")
    .insert({
      title: String(fd.get("title") || "이름 없는 프로젝트"),
      client_name: String(fd.get("client_name") || ""),
      kind,
      owner_token,
      client_token: crypto.randomUUID(),
      free_revisions: Number(fd.get("free_revisions") || 2),
      change_fee: Number(fd.get("change_fee") || 50000),
    })
    .select("id")
    .single();
  if (error) throw error;

  await db.from("spec_item").insert(
    preset.items.map((label, sort) => ({ project_id: p.id, label, sort }))
  );

  redirect(`/p/${owner_token}`);
}

async function load(token: string) {
  const { data: p } = await db
    .from("project")
    .select("*")
    .or(`owner_token.eq.${token},client_token.eq.${token}`)
    .maybeSingle();
  return p;
}

export async function saveSpec(token: string, fd: FormData) {
  const p = await load(token);
  if (!p) throw new Error("not found");

  const { data: items } = await db
    .from("spec_item")
    .select("id, locked_at")
    .eq("project_id", p.id);

  for (const it of items ?? []) {
    if (it.locked_at) continue; // 잠긴 항목은 여기서 못 바꾼다
    const v = fd.get(`item_${it.id}`);
    if (v === null) continue;
    await db.from("spec_item").update({ value: String(v) }).eq("id", it.id);
  }
  revalidatePath(`/p/${token}`);
}

/** 승인 = 그 시점에 채워져 있는 항목 전부를 잠그는 행위 */
export async function approve(token: string, fd: FormData) {
  const p = await load(token);
  if (!p) throw new Error("not found");
  const stage = String(fd.get("stage") || "검수");

  await db.from("approval").insert({ project_id: p.id, stage });
  const { data: items } = await db
    .from("spec_item")
    .select("id, value, locked_at")
    .eq("project_id", p.id);

  const now = new Date().toISOString();
  for (const it of items ?? []) {
    if (it.locked_at || !it.value.trim()) continue;
    await db.from("spec_item").update({ locked_at: now, locked_by: stage }).eq("id", it.id);
  }
  await db.from("project").update({ started: true }).eq("id", p.id);
  revalidatePath(`/p/${token}`);
}

export async function submitRequest(token: string, fd: FormData) {
  const p = await load(token);
  if (!p) throw new Error("not found");

  const raw = String(fd.get("spec_item_id") || "");
  const itemId = raw === "__new__" ? "" : raw;
  const body = String(fd.get("body") || "").trim();
  if (!body) return;

  // 판정은 서버에서 다시 한다. 클라이언트 미리보기는 표시용일 뿐.
  let item: SpecItem | null = null;
  if (itemId) {
    const { data } = await db
      .from("spec_item")
      .select("id, label, value, locked_at, locked_by")
      .eq("id", itemId)
      .eq("project_id", p.id)
      .maybeSingle();
    item = data as SpecItem | null;
  }

  const { count } = await db
    .from("request")
    .select("id", { count: "exact", head: true })
    .eq("project_id", p.id)
    .eq("verdict", "free");

  const v = judge(item, count ?? 0, p);
  await db.from("request").insert({
    project_id: p.id,
    spec_item_id: item?.id ?? null,
    body,
    ...v,
  });
  revalidatePath(`/p/${token}`);
}
