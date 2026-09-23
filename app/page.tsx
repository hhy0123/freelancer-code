import { createProject } from "./actions";
import { PRESETS } from "@/lib/presets";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        어디까지가 계약 범위인가
      </h1>
      <p className="mt-4 text-neutral-600 leading-relaxed">
        외주에서 돈을 못 받는 이유는 일을 못해서가 아니라, 어디까지가 일인지
        아무도 정하지 않아서입니다. 이 도구는 수정 횟수를 세지 않습니다.
        <strong className="text-neutral-900"> 확정된 결정을 잠그고</strong>, 그
        결정을 되돌리는 요청만 유상으로 판정합니다.
      </p>

      <form action={createProject} className="mt-10 space-y-4">
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
        <button className="w-full rounded-lg bg-neutral-900 px-4 py-3 font-medium text-white hover:bg-neutral-700">
          프로젝트 만들기
        </button>
      </form>
    </main>
  );
}

const input =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-700">{label}</span>
      {children}
    </label>
  );
}
