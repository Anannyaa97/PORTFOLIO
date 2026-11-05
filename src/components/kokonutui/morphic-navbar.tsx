"use client";

import {
  animate,
  type MotionValue,
  motion,
  motionValue,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type Ref,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface NavItem {
  name: string;
}

export interface MorphicNavbarProps {
  /** Links keyed by their href, in display order. */
  items?: Record<string, NavItem>;
  /** Initially active path. Defaults to the first item's path. */
  defaultPath?: string;
  /** After scroll threshold, fold the bar down to active link + chevron */
  compact?: boolean;
  className?: string;
  resumeHref?: string;
}

const DEFAULT_NAV_ITEMS: Record<string, NavItem> = {
  "#hero": { name: "Home" },
  "#about": { name: "About" },
  "#experience": { name: "Experience" },
  "#projects": { name: "Projects" },
  "#skills": { name: "Skills" },
  "#contact": { name: "Contact" },
};

const SPLIT = 8;
const HOVER_SPLIT = 2;
const DRAG_SLOP = 4;
const PROJECTION = 0.16;
const VELOCITY_WINDOW = 90;
const COMPACT_AFTER = 120;
const CHEVRON_SIZE = 36;
const CHEVRON_GAP = 4;

const SPRING = { type: "spring", bounce: 0.15, visualDuration: 0.32 } as const;

const round2 = (v: number) => Math.round(v * 100) / 100;
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const bump = (focus: number, k: number) => Math.max(0, 1 - Math.abs(focus - k));

const splitOffsets = (count: number, focus: number, hover: number | null) => {
  const cumulative = [0];
  let total = 0;
  for (let joint = 0; joint < count - 1; joint++) {
    let gap = SPLIT * Math.max(bump(focus, joint), bump(focus, joint + 1));
    const hoverJoint =
      hover !== null &&
      hover !== Math.round(focus) &&
      (joint === hover - 1 || joint === hover);
    if (hoverJoint) {
      gap = Math.max(gap, HOVER_SPLIT);
    }
    total += gap;
    cumulative.push(total);
  }
  return cumulative.map((x) => round2(x - total / 2));
};

interface BarLayout {
  centers: number[];
  widths: number[];
  rowWidth: number;
}

const foldedOffsets = (layout: BarLayout, active: number) => {
  const { centers, widths, rowWidth } = layout;
  const activeWidth = widths[active] ?? 0;
  const groupWidth = activeWidth + CHEVRON_GAP + CHEVRON_SIZE;
  const activeCenter = rowWidth / 2 - groupWidth / 2 + activeWidth / 2;
  const xs = centers.map((center) => round2(activeCenter - center));
  const chevron = round2(
    activeCenter + activeWidth / 2 + CHEVRON_GAP + CHEVRON_SIZE / 2
  );
  return { xs, chevron };
};

const indexAt = (centers: number[], x: number) => {
  const last = centers.length - 1;
  if (last <= 0 || x <= (centers[0] ?? 0)) {
    return 0;
  }
  for (let k = 0; k < last; k++) {
    const a = centers[k] ?? 0;
    const b = centers[k + 1] ?? a;
    if (x < b) {
      return k + (x - a) / Math.max(1, b - a);
    }
  }
  return last;
};

interface DragState {
  pointerId: number;
  startX: number;
  rowLeft: number;
  scrubbing: boolean;
  focus: number;
  samples: { x: number; t: number }[];
}

const releaseVelocity = (samples: DragState["samples"], now: number) => {
  const recent = samples.filter((s) => now - s.t <= VELOCITY_WINDOW);
  const first = recent[0];
  const last = recent[recent.length - 1];
  if (!(first && last) || last.t === first.t) {
    return 0;
  }
  return ((last.x - first.x) / (last.t - first.t)) * 1000;
};

const capScale = (gap: number, fold: number) =>
  `scaleX(${round2(clamp(1 - gap / 1.5, 0, 1) * (1 - clamp(fold * 4, 0, 1)))})`;

const KEY_MOVES: Record<string, (i: number, n: number) => number> = {
  ArrowLeft: (i) => i - 1,
  ArrowRight: (i) => i + 1,
  Home: () => 0,
  End: (_, n) => n - 1,
};

const SURFACE = "bg-[#18181B]/90 backdrop-blur-md border border-white/10 shadow-lg";
const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-inset";

const followHash = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
  if (
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }
  event.preventDefault();
  const targetId = href.startsWith("#") ? href.slice(1) : href;
  const target = document.getElementById(decodeURIComponent(targetId));
  if (!target) {
    return;
  }
  target.scrollIntoView({ behavior: "smooth" });
  if (window.location.hash !== href) {
    window.history.pushState(null, "", href);
  }
};

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

