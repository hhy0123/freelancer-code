import type { SpecItem } from "@/lib/judge";

type Props = {
  token: string;
  project: any;
  items: SpecItem[];
  requests: any[];
  approvals: any[];
  freeUsed: number;
};

export default function OwnerView({ project, items, requests, approvals, freeUsed }: Props) {
  const undecided = items.filter((i) => !i.value.trim());
  const billed = requests.filter((r) => r.verdict === "paid");
  const total = billed.reduce((s, r) => s + r.fee, 0);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm text-neutral-500">{project.client_name || "클라이언트"} · 작업자 화면</p>
      <h1 className="text-2xl font-bold">{project.title}</h1>

      <div className="mt-4 rounded-xl border border-neutral-200 p-4">
        <p className="text-sm font-medium">클라이언트에게 보낼 링크</p>
        <code className="mt-1 block break-all rounded bg-neutral-100 px-3 py-2 text-xs">
          /p/{project.client_token}
        </code>
        <a
          href={`/p/${project.client_token}`}
          target="_blank"
          className="mt-2 inline-block text-sm font-medium underline"
        >
          클라이언트 화면 열기 →
        </a>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat label="미확정 항목" value={`${undecided.length}개`} warn={undecided.length > 0} />
        <Stat label="무료 수정" value={`${freeUsed} / ${project.free_revisions}회`} />
        <Stat label="추가 청구" value={`${total.toLocaleString("ko-KR")}원`} warn={total > 0} />
      </div>

      {undecided.length > 0 && (
        <p className="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          미확정 항목이 남아 있습니다. 이 항목들은 나중에 클라이언트가 바꿔도
          무료입니다. 작업 시작 전에 채우게 하세요.
        </p>
      )}

      <section className="mt-8">
        <h2 className="font-semibold">확정 항목</h2>
        <ul className="mt-3 divide-y divide-neutral-200 rounded-xl border border-neutral-200">
          {items.map((i) => (
            <li key={i.id} className="flex items-start justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-medium">{i.label}</p>
                <p className="text-sm text-neutral-500">{i.value || "— 미확정"}</p>
              </div>
              <span className="shrink-0 text-xs">
                {i.locked_at ? (
                  <span className="rounded bg-neutral-900 px-2 py-1 text-white">
                    🔒 {i.locked_by} · {new Date(i.locked_at).toLocaleDateString("ko-KR")}
                  </span>
                ) : i.value.trim() ? (
                  <span className="rounded bg-neutral-100 px-2 py-1 text-neutral-600">합의됨</span>
                ) : (
                  <span className="rounded bg-amber-100 px-2 py-1 text-amber-800">미확정</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {approvals.length > 0 && (
        <section className="mt-8">
          <h2 className="font-semibold">승인 이력</h2>
          <ul className="mt-2 space-y-1 text-sm text-neutral-600">
            {approvals.map((a) => (
              <li key={a.id}>
                {new Date(a.approved_at).toLocaleString("ko-KR")} — {a.stage} 승인
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="font-semibold">요청 내역</h2>
        <ul className="mt-3 space-y-2">
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
          {requests.length === 0 && <li className="text-sm text-neutral-500">아직 요청이 없습니다.</li>}
        </ul>
        {total > 0 && (
          <p className="mt-4 rounded-lg bg-neutral-900 px-4 py-3 text-right font-semibold text-white">
            추가 청구 합계 {total.toLocaleString("ko-KR")}원
          </p>
        )}
      </section>
    </main>
  );
}

function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${warn ? "border-amber-300 bg-amber-50" : "border-neutral-200"}`}>
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
