import type { ReactNode } from "react";
import {
  FiEye,
  FiGitBranch,
  FiGitCommit,
  FiGitMerge,
  FiGitPullRequest,
  FiStar,
} from "react-icons/fi";

type FeedRow = {
  label: string;
  repo: string;
  time: string;
  tone: string;
  icon: ReactNode;
};

const feedGroups: { day: string; rows: FeedRow[] }[] = [
  {
    day: "Today",
    rows: [
      {
        label: "Pushed 3 commits",
        repo: "g-track",
        time: "9:14 AM",
        tone: "border-event-commit/30 bg-event-commit/12 text-event-commit",
        icon: <FiGitCommit className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
      },
      {
        label: "Opened #131 · tabbed board preview",
        repo: "g-track",
        time: "10:02 AM",
        tone: "border-event-pr/30 bg-event-pr/12 text-event-pr",
        icon: (
          <FiGitPullRequest className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        ),
      },
      {
        label: "Reviewed #129 · auth wiring",
        repo: "g-track",
        time: "11:47 AM",
        tone: "border-event-review/30 bg-event-review/12 text-event-review",
        icon: <FiEye className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
      },
    ],
  },
  {
    day: "Yesterday",
    rows: [
      {
        label: "Merged #128 · activity sync",
        repo: "g-track",
        time: "2:05 PM",
        tone: "border-event-pr/30 bg-event-pr/12 text-event-pr",
        icon: <FiGitMerge className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
      },
      {
        label: "Created feat/preview-tabs",
        repo: "g-track",
        time: "4:20 PM",
        tone: "border-event-branch/30 bg-event-branch/12 text-event-branch",
        icon: <FiGitBranch className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
      },
      {
        label: "Starred neondatabase/neon",
        repo: "neon",
        time: "11:30 AM",
        tone: "border-event-star/30 bg-event-star/12 text-event-star",
        icon: <FiStar className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
      },
    ],
  },
];

export function FeedView() {
  return (
    <div className="flex flex-col gap-5">
      {feedGroups.map((group) => (
        <div key={group.day}>
          <p className="text-xs font-medium text-brand-400">{group.day}</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {group.rows.map((row) => (
              <li
                key={row.label}
                className="flex items-center gap-3 rounded-xl border border-glass-border bg-glass px-3 py-2"
              >
                <span
                  aria-hidden
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${row.tone}`}
                >
                  {row.icon}
                </span>
                <span className="truncate text-sm text-brand-200">
                  {row.label}
                </span>
                <span className="ml-auto hidden shrink-0 font-mono text-xs text-brand-400 sm:inline">
                  {row.repo}
                </span>
                <span className="shrink-0 text-xs text-brand-400 tabular-nums">
                  {row.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
