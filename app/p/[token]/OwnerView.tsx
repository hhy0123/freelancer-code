import { headers } from "next/headers";
import QRCode from "qrcode";
import type { SpecItem } from "@/lib/judge";
import { cardShell, cardTitleBar, cardBody, input, btnPrimary, badgeLocked, badgeWarn, badgeOk } from "@/lib/styles";
import CopyLink from "./CopyLink";
import { ownerLock } from "@/app/actions";

type Props = {
  token: string;
  project: any;
  items: SpecItem[];
  requests: any[];
  approvals: any[];
  freeUsed: number;
};

type TimelineEvent =
  | { kind: "approval"; at: string; id: string; stage: string; triggeredBy: string }
  | { kind: "request"; at: string; id: string; body: string; verdict: string; reason: string; fee: number };

export default async function OwnerView({ token, project, items, requests, approvals, freeUsed }: Props) {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host");
  const clientUrl = `${proto}://${host}/p/${project.client_token}`;
  const clientQr = await QRCode.toDataURL(clientUrl, { margin: 1, width: 176 });

  const undecided = items.filter((i) => !i.value.trim());
  const unlocked = items.filter((i) => !i.locked_at);
  const billed = requests.filter((r) => r.verdict === "paid");
  const total = billed.reduce((s, r) => s + r.fee, 0);

  const timeline: TimelineEvent[] = [
    ...approvals.map((a) => ({
      kind: "approval" as const,
      at: a.approved_at,
      id: a.id,
      stage: a.stage,
      triggeredBy: a.triggered_by ?? "client",
    })),
    ...requests.map((r) => ({
      kind: "request" as const,
      at: r.created_at,
      id: r.id,
      body: r.body,
      verdict: r.verdict,
      reason: r.reason,
      fee: r.fee,
    })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at));

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">{project.client_name || "클라이언트"} · 작업자 화면</p>
          <h1 className="text-2xl font-bold tracking-tight text-black">{project.title}</h1>
        </div>
        <span className="shrink-0 rounded-full border-2 border-black bg-mint-300 px-3 py-1 text-xs font-bold text-black">
          👤 작업자
        </span>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border-2 border-black bg-white p-4 text-sm shadow-[4px_4px_0_0_#000]">
        <span className="text-lg leading-none">⚠️</span>
        <div className="flex-1">
          <p className="font-semibold text-black">이 페이지 링크를 반드시 저장하세요</p>
          <p className="mt-0.5 text-neutral-600">
            로그인이 없어서 이 URL을 잃어버리면 이 프로젝트로 다시 돌아올 방법이 없습니다.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 break-all rounded-lg border-2 border-black bg-mint-50 px-3 py-2 text-xs">
              /p/{project.owner_token}
            </code>
            <CopyLink path={`/p/${project.owner_token}`} />
          </div>
        </div>
      </div>

      <div className={`mt-4 ${cardShell}`}>
        <p className={cardTitleBar}>클라이언트에게 보낼 링크</p>
        <div className={`${cardBody} flex flex-col gap-4 sm:flex-row sm:items-start`}>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <code className="flex-1 break-all rounded-lg bg-neutral-100 px-3 py-2 text-xs">
                /p/{project.client_token}
              </code>
              <CopyLink path={`/p/${project.client_token}`} />
            </div>
            <a
              href={`/p/${project.client_token}`}
              target="_blank"
              className="mt-2 inline-block text-sm font-medium text-mint-700 hover:underline"
            >
              클라이언트 화면 열기 →
            </a>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-1 self-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={clientQr} alt="클라이언트 화면 QR 코드" width={110} height={110} className="rounded-lg border-2 border-black" />
            <p className="text-[11px] text-neutral-400">스캔해서 바로 전달</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat icon="📋" label="미확정 항목" value={`${undecided.length}개`} warn={undecided.length > 0} />
        <Stat icon="🆓" label="무료 수정" value={`${freeUsed} / ${project.free_revisions}회`} />
        <Stat icon="💰" label="추가 청구" value={`${total.toLocaleString("ko-KR")}원`} warn={total > 0} />
      </div>

      {undecided.length > 0 && (
        <p className="mt-3 rounded-xl border-2 border-dashed border-neutral-400 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          미확정 항목이 남아 있습니다. 이 항목들은 나중에 클라이언트가 바꿔도
          무료입니다. 작업 시작 전에 채우게 하세요.
        </p>
      )}

      <section className={`mt-6 ${cardShell}`}>
        <p className={cardTitleBar}>📋 확정 항목</p>
        <div className={cardBody}>
          <ul className="divide-y divide-neutral-100">
            {items.map((i) => (
              <li key={i.id} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium">{i.label}</p>
                  <p className="text-sm text-neutral-500">{i.value || "— 미확정"}</p>
                </div>
                <span className="shrink-0 text-xs">
                  {i.locked_at ? (
                    <span className={badgeLocked}>
                      {i.locked_by_role === "owner" ? "🔔" : "🔒"} {i.locked_by} ·{" "}
                      {new Date(i.locked_at).toLocaleDateString("ko-KR")}
                    </span>
                  ) : i.value.trim() ? (
                    <span className={badgeOk}>합의됨</span>
                  ) : (
                    <span className={badgeWarn}>미확정</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {unlocked.length > 0 && (
        <section className={`mt-6 ${cardShell}`}>
          <p className={cardTitleBar}>🔔 사전 확정 — 고객에게 보내기 전 고지</p>
          <div className={cardBody}>
            <p className="text-sm text-neutral-500">
              이미 계약서나 대화로 합의된 항목이 있다면 직접 채워 넣고 잠글 수 있습니다.
              클라이언트가 승인한 것이 아니라 <strong className="text-black">작업자가 사전에 확정한 것</strong>임이
              판정 문구에 그대로 남아 근거가 됩니다.
            </p>
            <form action={ownerLock.bind(null, token)} className="mt-4 space-y-3">
              {unlocked.map((i) => (
                <div key={i.id} className="flex items-start gap-2">
                  <label className="flex items-center gap-2 pt-2.5 text-xs text-neutral-500">
                    <input type="checkbox" name={`lock_${i.id}`} className="h-4 w-4 accent-mint-600" />
                    잠금
                  </label>
                  <label className="flex-1">
                    <span className="mb-1 block text-sm font-medium">{i.label}</span>
                    <input name={`item_${i.id}`} defaultValue={i.value} placeholder="값을 입력하면 잠글 수 있습니다" className={input} />
                  </label>
                </div>
              ))}
              <input name="stage" placeholder="사전 확정 사유 (예: 계약서 반영)" className={input} />
              <button className={btnPrimary}>선택한 항목 잠그고 고지하기</button>
            </form>
          </div>
        </section>
      )}

      <section className={`mt-6 ${cardShell}`}>
        <p className={cardTitleBar}>🕐 결정 타임라인</p>
        <div className={cardBody}>
          <p className="text-sm text-neutral-500">
            승인과 요청이 시간 순서대로 쌓입니다. 나중에 &quot;그런 말 없었다&quot;는 분쟁이 나올 수 없습니다.
          </p>
          <ol className="mt-4 space-y-3 border-l-2 border-neutral-200 pl-4">
            {timeline.map((e) => (
              <li key={`${e.kind}-${e.id}`} className="relative">
                <span
                  className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                    e.kind === "approval"
                      ? e.triggeredBy === "owner"
                        ? "bg-mint-500"
                        : "bg-black"
                      : e.verdict === "paid"
                        ? "bg-black"
                        : "bg-mint-500"
                  }`}
                />
                <p className="text-xs text-neutral-400">{new Date(e.at).toLocaleString("ko-KR")}</p>
                {e.kind === "approval" ? (
                  e.triggeredBy === "owner" ? (
                    <p className="mt-0.5 text-sm font-medium">
                      🔔 {e.stage} — 작업자가 사전에 확정해 고지함
                    </p>
                  ) : (
                    <p className="mt-0.5 text-sm font-medium">🔒 {e.stage} 승인 — 이 시점의 확정 항목이 전부 잠김</p>
                  )
                ) : (
                  <div className="mt-0.5 rounded-xl border-2 border-black px-3 py-2">
                    <div className="flex justify-between gap-3 text-sm">
                      <span>{e.body}</span>
                      <span
                        className={
                          e.verdict === "paid"
                            ? "shrink-0 rounded-md border-2 border-black bg-black px-2 py-0.5 text-xs font-semibold text-white"
                            : "shrink-0 rounded-md border-2 border-mint-600 bg-mint-100 px-2 py-0.5 text-xs font-semibold text-mint-700"
                        }
                      >
                        {e.verdict === "paid" ? `+${e.fee.toLocaleString("ko-KR")}원` : "무료"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">{e.reason}</p>
                  </div>
                )}
              </li>
            ))}
            {timeline.length === 0 && <li className="text-sm text-neutral-500">아직 기록이 없습니다.</li>}
          </ol>
          {total > 0 && (
            <p className="mt-4 rounded-xl border-2 border-black bg-black px-4 py-3 text-right font-semibold text-white">
              추가 청구 합계 {total.toLocaleString("ko-KR")}원
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function Stat({ icon, label, value, warn }: { icon: string; label: string; value: string; warn?: boolean }) {
  return (
    <div className={`rounded-2xl border-2 p-4 ${warn ? "border-black bg-mint-50" : "border-black bg-white shadow-[3px_3px_0_0_#000]"}`}>
      <p className="text-xs text-neutral-500">{icon} {label}</p>
      <p className="mt-1 text-lg font-semibold text-black">{value}</p>
    </div>
  );
}
