"use client";

interface Step {
  key: string;
  label: string;
}

interface StepperProps {
  steps: Step[];
  current: number; // 0-indexed
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;

        return (
          <div key={step.key} className="flex items-center">
            {/* Node */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors",
                  done
                    ? "bg-(--color-accent) text-white"
                    : active
                      ? "border-2 border-(--color-accent) bg-(--color-accent-soft) text-(--color-accent)"
                      : "border border-(--color-border) bg-(--color-surface) text-(--color-text-muted)",
                ].join(" ")}
                aria-current={active ? "step" : undefined}
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M2.5 6l2.5 2.5 4.5-5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span
                className={[
                  "hidden text-[10px] whitespace-nowrap sm:block",
                  active
                    ? "font-medium text-(--color-accent)"
                    : done
                      ? "text-(--color-text-secondary)"
                      : "text-(--color-text-muted)",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line — not after last */}
            {i < steps.length - 1 && (
              <div
                className={[
                  "mx-1.5 mb-4 h-px w-10 transition-colors sm:w-14 md:w-20",
                  i < current ? "bg-(--color-accent)" : "bg-(--color-border)",
                ].join(" ")}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
