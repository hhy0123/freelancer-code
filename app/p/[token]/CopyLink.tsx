"use client";

import { useState } from "react";

export default function CopyLink({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(`${location.origin}${path}`);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // ponytail: 클립보드 권한 실패 시 조용히 무시, 사용자는 텍스트를 직접 복사하면 됨
        }
      }}
      className="shrink-0 rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium hover:bg-neutral-50"
    >
      {copied ? "복사됨" : "복사"}
    </button>
  );
}
