"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { FiBarChart2, FiGrid, FiList } from "react-icons/fi";

import { FeedView } from "@/components/preview/feed-view";
import { GraphView } from "@/components/preview/graph-view";
import { InsightsView } from "@/components/preview/insights-view";

const tabs = [
  {
    id: "heatmap",
    label: "Graph",
    icon: <FiGrid className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
    view: <GraphView />,
  },
  {
    id: "feed",
    label: "Feed",
    icon: <FiList className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
    view: <FeedView />,
  },
  {
    id: "insights",
    label: "Insights",
    icon: <FiBarChart2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
    view: <InsightsView />,
  },
];

export function PreviewSection() {
  /* Feed is the default: the hero already shows a contribution graph. */
  const [active, setActive] = useState(
    tabs.findIndex((tab) => tab.id === "feed"),
  );
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (index: number) => {
    setActive(index);
    tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = tabs.length - 1;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab(active === last ? 0 : active + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab(active === 0 ? last : active - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(last);
    }
  };

  const activeTab = tabs[active];

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="scroll-mt-28 px-6 py-24 sm:py-28"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <h2
          id="features-heading"
          className="max-w-xl text-balance text-center text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Your activity, but with the details
        </h2>
        <p className="mt-4 max-w-xl text-pretty text-center text-lg leading-8 text-brand-300">
          GitHub shows you squares. We show you the whole story, in one place.
        </p>

        <div
          role="tablist"
          aria-label="Board views"
          onKeyDown={onKeyDown}
          className="mt-10 flex items-center gap-1 rounded-full border border-glass-border bg-glass p-1.5 backdrop-blur-xl"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`preview-tab-${tab.id}`}
              aria-selected={active === index}
              aria-controls={`preview-panel-${tab.id}`}
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-accent-primary sm:px-4 ${
                active === index
                  ? "bg-accent-primary-soft font-medium text-accent-primary"
                  : "text-brand-300 hover:bg-glass hover:text-brand-50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`preview-panel-${activeTab.id}`}
          aria-labelledby={`preview-tab-${activeTab.id}`}
          className="mt-8 w-full rounded-card border border-glass-border bg-glass backdrop-blur-xl"
        >
          <div
            aria-hidden
            className="flex items-center gap-3 border-b border-glass-border px-5 py-3.5"
          >
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-brand-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-brand-700" />
            </span>
            <span className="ml-2 hidden rounded-full border border-glass-border px-3 py-1 text-xs text-brand-400 sm:inline">
              g-track / {activeTab.label.toLowerCase()}
            </span>
            <span className="ml-auto flex items-center gap-1.5 text-xs text-brand-300">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
              Synced just now
            </span>
          </div>

          <div
            key={activeTab.id}
            className="min-h-[20rem] p-5 animate-fade-up motion-reduce:animate-none sm:min-h-[22rem] sm:p-6"
          >
            {activeTab.view}
          </div>
        </div>
      </div>
    </section>
  );
}
