import { headers } from "next/headers";
import QRCode from "qrcode";
import { createProject } from "./actions";
import { PRESETS } from "@/lib/presets";
import { pageTitle, scriptAccent, cardShell, cardTitleBar, cardBody, eyebrowNum, input, btnPrimary } from "@/lib/styles";

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
      <h1 className={`text-4xl ${pageTitle}`}>🔒 확정 잠금</h1>
      <p className={`mt-1 text-xl ${scriptAccent}`}>사람이 말하지 않아도, 화면이 먼저 말해요</p>

      <div className={`mt-10 ${cardShell}`}>
        <p className={cardTitleBar}>
          <span className={eyebrowNum}>01</span> 진행 중인 프로젝트 둘러보기
        </p>
        <div className={cardBody}>
          <p className="text-sm text-neutral-600">
            진행 중인 프로젝트를 <strong className="font-medium text-black">작업자</strong>와{" "}
            <strong className="font-medium text-black">클라이언트</strong> 양쪽 입장에서
            미리 채워진 데이터로 둘러볼 수 있습니다. 이 도구는 둘 중 한쪽만을 위한 게 아닙니다.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <DemoLink href={`/p/${DEMO_OWNER}`} qr={ownerQr} icon="👤" label="작업자로 보기" />
            <DemoLink href={`/p/${DEMO_CLIENT}`} qr={clientQr} icon="🙋" label="클라이언트로 보기" />
          </div>
        </div>
      </div>

      <ol className="mt-10 grid gap-3 sm:grid-cols-3">
        <HowStep n={1} title="항목을 확정한다" desc="클라이언트가 체크리스트를 채운다" />
        <HowStep n={2} title="승인하면 잠긴다" desc="채워진 항목이 그 순간 잠긴다" />
        <HowStep n={3} title="번복은 유상" desc="잠긴 항목 변경만 자동으로 청구된다" />
      </ol>

      <div className={`mt-10 ${cardShell}`}>
        <p className={cardTitleBar}>
          <span className={eyebrowNum}>02</span> 예시 판정
        </p>
        <div className={cardBody}>
          <p className="text-sm text-neutral-700">
            &quot;지원 브라우저&quot;는 9월 20일 1차 검수에서 이미 승인·잠금됨
          </p>
          <div className="mt-3 flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm">
            <span className="text-neutral-600">“역시 IE11도 지원해주세요”</span>
            <span className="rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-white">
              +50,000원
            </span>
          </div>
        </div>
      </div>

      <div className={`mt-10 ${cardShell}`}>
        <p className={cardTitleBar}>
          <span className={eyebrowNum}>03</span> 프로젝트 만들기
        </p>
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
    </main>
  );
}

function DemoLink({ href, qr, icon, label }: { href: string; qr: string; icon: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      className="flex items-center gap-3 rounded-md border border-neutral-200 bg-white p-3 transition hover:border-mint-300 hover:bg-mint-50/50"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qr} alt={`${label} QR 코드`} width={52} height={52} className="rounded border border-neutral-200" />
      <span>
        <span className="block text-sm font-medium text-black">{icon} {label}</span>
        <span className="text-xs text-mint-600">클릭 또는 스캔 →</span>
      </span>
    </a>
  );
}

function HowStep({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <li className="rounded-lg border border-neutral-200 bg-white p-4">
      <span className={`text-xl ${eyebrowNum}`}>0{n}</span>
      <p className="mt-1.5 text-sm font-semibold text-black">{title}</p>
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
