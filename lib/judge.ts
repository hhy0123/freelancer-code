export type SpecItem = {
  id: string;
  label: string;
  value: string;
  locked_at: string | null;
  locked_by: string | null;
  locked_by_role?: "client" | "owner" | null;
};

export type Verdict = {
  verdict: "free" | "paid";
  reason: string;
  fee: number;
};

const d = (iso: string) =>
  new Date(iso).toLocaleDateString("ko-KR", { month: "long", day: "numeric" });

/**
 * 계약 범위 판정. 자연어 해석 없이 "확정 상태"만 본다.
 *  - 잠긴 항목을 건드림      → 유상 (본인이 승인한 결정을 뒤집는 것)
 *  - 목록에 없는 신규 요구   → 유상 (애초에 범위 밖)
 *  - 미확정 항목             → 무료 (작업 전에 안 물어본 쪽 책임)
 *  - 그 외                   → 무료 수정 횟수 내에서 무료
 */
export function judge(
  item: SpecItem | null,
  freeUsed: number,
  p: { free_revisions: number; change_fee: number }
): Verdict {
  if (!item)
    return {
      verdict: "paid",
      reason: "확정 항목 목록에 없는 신규 요구입니다. 계약 범위 밖의 추가 작업입니다.",
      fee: p.change_fee,
    };

  if (item.locked_at) {
    const who = item.locked_by_role === "owner" ? "작업자가 사전에" : "클라이언트가 직접";
    return {
      verdict: "paid",
      reason: `‘${item.label}’은(는) ${d(item.locked_at)} ${item.locked_by ?? "승인"} 단계에서 ${who} 확정한 항목입니다. 확정된 결정을 되돌리는 요청입니다.`,
      fee: p.change_fee,
    };
  }

  if (!item.value.trim())
    return {
      verdict: "free",
      reason: `‘${item.label}’은(는) 아직 확정되지 않은 항목입니다. 작업 전에 확인하지 않은 쪽의 책임이므로 무료입니다.`,
      fee: 0,
    };

  if (freeUsed >= p.free_revisions)
    return {
      verdict: "paid",
      reason: `계약상 무료 수정 ${p.free_revisions}회를 모두 사용했습니다.`,
      fee: p.change_fee,
    };

  return {
    verdict: "free",
    reason: `확정 전 항목에 대한 수정입니다. 무료 수정 ${freeUsed + 1}/${p.free_revisions}회.`,
    fee: 0,
  };
}
