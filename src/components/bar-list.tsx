import { inkHatch } from "@/components/stat-charts";

type Row = { label: string; count: number };

type Props = {
  rows: Row[];
  /** When set, each row also shows its share of this total. */
  total?: number;
  empty: string;
};

/** Outlined bars scaled to the biggest row: hatched like the streak bar, the biggest one in solid ink. */
export function BarList({ rows, total, empty }: Props) {
  const peak = Math.max(0, ...rows.map((row) => row.count));
  if (peak === 0) return <p className="text-sm text-brand-400">{empty}</p>;

  return (
    <ul className="flex flex-col gap-4">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-brand-100">{row.label}</span>
            <span className="shrink-0 tabular-nums text-brand-400">
              {total ? `${Math.round((row.count / total) * 100)}%` : row.count}
            </span>
          </div>
          <div className="mt-2 h-3 rounded-[4px] border border-brand-700">
            {row.count > 0 && (
              <div
                style={{ width: `${Math.max((row.count / peak) * 100, 3)}%` }}
                className={`-m-px h-[calc(100%+2px)] rounded-[4px] border border-brand-50 ${
                  row.count === peak ? "bg-brand-50" : inkHatch
                }`}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