interface SegmentProps {
  href: string;
  name: string;
  x: MotionValue<number>;
  prevX?: MotionValue<number>;
  nextX?: MotionValue<number>;
  fold: MotionValue<number>;
  pinned: boolean;
  hidden: boolean;
  highlighted: boolean;
  current: boolean;
  linkRef: Ref<HTMLAnchorElement>;
  onSelect: () => void;
  onFocus: (event: FocusEvent<HTMLAnchorElement>) => void;
  onHover: (event: PointerEvent<HTMLDivElement>, entering: boolean) => void;
}

function Segment({
  href,
  name,
  x,
  prevX,
  nextX,
  fold,
  pinned,
  hidden,
  highlighted,
  current,
  linkRef,
  onSelect,
  onFocus,
  onHover,
}: SegmentProps) {
  const transform = useTransform(() => `translate3d(${x.get()}px,0,0)`);
  const opacity = useTransform(() =>
    pinned ? 1 : round2(clamp(1 - fold.get() * 1.8, 0, 1))
  );
  const leftCap = useTransform(() =>
    prevX ? capScale(x.get() - prevX.get(), fold.get()) : "scaleX(0)"
  );
  const rightCap = useTransform(() =>
    nextX ? capScale(nextX.get() - x.get(), fold.get()) : "scaleX(0)"
  );

  return (
    <motion.div
      className={cn(
        "relative",
        pinned ? "z-20" : "z-10",
        hidden && "pointer-events-none"
      )}
      onPointerEnter={(event) => onHover(event, true)}
      onPointerLeave={(event) => onHover(event, false)}
      style={{ transform, opacity }}
    >
      <a
        aria-current={current ? "page" : undefined}
        className={cn(
          "relative flex h-10 items-center rounded-xl px-4 font-medium text-sm transition-colors duration-150 cursor-pointer select-none",
          SURFACE,
          FOCUS_RING,
          highlighted
            ? "text-white"
            : "text-zinc-400 hover:text-zinc-100"
        )}
        draggable={false}
        href={href}
        tabIndex={hidden ? -1 : 0}
        onClick={(event) => {
          onSelect();
          followHash(event, href);
        }}
        onDragStart={(event) => event.preventDefault()}
        onFocus={onFocus}
        ref={linkRef}
      >
        {prevX ? (
          <motion.span
            aria-hidden="true"
            className={cn(
              "absolute inset-y-0 -left-px w-3 origin-left pointer-events-none",
              SURFACE
            )}
            style={{ transform: leftCap }}
          />
        ) : null}
        {nextX ? (
          <motion.span
            aria-hidden="true"
            className={cn(
              "absolute inset-y-0 -right-px w-3 origin-right pointer-events-none",
              SURFACE
            )}
            style={{ transform: rightCap }}
          />
        ) : null}
        <span className="relative z-10">{name}</span>
        <span
          aria-hidden="true"
          className={cn(
            "absolute bottom-1.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-teal-400 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none shadow-[0_0_8px_rgba(20,184,166,0.6)]",
            highlighted ? "scale-x-100" : "scale-x-0"
          )}
        />
      </a>
    </motion.div>
  );
}

function useScrolledPast(enabled: boolean) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    if (!enabled) {
      setPast(false);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      setPast(window.scrollY > COMPACT_AFTER);
    };
    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);
  return past;
}

