"use client";

import { useEffect, useRef, useState } from "react";

export type ChipDef = { id: string; label: string };

const STICKY_OFFSET_PX = 52; // height of the chip bar itself; topbar is not sticky

export default function MenuChipNav(props: { chips: ChipDef[] }) {
  const [activeId, setActiveId] = useState<string>(props.chips[0]?.id ?? "");
  const containerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const scrollingToId = useRef<string | null>(null);

  useEffect(() => {
    const sections = props.chips
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el != null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;

        const visibleId = visible.target.id;
        const target = scrollingToId.current;
        if (target != null) {
          // Ignore intermediate sections that pass under the observer band
          // while a click-driven smooth scroll is in flight.
          if (visibleId === target) {
            scrollingToId.current = null;
            setActiveId(visibleId);
          }
          return;
        }
        setActiveId(visibleId);
      },
      {
        rootMargin: `-${STICKY_OFFSET_PX + 8}px 0px -55% 0px`,
        threshold: 0,
      },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [props.chips]);

  useEffect(() => {
    const chip = chipRefs.current[activeId];
    const container = containerRef.current;
    if (!chip || !container) return;
    const chipLeft = chip.offsetLeft;
    const chipRight = chipLeft + chip.offsetWidth;
    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + container.clientWidth;
    if (chipLeft < viewLeft || chipRight > viewRight) {
      const target = chipLeft - container.clientWidth / 2 + chip.offsetWidth / 2;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      container.scrollTo({ left: target, behavior: reduced ? "auto" : "smooth" });
    }
  }, [activeId]);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET_PX;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollingToId.current = id;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  }

  return (
    <div
      ref={containerRef}
      className="sticky top-0 z-20 -mx-4 sm:-mx-8 px-4 sm:px-8 py-3 flex gap-2 overflow-x-auto bg-[#1d1814]/95 backdrop-blur border-b border-[#efe5d3]/10 scrollbar-none"
      style={{ scrollbarWidth: "none" }}
    >
      {props.chips.map((c) => {
        const active = c.id === activeId;
        return (
          <a
            key={c.id}
            ref={(el) => {
              chipRefs.current[c.id] = el;
            }}
            href={`#${c.id}`}
            onClick={(e) => handleClick(e, c.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] tracking-wide whitespace-nowrap border transition ${
              active
                ? "bg-[#d8a657] text-[#1d1814] border-[#d8a657]"
                : "border-[#d8a657]/40 text-[#efe5d3]/85 hover:border-[#d8a657]"
            }`}
          >
            {c.label}
          </a>
        );
      })}
    </div>
  );
}
