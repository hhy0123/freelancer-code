"use client";

import { useState } from "react";
import { judge, type SpecItem } from "@/lib/judge";
import { saveSpec, approve, submitRequest } from "@/app/actions";

type Props = {
  token: string;
  project: any;
  items: SpecItem[];
  requests: any[];
  freeUsed: number;
};

export default function ClientView({ token, project, items, requests, freeUsed }: Props) {
  const [target, setTarget] = useState<string>("");
  const undecided = items.filter((i) => !i.value.trim());

  const selected = items.find((i) => i.id === target) ?? null;
  const preview = target === "" ? null : judge(selected, freeUsed, project);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <p className="text-sm text-neutral-500">{project.client_name || "클라이언트"} 님</p>
      <h1 className="text-2xl font-bold">{project.title}</h1>

      <section className="mt-8">
        <h2 className="font-semibold">확정 항목</h2>
        <p className="mt-1 text-sm text-neutral-500">
          잠긴 항목을 되돌리는 요청은 추가 비용이 발생합니다. 비어 있는 항목은
          아직 확정되지 않았으므로 나중에 무료로 바꿀 수 있습니다.
        </p>

        {undecided.length > 0 && (
          <div className="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
            아직 <strong>{undecided.length}개</strong> 항목이 비어 있습니다. 모두
            채워야 작업을 시작할 수 있습니다.
          </div>
        )}

        <form action={saveSpec.bind(null, token)} className="mt-4 space-y-3">
          {items.map((i) => (
            <label key={i.id} className="block">
              <span className="mb-1 flex items-center gap-2 text-sm font-medium">
                {i.label}
                {i.locked_at && (
                  <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[11px] font-normal text-white">
                    🔒 확정 · {new Date(i.locked_at).toLocaleDateString("ko-KR")}
                  </span>
                )}
              </span>
              <input
                name={`item_${i.id}`}
                defaultValue={i.value}
                readOnly={!!i.locked_at}
                placeholder="미확정"
                className={`w-full rounded-lg border px-3 py-2 outline-none ${
                  i.locked_at
                    ? "border-neutral-200 bg-neutral-100 text-neutral-500"
                    : i.value.trim()
                      ? "border-neutral-300 focus:border-neutral-900"
                      : "border-amber-400 bg-amber-50 focus:border-amber-600"
                }`}
              />
            </label>
          ))}
          <button className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50">
            저장
          </button>
        </form>
      </section>

      <section className="mt-10 rounded-xl border border-neutral-200 p-5">
        <h2 className="font-semibold">단계 승인</h2>
        <p className="mt-1 text-sm text-neutral-500">
          승인하면 지금 채워진 항목이 모두 잠깁니다. 이후 변경은 유상입니다.
        </p>
        <form action={approve.bind(null, token)} className="mt-3 flex gap-2">
          <input
            name="stage"
            required
            placeholder="1차 검수"
            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
          />
          <button
            disabled={undecided.length > 0}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:bg-neutral-300"
          >
            승인하고 잠그기
          </button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="font-semibold">수정 요청</h2>
        <form action={submitRequest.bind(null, token)} className="mt-3 space-y-3">
          <select
            name="spec_item_id"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
          >
            <option value="" disabled>
              어떤 항목에 대한 요청인가요?
            </option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.locked_at ? "🔒 " : ""}
                {i.label}
              </option>
            ))}
            <option value="__new__">위 목록에 없는 새로운 요구</option>
          </select>

          {preview && (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                preview.verdict === "paid"
                  ? "bg-red-50 text-red-900"
                  : "bg-emerald-50 text-emerald-900"
              }`}
            >
              <div className="font-semibold">
                {preview.verdict === "paid"
                  ? `추가 비용 +${preview.fee.toLocaleString("ko-KR")}원`
                  : "무료 수정"}
              </div>
              <p className="mt-1 leading-relaxed">{preview.reason}</p>
            </div>
          )}

          <textarea
            name="body"
            required
            rows={3}
            placeholder="요청 내용"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
          />
          <button className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
            요청 보내기
          </button>
        </form>

        <ul className="mt-6 space-y-2">
          {requests.map((r) => (
            <li key={r.id} className="rounded-lg border border-neutral-200 px-4 py-3 text-sm">
              <div className="flex justify-between gap-3">
                <span>{r.body}</span>
                <span className={r.verdict === "paid" ? "shrink-0 font-semibold text-red-600" : "shrink-0 text-emerald-600"}>
                  {r.verdict === "paid" ? `+${r.fee.toLocaleString("ko-KR")}원` : "무료"}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">{r.reason}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
