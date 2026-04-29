"use client";

import { useEffect, useState } from "react";
import MenuChipNav, { ChipDef } from "./menu-chip-nav";

export type TabDef = {
  id: string;
  label: string;
  chips: ChipDef[];
};

const TAB_BAR_HEIGHT_PX = 44;

export default function MenuTabs(props: {
  tabs: TabDef[];
  panels: Record<string, React.ReactNode>;
  allergenNotice: string;
}) {
  const [activeTabId, setActiveTabId] = useState<string>(props.tabs[0]?.id ?? "");

  // On mount, if URL hash points to a section in some other tab, switch to that tab.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const owner = props.tabs.find((t) => t.chips.some((c) => c.id === hash));
    if (owner && owner.id !== activeTabId) {
      setActiveTabId(owner.id);
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeTab = props.tabs.find((t) => t.id === activeTabId) ?? props.tabs[0];

  function handleTabClick(id: string) {
    if (id === activeTabId) return;
    setActiveTabId(id);
    // Scrolling back to top of the menu when switching tabs avoids leaving the
    // user mid-section in a (now hidden) tab. Honour reduced motion.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <>
      <div
        className="sticky top-0 z-30 -mx-4 sm:-mx-8 px-4 sm:px-8 bg-[#1d1814]/95 backdrop-blur border-b border-[#efe5d3]/10 flex gap-6"
        style={{ height: TAB_BAR_HEIGHT_PX }}
      >
        {props.tabs.map((t) => {
          const active = t.id === activeTabId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTabClick(t.id)}
              className={`text-xs sm:text-sm tracking-[0.18em] uppercase transition border-b-2 -mb-px ${
                active
                  ? "text-[#d8a657] border-[#d8a657]"
                  : "text-[#efe5d3]/65 border-transparent hover:text-[#efe5d3]"
              }`}
              aria-current={active ? "true" : undefined}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <MenuChipNav chips={activeTab?.chips ?? []} stickyTopPx={TAB_BAR_HEIGHT_PX} />

      <div className="mt-2 mb-4 px-3 py-2 border-l-2 border-[#d8a657] bg-[#d8a657]/[0.06] text-sm text-[#efe5d3]/85">
        {props.allergenNotice}
      </div>

      {/* All panels stay in the DOM (for SEO + crawlable content) — only the active tab is visible. */}
      {props.tabs.map((t) => (
        <div
          key={t.id}
          className={`flex flex-col gap-12 pt-6 pb-24 ${t.id === activeTabId ? "" : "hidden"}`}
        >
          {props.panels[t.id]}
        </div>
      ))}
    </>
  );
}
