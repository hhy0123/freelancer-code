// 공유 스타일 토큰. 색상 팔레트를 여기 한 곳에서만 정의한다.
// 팔레트: 민트(주요 액션·무료/안심) · 흰색(바탕) · 검정(텍스트·테두리·유상/강조)
// "창(window)" 모티프: 굵은 검정 테두리 + 제목 표시줄(민트) + 흰 본문.

export const cardShell = "rounded-2xl border-2 border-black bg-white overflow-hidden shadow-[4px_4px_0_0_#000]";
export const cardTitleBar =
  "flex items-center gap-2 border-b-2 border-black bg-mint-300 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-black";
export const cardBody = "p-5";

export const input =
  "w-full rounded-xl border-2 border-black px-3.5 py-2.5 outline-none transition focus:ring-4 focus:ring-mint-200";
export const btnPrimary =
  "rounded-xl border-2 border-black bg-mint-500 px-4 py-2.5 text-sm font-semibold text-black shadow-[3px_3px_0_0_#000] transition hover:bg-mint-600 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none";
export const btnGhost =
  "rounded-xl border-2 border-black bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-mint-50";

export const badgeLocked =
  "inline-flex items-center gap-1 rounded-full border-2 border-black bg-black px-2.5 py-1 text-[11px] font-medium text-white";
export const badgeWarn =
  "inline-flex items-center gap-1 rounded-full border-2 border-dashed border-neutral-400 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600";
export const badgeOk =
  "inline-flex items-center gap-1 rounded-full border-2 border-mint-600 bg-mint-100 px-2.5 py-1 text-[11px] font-medium text-mint-700";

/** 판정 결과 배너/배지 색 — 유상은 검정(강조), 무료는 민트(안심) */
export const verdictPaid = "border-2 border-black bg-black text-white";
export const verdictFree = "border-2 border-mint-600 bg-mint-100 text-mint-700";
