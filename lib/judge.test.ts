// node --experimental-strip-types --test lib/judge.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { judge, type SpecItem } from "./judge.ts";

const P = { free_revisions: 2, change_fee: 50000 };
const item = (o: Partial<SpecItem> = {}): SpecItem => ({
  id: "1",
  label: "지원 브라우저",
  value: "Chrome, Safari",
  locked_at: null,
  locked_by: null,
  ...o,
});

test("목록에 없는 신규 요구 → 유상", () => {
  const v = judge(null, 0, P);
  assert.equal(v.verdict, "paid");
  assert.equal(v.fee, 50000);
});

test("잠긴 항목 → 무료 횟수가 남아도 유상", () => {
  const v = judge(item({ locked_at: "2026-09-20T00:00:00Z", locked_by: "1차 검수" }), 0, P);
  assert.equal(v.verdict, "paid");
  assert.match(v.reason, /확정한 항목/);
});

test("미확정 항목 → 횟수를 다 썼어도 무료", () => {
  const v = judge(item({ value: "  " }), 99, P);
  assert.equal(v.verdict, "free");
  assert.equal(v.fee, 0);
});

test("확정됐지만 안 잠긴 항목 → 횟수 내 무료, 초과 시 유상", () => {
  assert.equal(judge(item(), 1, P).verdict, "free");
  assert.equal(judge(item(), 2, P).verdict, "paid");
});
