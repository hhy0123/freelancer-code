"use client";

import { useState } from "react";
import { judge, type SpecItem } from "@/lib/judge";
import { saveSpec, approve, submitRequest } from "@/app/actions";
import {
  pageTitle,
  cardShell,
  cardTitleBar,
  cardBody,
  eyebrowNum,
  input,
  textareaBox,
  btnPrimary,
  btnGhost,
  badgeLocked,
  verdictPaid,
  verdictFree,
} from "@/lib/styles";
import Stepper from "./Stepper";

type Props = {
  token: string;
  project: any;
  items: SpecItem[];
  requests: any[];
  approvals: any[];
  freeUsed: number;
};

export default function ClientView({ token, project, items, requests, approvals, freeUsed }: Props) {
  const [target, setTarget] = useState<string>("");
  const undecided = items.filter((i) => !i.value.trim());
  const step = undecided.length > 0 ? 0 : approvals.length === 0 ? 1 : 2;

  const selected = items.find((i) => i.id === target) ?? null;
  const preview = target === "" ? null : judge(selected, freeUsed, project);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">{project.client_name || "클라이언트"} 님</p>
          <h1 className={`text-2xl ${pageTitle}`}>{project.title}</h1>
        </div>
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-blue-600">
          🔓 Fix 진행 중
        </span>
      </div>

      <div className="mt-6">
        <Stepper step={step as 0 | 1 | 2} />
      </div>

      <section className={`mt-6 ${cardShell}`}>
        <p className={cardTitleBar}>
          <span className={eyebrowNum}>01</span> 확정 항목
        </p>
        <div className={cardBody}>
          <p className="text-sm text-neutral-500">
            잠긴 항목을 되돌리는 요청은 추가 비용이 발생합니다. 비어 있는 항목은
            아직 확정되지 않았으므로 나중에 무료로 바꿀 수 있습니다.
          </p>

          {undecided.length > 0 && (
            <div className="mt-3 rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
              아직 <strong className="font-medium text-blue-900">{undecided.length}개</strong> 항목이 비어 있습니다. 모두
              채워야 다음 단계로 넘어갑니다.
            </div>
          )}

          <form action={saveSpec.bind(null, token)} className="mt-4 space-y-3">
            {items.map((i) => (
              <label key={i.id} className="block">
                <span className="mb-1 flex items-center gap-2 text-sm font-medium">
                  {i.label}
                  {i.locked_at && (
                    <span className={badgeLocked}>
                      {i.locked_by_role === "owner" ? "🔔 작업자가 사전 확정" : "🔒 확정"} ·{" "}
                      {new Date(i.locked_at).toLocaleDateString("ko-KR")}
                    </span>
                  )}
                </span>
                <input
                  name={`item_${i.id}`}
                  defaultValue={i.value}
                  readOnly={!!i.locked_at}
                  placeholder="미확정"
                  className={`${input} ${
                    i.locked_at
                      ? "border-neutral-200 bg-neutral-50 text-neutral-500"
                      : i.value.trim()
                        ? ""
                        : "border-dashed border-neutral-300 bg-neutral-50"
                  }`}
                />
              </label>
            ))}
            <button className={btnGhost}>변경사항 저장</button>
          </form>
        </div>
      </section>

      <section className={`mt-6 ${cardShell}`}>
        <p className={cardTitleBar}>
          <span className={eyebrowNum}>02</span> 단계 승인
        </p>
        <div className={cardBody}>
          <p className="text-sm text-neutral-500">
            승인하면 지금 채워진 항목이 모두 잠깁니다. 이후 변경은 유상입니다.
          </p>
          <form action={approve.bind(null, token)} className="mt-3 flex flex-wrap gap-2">
            <input
              name="stage"
              required
              placeholder="1차 검수"
              className={`${input} flex-1 min-w-[10rem]`}
            />
            <button disabled={undecided.length > 0} className={btnPrimary}>
              승인하고 잠그기
            </button>
          </form>
        </div>
      </section>

      <section className={`mt-6 ${cardShell}`}>
        <p className={cardTitleBar}>
          <span className={eyebrowNum}>03</span> 수정 요청
        </p>
        <div className={cardBody}>
          <form action={submitRequest.bind(null, token)} className="space-y-3">
            <select
              name="spec_item_id"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className={input}
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
                className={`animate-[fadeIn_0.2s_ease-out] rounded-md px-4 py-3 text-sm ${
                  preview.verdict === "paid" ? verdictPaid : verdictFree
                }`}
              >
                <div className="font-semibold">
                  {preview.verdict === "paid"
                    ? `⚠️ 추가 비용 +${preview.fee.toLocaleString("ko-KR")}원`
                    : "✅ 무료 수정"}
                </div>
                <p className="mt-1 leading-relaxed">{preview.reason}</p>
              </div>
            )}

            <textarea
              name="body"
              required
              rows={3}
              placeholder="요청 내용"
              className={textareaBox}
            />
            <button className={btnPrimary}>요청 보내기</button>
          </form>

          <ul className="mt-6 divide-y divide-neutral-100">
            {requests.map((r) => (
              <li key={r.id} className="py-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span>{r.body}</span>
                  <span
                    className={
                      r.verdict === "paid"
                        ? "shrink-0 rounded-full bg-blue-900 px-2.5 py-0.5 text-xs font-semibold text-white"
                        : "shrink-0 rounded-full border border-blue-300 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700"
                    }
                  >
                    {r.verdict === "paid" ? `+${r.fee.toLocaleString("ko-KR")}원` : "무료"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">{r.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