function useUserOpen(scrolledPast: boolean) {
  const [openedAt, setOpenedAt] = useState<number | null>(null);
  useEffect(() => {
    if (openedAt === null) {
      return;
    }
    const onScroll = () => {
      if (Math.abs(window.scrollY - openedAt) > COMPACT_AFTER) {
        setOpenedAt(null);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [openedAt]);

  useEffect(() => {
    if (!scrolledPast && openedAt !== null) {
      setOpenedAt(null);
    }
  }, [scrolledPast, openedAt]);

  return [openedAt !== null, () => setOpenedAt(window.scrollY)] as const;
}

export function MorphicNavbar({
  items = DEFAULT_NAV_ITEMS,
  defaultPath = "#hero",
  compact = false,
  className,
  resumeHref = "resume.pdf",
}: MorphicNavbarProps) {
  const entries = Object.entries(items);
  const paths = entries.map(([path]) => path);
  const count = entries.length;

  const [activePath, setActivePath] = useState(defaultPath);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ScrollSpy to keep activePath synced with visible section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = paths.length - 1; i >= 0; i--) {
        const path = paths[i];
        if (path.startsWith("#")) {
          const el = document.getElementById(path.slice(1));
          if (el && el.offsetTop <= scrollPos) {
            setActivePath(path);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [paths]);

  const activeIndex = Math.max(0, paths.indexOf(activePath));
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [keyboardInside, setKeyboardInside] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);

  const scrolledPast = useScrolledPast(compact);
  const [userOpen, openBar] = useUserOpen(scrolledPast);
  const folded =
    compact &&
    scrolledPast &&
    !userOpen &&
    !keyboardInside &&
    !scrubbing &&
    activeIndex >= 0;

  const highlightIndex = previewIndex ?? activeIndex;

  const xs = useMemo(
    () => splitOffsets(count, activeIndex, null).map((x) => motionValue(x)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count]
  );
  const fold = useMotionValue(0);
  const chevronX = useMotionValue(0);
  const chevronTransform = useTransform(
    () => `translate3d(${chevronX.get()}px,0,0)`
  );

  const rowRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const layoutRef = useRef<BarLayout | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const instantRef = useRef(false);
  const suppressClickRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const reduceRef = useRef(false);
  reduceRef.current = reduceMotion === true;

  const live = { activeIndex, highlightIndex, hoverIndex, folded, count };
  const liveRef = useRef(live);
  liveRef.current = live;

  useEffect(() => {
    const row = rowRef.current;
    if (!row) {
      return;
    }
    const measure = () => {
      const boxes = linkRefs.current
        .slice(0, count)
        .map((el) => el?.parentElement);
      layoutRef.current = {
        centers: boxes.map((box) =>
          box ? box.offsetLeft + box.offsetWidth / 2 : 0
        ),
        widths: boxes.map((box) => box?.offsetWidth ?? 0),
        rowWidth: row.offsetWidth,
      };
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, [count]);

  const retargetRef = useRef<(instant: boolean) => void>(() => undefined);
  retargetRef.current = (instant) => {
    const state = liveRef.current;
    const drag = dragRef.current;
    const jump = instant || reduceRef.current;
    const to = (value: MotionValue<number>, target: number) => {
      if (jump) {
        value.jump(target);
      } else {
        animate(value, target, SPRING);
      }
    };
    const layout = layoutRef.current;
    let targets: number[];
    let chevron: number;
    if (state.folded && layout) {
      const result = foldedOffsets(layout, state.activeIndex);
      targets = result.xs;
      chevron = result.chevron;
    } else {
      const focus = drag?.scrubbing ? drag.focus : state.highlightIndex;
      targets = splitOffsets(
        state.count,
        focus,
        drag?.scrubbing ? null : state.hoverIndex
      );
      const anchor = Math.max(0, state.activeIndex);
      chevron = (layout?.centers[anchor] ?? 0) + (targets[anchor] ?? 0);
    }
    for (const [i, value] of xs.entries()) {
      to(value, targets[i] ?? 0);
    }
    to(chevronX, round2(chevron - CHEVRON_SIZE / 2));
    to(fold, state.folded ? 1 : 0);
  };

  useEffect(() => {
    retargetRef.current(instantRef.current);
    instantRef.current = false;
  }, [activeIndex, highlightIndex, hoverIndex, folded, count]);

  const selectIndex = (index: number) => {
    const path = paths[index];
    if (path !== undefined) {
      setActivePath(path);
    }
  };

  const toFocus = (clientX: number, drag: DragState) =>
    clamp(
      indexAt(layoutRef.current?.centers ?? [], clientX - drag.rowLeft),
      0,
      count - 1
    );

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (event.button !== 0 || folded || target.closest("[data-chevron]")) {
      return;
    }
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      rowLeft: event.currentTarget.getBoundingClientRect().left,
      scrubbing: false,
      focus: highlightIndex,
      samples: [{ x: event.clientX, t: event.timeStamp }],
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }
    if (!drag.scrubbing) {
      if (Math.abs(event.clientX - drag.startX) < DRAG_SLOP) {
        return;
      }
      drag.scrubbing = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setScrubbing(true);
      setHoverIndex(null);
    }
    drag.samples.push({ x: event.clientX, t: event.timeStamp });
    if (drag.samples.length > 12) {
      drag.samples.shift();
    }
    drag.focus = toFocus(event.clientX, drag);
    setPreviewIndex(Math.round(drag.focus));
    retargetRef.current(false);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>, commit: boolean) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }
    dragRef.current = null;
    if (!drag.scrubbing) {
      return;
    }
    setScrubbing(false);
    setPreviewIndex(null);
    if (!commit) {
      retargetRef.current(false);
      return;
    }
    const velocity = releaseVelocity(drag.samples, event.timeStamp);
    const index = Math.round(
      toFocus(event.clientX + velocity * PROJECTION, drag)
    );
    suppressClickRef.current = true;
    setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
    selectIndex(index);
    linkRefs.current[index]?.click();
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (suppressClickRef.current && event.isTrusted) {
      suppressClickRef.current = false;
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const move = KEY_MOVES[event.key];
    const from = linkRefs.current.indexOf(
      document.activeElement as HTMLAnchorElement
    );
    if (!move || from < 0) {
      return;
    }
    event.preventDefault();
    const next = clamp(move(from, count), 0, count - 1);
    instantRef.current = true;
    setPreviewIndex(next);
    linkRefs.current[next]?.focus();
  };

  const onLinkFocus = (index: number, event: FocusEvent<HTMLAnchorElement>) => {
    if (event.currentTarget.matches(":focus-visible")) {
      instantRef.current = true;
      setKeyboardInside(true);
      setPreviewIndex(index);
    }
  };

  const onRowBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      instantRef.current = true;
      setKeyboardInside(false);
      setPreviewIndex(null);
    }
  };

  const onHover = (
    index: number,
    event: PointerEvent<HTMLDivElement>,
    entering: boolean
  ) => {
    if (event.pointerType !== "mouse" || dragRef.current?.scrubbing) {
      return;
    }
    setHoverIndex((current) => {
      if (entering) {
        return index;
      }
      return current === index ? null : current;
    });
  };

  const openFolded = () => {
    openBar();
    linkRefs.current[activeIndex]?.focus({ preventScroll: true });
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-2.5 mx-auto max-w-5xl rounded-full bg-[#111113]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all",
          className
        )}
      >
        {/* Brand identity */}
        <a
          href="#hero"
          onClick={(e) => followHash(e, "#hero")}
          className="flex items-center gap-2 group cursor-pointer pl-1"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-400 p-[1.5px] transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-[#0E0E10] flex items-center justify-center font-bold text-xs tracking-tighter text-teal-300 font-display">
              AK
            </div>
          </div>
          <span className="font-display text-sm sm:text-base font-bold text-white tracking-wider group-hover:text-teal-300 transition-colors">
            ANANNYA AK
          </span>
        </a>

        {/* Morphic split nav links for tablet/desktop */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex justify-center"
        >
          <div
            className="relative flex touch-pan-y select-none items-center"
            onBlur={onRowBlur}
            onClickCapture={onClickCapture}
            onKeyDown={onKeyDown}
            onPointerCancel={(event) => endDrag(event, false)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={(event) => endDrag(event, true)}
            ref={rowRef}
          >
            {entries.map(([path, { name }], index) => (
              <Segment
                current={index === activeIndex}
                fold={fold}
                hidden={folded && index !== activeIndex}
                highlighted={index === highlightIndex}
                href={path}
                key={`${count}-${path}`}
                linkRef={(el) => {
                  linkRefs.current[index] = el;
                }}
                name={name}
                nextX={xs[index + 1]}
                onFocus={(event) => onLinkFocus(index, event)}
                onHover={(event, entering) => onHover(index, event, entering)}
                onSelect={() => selectIndex(index)}
                pinned={index === activeIndex}
                prevX={xs[index - 1]}
                x={xs[index] ?? fold}
              />
            ))}
            {compact ? (
              <motion.button
                aria-expanded={!folded}
                aria-hidden={!folded}
                aria-label="Show all links"
                className={cn(
                  "absolute top-0 left-0 flex size-10 items-center justify-center rounded-xl text-zinc-400 transition-colors duration-150 hover:text-zinc-100",
                  SURFACE,
                  FOCUS_RING,
                  folded ? "z-30" : "pointer-events-none z-0"
                )}
                data-chevron=""
                onClick={openFolded}
                style={{ transform: chevronTransform, opacity: fold }}
                tabIndex={folded ? 0 : -1}
                type="button"
              >
                <ChevronIcon />
              </motion.button>
            ) : null}
          </div>
        </nav>

        {/* Action items on right: Resume link and Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <a
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-teal-300 bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 hover:border-teal-400 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(20,184,166,0.15)]"
          >
            Resume
          </a>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="md:hidden flex flex-col items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span
              className={cn(
                "w-4 h-0.5 bg-current transition-transform duration-300",
                mobileMenuOpen && "rotate-45 translate-y-1.5"
              )}
            />
            <span
              className={cn(
                "w-4 h-0.5 bg-current my-1 transition-opacity duration-300",
                mobileMenuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "w-4 h-0.5 bg-current transition-transform duration-300",
                mobileMenuOpen && "-rotate-45 -translate-y-1.5"
              )}
            />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-6 p-6 animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex flex-col items-center gap-5 w-full max-w-xs">
            {entries.map(([path, { name }]) => (
              <a
                key={path}
                href={path}
                onClick={(e) => {
                  followHash(e, path);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full text-center py-3 text-lg font-display rounded-2xl transition-all border",
                  activePath === path
                    ? "bg-teal-500/20 text-teal-300 border-teal-500/40 font-semibold"
                    : "text-zinc-300 hover:text-white border-transparent hover:bg-white/5"
                )}
              >
                {name}
              </a>
            ))}
            <a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 mt-2 rounded-2xl text-sm font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              View Resume
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default MorphicNavbar;
