const STEPS = ["항목 확정", "승인·잠금", "진행 중 관리"];

export default function Stepper({ step }: { step: 0 | 1 | 2 }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((label, i) => (
        <li key={label} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                i < step
                  ? "bg-indigo-600 text-white"
                  : i === step
                    ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                    : "bg-neutral-200 text-neutral-500"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </span>
            <span className={`text-xs font-medium ${i === step ? "text-indigo-700" : "text-neutral-500"}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && <span className="h-px w-6 bg-neutral-200" />}
        </li>
      ))}
    </ol>
  );
}
