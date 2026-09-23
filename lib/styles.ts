// 공유 스타일 토큰. 색상 팔레트를 여기 한 곳에서만 정의한다.
// 팔레트: 스틸블루 단색조(연한 톤=무료/안심, 짙은 네이비=유상/강조) · 흰색(바탕)
// 톤: 얇은 헤어라인 + 여백 중심의 편집디자인 스타일에, 알약 버튼과 손글씨
// 포인트로 감성을 살짝 더한다. 굵은 테두리·딱딱한 그림자는 계속 지양.

export const pageTitle = "font-[family-name:var(--font-serif)] font-bold tracking-tight text-blue-900";
/** 랜딩의 작은 손글씨 포인트 문구 전용. 본문·버튼 등 기능 텍스트에는 쓰지 않는다. */
export const scriptAccent = "font-[family-name:var(--font-script)] text-blue-600";

export const cardShell = "rounded-2xl border border-neutral-200 bg-white";
/** 카드 상단의 작은 대문자 라벨 + 얇은 밑줄 */
export const cardTitleBar =
  "flex items-center gap-2 border-b border-neutral-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-blue-700";
/** 섹션 번호("01" 등) 숫자 장식 — 둥근 헤드라인 폰트로 라벨 앞에 붙임 */
export const eyebrowNum = "font-[family-name:var(--font-serif)] text-blue-400";
export const cardBody = "p-6";

/** 한 줄짜리 입력(텍스트·숫자·셀렉트)용. 여러 줄 textarea에는 textareaBox를 쓸 것 — 알약 모양은 키 큰 박스에는 안 어울린다. */
export const input =
  "w-full rounded-full border border-neutral-300 px-4 py-2.5 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
export const textareaBox =
  "w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
export const btnPrimary =
  "rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400";
export const btnGhost =
  "rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-blue-900 transition hover:bg-neutral-50";

export const badgeLocked =
  "inline-flex items-center gap-1 rounded-full bg-blue-900 px-2.5 py-1 text-[11px] font-medium text-white";
export const badgeWarn =
  "inline-flex items-center gap-1 rounded-full border border-dashed border-neutral-400 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600";
export const badgeOk =
  "inline-flex items-center gap-1 rounded-full border border-blue-300 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700";

/** 판정 결과 배너/배지 색 — 유상은 짙은 네이비(강조), 무료는 옅은 블루(안심) */
export const verdictPaid = "rounded-2xl bg-blue-900 text-white";
export const verdictFree = "rounded-2xl border border-blue-200 bg-blue-50 text-blue-700";
