import { createProject } from "./actions";
import { PRESETS } from "@/lib/presets";
import { card, input, btnPrimary } from "@/lib/styles";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
        🔒 확정 잠금
      </span>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900">
        어디까지가 계약 범위인가
      </h1>
      <p className="mt-4 leading-relaxed text-neutral-600">
        외주에서 돈을 못 받는 이유는 일을 못해서가 아니라, 어디까지가 일인지
        아무도 정하지 않아서입니다. 이 도구는 수정 횟수를 세지 않습니다.{" "}
        <strong className="text-neutral-900">확정된 결정을 잠그고</strong>, 그
        결정을 되돌리는 요청만 유상으로 판정합니다.
      </p>

      <ol className="mt-8 grid gap-3 sm:grid-cols-3">
        <HowStep n={1} title="항목을 확정한다" desc="클라이언트가 체크리스트를 채운다" />
        <HowStep n={2} title="승인하면 잠긴다" desc="채워진 항목이 그 순간 잠긴다" />
        <HowStep n={3} title="번복은 유상" desc="잠긴 항목 변경만 자동으로 청구된다" />
      </ol>

      <div className={`mt-8 ${card} border-rose-100 bg-rose-50/40`}>
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">예시 판정</p>
        <p className="mt-2 text-sm text-neutral-800">
          &quot;지원 브라우저&quot;는 9월 20일 1차 검수에서 이미 승인·잠금됨
        </p>
        <div className="mt-2 flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm shadow-sm">
          <span className="text-neutral-600">“역시 IE11도 지원해주세요”</span>
          <span className="font-semibold text-rose-600">+50,000원</span>
        </div>
      </div>

      <form action={createProject} className="mt-8 space-y-4">
        <Field label="프로젝트명">
          <input name="title" required placeholder="○○ 쇼핑몰 리뉴얼" className={input} />
        </Field>
        <Field label="클라이언트">
          <input name="client_name" placeholder="김대표" className={input} />
        </Field>
        <Field label="직종">
          <select name="kind" defaultValue="dev" className={input}>
            {Object.entries(PRESETS).map(([k, v]) => (
              <option key={k} value={k}>{v.name}</option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="무료 수정 횟수">
            <input name="free_revisions" type="number" defaultValue={2} min={0} className={input} />
          </Field>
          <Field label="범위 초과 시 추가비 (원)">
            <input name="change_fee" type="number" defaultValue={50000} step={10000} className={input} />
          </Field>
        </div>
        <button className={`w-full ${btnPrimary} py-3`}>
          프로젝트 만들기
        </button>
      </form>
    </main>
  );
}

function HowStep({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <li className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
        {n}
      </span>
      <p className="mt-2 text-sm font-semibold">{title}</p>
      <p className="mt-0.5 text-xs text-neutral-500">{desc}</p>
    </li>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-700">{label}</span>
      {children}
    </label>
  );
}
