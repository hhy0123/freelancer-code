const STEPS = ["항목 확정", "승인·잠금", "진행 중 관리"];

export default function Stepper({ step }: { step: 0 | 1 | 2 }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((label, i) => (
        <li key={label} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition ${
                i < step
                  ? "bg-blue-900 text-white"
                  : i === step
                    ? "bg-blue-600 text-white"
                    : "border border-neutral-300 text-neutral-400"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </span>
            <span className={`text-xs ${i === step ? "font-medium text-blue-700" : "text-neutral-400"}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && <span className="h-px w-6 bg-neutral-200" />}
        </li>
      ))}
    </ol>
  );
}
