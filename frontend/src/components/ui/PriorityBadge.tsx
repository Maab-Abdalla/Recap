import { cn, priorityBadgeClass } from "@/lib/utils";
import type { Priority } from "@/types";

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
        priorityBadgeClass(priority)
      )}
    >
      {priority}
    </span>
  );
}
