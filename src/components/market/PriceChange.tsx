import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

export function PriceChange({
  value,
  percent,
  showAbsolute = true,
  size = "md",
}: {
  value?: number;
  percent: number;
  showAbsolute?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const up = percent > 0;
  const down = percent < 0;
  const flat = !up && !down;
  const cls = up ? "text-up" : down ? "text-down" : "text-muted-foreground";
  const bg = up ? "bg-up-soft" : down ? "bg-down-soft" : "bg-muted";
  const sizeCls =
    size === "sm"
      ? "text-xs px-1.5 py-0.5"
      : size === "lg"
        ? "text-sm px-2.5 py-1"
        : "text-xs px-2 py-0.5";
  const Icon = up ? ArrowUpRight : down ? ArrowDownRight : Minus;
  const sign = up ? "+" : "";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-medium tabular-nums ${bg} ${cls} ${sizeCls}`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
      {showAbsolute && value !== undefined && !flat && (
        <span>
          {sign}
          {new Intl.NumberFormat("id-ID").format(Math.round(value))}
        </span>
      )}
      <span>
        {sign}
        {percent.toFixed(2)}%
      </span>
    </span>
  );
}
