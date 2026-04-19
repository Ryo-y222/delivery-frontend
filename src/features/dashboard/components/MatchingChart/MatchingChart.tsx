import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { ChartDataPoint } from "../../../../mocks/types/dashboard";
import styles from "./MatchingChart.module.css";

type MatchingChartProps = {
  data: ChartDataPoint[];
};

export function MatchingChart({ data }: MatchingChartProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>月別マッチング推移</h3>
      </div>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0dfd7" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#a1a09a", fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#a1a09a", fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e0dfd7" }}
            />
            <Bar dataKey="requests" name="リクエスト" fill="#bfdbfe" radius={[4, 4, 0, 0]} />
            <Bar dataKey="deals" name="成約" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.dot} style={{ background: "#2563eb" }} />
          成約
        </div>
        <div className={styles.legendItem}>
          <span className={styles.dot} style={{ background: "#bfdbfe" }} />
          リクエスト
        </div>
      </div>
    </div>
  );
}