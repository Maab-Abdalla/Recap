import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Screen } from "@/types";

const STEPS: { key: Screen; label: string }[] = [
  { key: "input", label: "Paste" },
  { key: "processing", label: "Analyse" },
  { key: "review", label: "Review" },
  { key: "success", label: "Done" },
];

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-serif font-semibold tracking-tight text-galaxy select-none",
        className
      )}
    >
      Recap
    </span>
  );
}

export function NavBar({ screen }: { screen: Screen }) {
  const activeIndex = STEPS.findIndex((s) => s.key === screen);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <Link href="/" aria-label="Recap home" className="inline-flex">
          <Wordmark className="text-2xl" />
        </Link>

        <Link
          href="/history"
          className="text-xs font-medium text-universe hover:text-galaxy transition-colors"
        >
          Past meetings
        </Link>
      </div>

      {/* Step rail — labelled tabs with an animated progress fill */}
      <div className="mt-5 flex items-center gap-2">
        {STEPS.map((s, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <div key={s.key} className="flex flex-1 flex-col gap-1.5">
              <div className="h-1 w-full overflow-hidden rounded-full bg-venus/40">
                <div
                  className={cn(
                    "h-full rounded-full origin-left transition-colors",
                    done && "bg-universe",
                    active && "bg-galaxy animate-bar-grow",
                    !done && !active && "bg-transparent"
                  )}
                  style={{ width: done || active ? "100%" : "0%" }}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] uppercase tracking-[0.12em] transition-colors",
                  active && "text-galaxy font-semibold",
                  done && "text-universe",
                  !done && !active && "text-universe/50"
                )}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
