import { headers } from "next/headers";
import QRCode from "qrcode";
import { createProject } from "./actions";
import { PRESETS } from "@/lib/presets";
import { pageTitle, scriptAccent, cardShell, cardTitleBar, cardBody, input, btnPrimary } from "@/lib/styles";

const DEMO_OWNER = "11111111-1111-1111-1111-111111111111";
const DEMO_CLIENT = "22222222-2222-2222-2222-222222222222";

export default async function Home() {
  const h = await headers();
  const base = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
  const [ownerQr, clientQr] = await Promise.all([
    QRCode.toDataURL(`${base}/p/${DEMO_OWNER}`, { margin: 1, width: 160 }),
    QRCode.toDataURL(`${base}/p/${DEMO_CLIENT}`, { margin: 1, width: 160 }),
  ]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-baseline justify-between">
        <h1 className={`text-3xl ${pageTitle}`}>🔒 Fix</h1>
        <p className={`text-lg ${scriptAccent}`}>화면이 먼저 말해요</p>
      </div>

      <div className={`mt-8 ${cardShell}`}>
        <p className={cardTitleBar}>새 프로젝트 만들기</p>
        <form action={createProject} className={`${cardBody} space-y-4`}>
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
      </div>

      <div className={`mt-6 ${cardShell}`}>
        <p className={cardTitleBar}>진행 중인 프로젝트 보기</p>
        <div className={`${cardBody} grid grid-cols-2 gap-3`}>
          <DemoLink href={`/p/${DEMO_OWNER}`} qr={ownerQr} icon="👤" label="작업자로 보기" />
          <DemoLink href={`/p/${DEMO_CLIENT}`} qr={clientQr} icon="🙋" label="클라이언트로 보기" />
        </div>
      </div>
    </main>
  );
}

function DemoLink({ href, qr, icon, label }: { href: string; qr: string; icon: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      className="flex items-center gap-3 rounded-md border border-neutral-200 bg-white p-3 transition hover:border-blue-300 hover:bg-blue-50/50"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qr} alt={`${label} QR 코드`} width={52} height={52} className="rounded border border-neutral-200" />
      <span>
        <span className="block text-sm font-medium text-blue-900">{icon} {label}</span>
        <span className="text-xs text-blue-600">클릭 또는 스캔 →</span>
      </span>
    </a>
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
