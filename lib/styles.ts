// 공유 스타일 토큰. 색상 팔레트를 여기 한 곳에서만 정의한다.
// 팔레트: 민트(주요 액션·무료/안심) · 흰색(바탕) · 검정(텍스트·유상/강조)
// 톤: 얇은 헤어라인 + 여백 중심의 편집디자인 스타일에, 알약 버튼과 손글씨
// 포인트로 감성을 살짝 더한다. 굵은 테두리·딱딱한 그림자는 계속 지양.

export const pageTitle = "font-[family-name:var(--font-serif)] font-bold tracking-tight text-black";
/** 랜딩의 작은 손글씨 포인트 문구 전용. 본문·버튼 등 기능 텍스트에는 쓰지 않는다. */
export const scriptAccent = "font-[family-name:var(--font-script)] text-mint-600";

export const cardShell = "rounded-2xl border border-neutral-200 bg-white";
/** 카드 상단의 작은 대문자 라벨 + 얇은 밑줄 */
export const cardTitleBar =
  "flex items-center gap-2 border-b border-neutral-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-mint-700";
/** 섹션 번호("01" 등) 숫자 장식 — 세리프체로 라벨 앞에 붙임 */
export const eyebrowNum = "font-[family-name:var(--font-serif)] text-mint-400";
export const cardBody = "p-6";

/** 한 줄짜리 입력(텍스트·숫자·셀렉트)용. 여러 줄 textarea에는 textareaBox를 쓸 것 — 알약 모양은 키 큰 박스에는 안 어울린다. */
export const input =
  "w-full rounded-full border border-neutral-300 px-4 py-2.5 outline-none transition focus:border-mint-600 focus:ring-2 focus:ring-mint-100";
export const textareaBox =
  "w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-mint-600 focus:ring-2 focus:ring-mint-100";
export const btnPrimary =
  "rounded-full bg-mint-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-mint-700 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400";
export const btnGhost =
  "rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-neutral-50";

export const badgeLocked =
  "inline-flex items-center gap-1 rounded-full bg-black px-2.5 py-1 text-[11px] font-medium text-white";
export const badgeWarn =
  "inline-flex items-center gap-1 rounded-full border border-dashed border-neutral-400 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600";
export const badgeOk =
  "inline-flex items-center gap-1 rounded-full border border-mint-300 bg-mint-50 px-2.5 py-1 text-[11px] font-medium text-mint-700";

/** 판정 결과 배너/배지 색 — 유상은 검정(강조), 무료는 민트(안심) */
export const verdictPaid = "rounded-2xl bg-black text-white";
export const verdictFree = "rounded-2xl border border-mint-200 bg-mint-50 text-mint-700";
