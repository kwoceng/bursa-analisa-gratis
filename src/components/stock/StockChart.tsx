import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function StockChart({
  data,
  positive,
}: {
  data: { tanggal: string; harga: number }[];
  positive: boolean;
}) {
  const stroke = positive ? "var(--color-up)" : "var(--color-down)";
  const min = Math.min(...data.map((d) => d.harga));
  const max = Math.max(...data.map((d) => d.harga));
  const pad = Math.max(1, (max - min) * 0.15);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="tanggal"
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            minTickGap={16}
          />
          <YAxis
            domain={[min - pad, max + pad]}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={64}
            tickFormatter={(v: number) => new Intl.NumberFormat("id-ID").format(Math.round(v))}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--color-muted-foreground)" }}
            formatter={(v: number) => [
              "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(v)),
              "Harga",
            ]}
          />
          <Area
            type="monotone"
            dataKey="harga"
            stroke={stroke}
            strokeWidth={2}
            fill="url(#gradPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}