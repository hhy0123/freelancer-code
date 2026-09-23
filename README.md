# 확정 잠금 — 외주 계약 범위 판정 도구

수정 횟수를 세지 않는다. **확정된 결정을 잠그고**, 그 결정을 되돌리는 요청만 유상으로 판정한다.

| 요청이 가리키는 항목 | 판정 | 근거 |
|---|---|---|
| 잠긴 항목 | 유상 | 클라이언트 본인이 승인한 결정 |
| 목록에 없는 신규 요구 | 유상 | 계약 범위 밖 |
| 미확정 항목 | 무료 | 작업 전에 안 물어본 쪽 책임 |
| 확정 전 + 횟수 남음 | 무료 | 정상 수정 |

판정 로직: `lib/judge.ts` · 테스트: `node --experimental-strip-types --test lib/judge.test.ts`

## 셋업
1. supabase.com 에서 프로젝트 생성
2. SQL Editor 에 `schema.sql` → `seed.sql` 순서로 붙여넣고 실행
3. `.env.local` 작성 (Project Settings > API)
   ```
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_SERVICE_KEY=eyJ...   # service_role
   ```
4. `npm run dev`

## 배포
Vercel 에 위 환경변수 2개를 등록한 뒤 **재배포**한다. (등록만 하고 재배포 안 하면 반영 안 됨)

## 시연 URL
- 작업자: `/p/11111111-1111-1111-1111-111111111111`
- 클라이언트: `/p/22222222-2222-2222-2222-222222222222`
