"use client";

import { Fragment, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useLocale } from "@/i18n/locale-provider";
import { useExotica } from "@/content/schema-ext";
import {
  CARS,
  POSITIONS,
  PROFILE,
  ROOM,
  LOOP_EVIDENCE,
  HISTOGRAM_KEY,
  framePath,
  type Car,
} from "@/content/media";
import histogramData from "@/data/histogram.json";
import { ColourSolid } from "@/components/webgl/colour-solid";

/* ---------------------------------------------------------------- motion -- */

function useOnScreen<T extends HTMLElement>(rootMargin = "-8% 0px -8% 0px") {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reveal = () => node.setAttribute("data-seen", "");
    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          reveal();
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [rootMargin]);
  return ref;
}

/** Every child of an Advance block arrives on the same fixed 60ms clock,
 *  jumping from absent to present in a single frame -- no easing, no travel,
 *  matching the hard cut their own carousel makes between position 4 and 5. */
function ai(i: number): CSSProperties {
  return { "--advance-i": i } as CSSProperties;
}

function Advance({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useOnScreen<HTMLDivElement>();
  return (
    <div ref={ref} data-advance="" className={className}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------- mark -- */

/** Their roundel, traced from the wall with OpenCV: a thin ring holding four
 *  tapering organic strokes meeting at an off-centre junction. */
function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1000 1000" className={className} aria-hidden focusable="false">
      <ellipse cx="490.5" cy="521.7" rx="442.7" ry="476.4" fill="none" stroke="currentColor" strokeWidth="16.7" />
      <g fill="currentColor">
        <path d="M 485.6 64.4 C 476.7 68.1 512.8 86.3 522.2 100.0 C 531.7 113.7 538.5 115.9 542.2 146.7 C 545.9 177.4 547.0 255.4 544.4 284.4 C 541.9 313.5 533.1 313.7 526.7 321.1 C 520.2 328.5 518.7 328.0 505.6 328.9 C 492.4 329.8 460.7 323.3 447.8 326.7 C 434.8 330.0 430.9 342.0 427.8 348.9 C 424.6 355.7 421.9 353.5 428.9 367.8 C 435.9 382.0 463.7 420.4 470.0 434.4 C 476.3 448.5 470.7 448.0 466.7 452.2 C 462.6 456.5 481.1 460.2 445.6 460.0 C 410.0 459.8 291.3 451.1 253.3 451.1 C 215.4 451.1 229.3 454.4 217.8 460.0 C 206.3 465.6 205.9 463.7 184.4 484.4 C 163.0 505.2 108.5 567.2 88.9 584.4 C 69.3 601.7 68.7 581.3 66.7 587.8 C 64.6 594.3 71.3 619.6 76.7 623.3 C 82.0 627.0 77.4 613.9 98.9 610.0 C 120.4 606.1 166.9 620.0 205.6 600.0 C 244.3 580.0 296.3 508.9 331.1 490.0 C 365.9 471.1 391.7 484.6 414.4 486.7 C 437.2 488.7 453.0 495.4 467.8 502.2 C 482.6 509.1 493.1 516.9 503.3 527.8 C 513.5 538.7 523.5 554.8 528.9 567.8 C 534.3 580.7 534.8 583.3 535.6 605.6 C 536.3 627.8 531.9 679.1 533.3 701.1 C 534.8 723.1 530.7 722.6 544.4 737.8 C 558.1 753.0 597.6 775.6 615.6 792.2 C 633.5 808.9 643.7 822.0 652.2 837.8 C 660.7 853.5 664.4 868.1 666.7 886.7 C 668.9 905.2 660.0 941.3 665.6 948.9 C 671.1 956.5 696.1 979.6 700.0 932.2 C 703.9 884.8 693.0 714.6 688.9 664.4 C 684.8 614.3 705.9 669.1 675.6 631.1 C 645.2 593.1 534.8 471.9 506.7 436.7 C 478.5 401.5 502.0 423.5 506.7 420.0 C 511.3 416.5 520.0 414.8 534.4 415.6 C 548.9 416.3 573.7 418.0 593.3 424.4 C 613.0 430.9 612.8 418.7 652.2 454.4 C 691.7 490.2 789.3 599.4 830.0 638.9 C 870.7 678.3 882.6 691.5 896.7 691.1 C 910.7 690.7 910.2 659.8 914.4 636.7 C 918.7 613.5 923.7 563.7 922.2 552.2 C 920.7 540.7 913.5 564.1 905.6 567.8 C 897.6 571.5 887.2 574.8 874.4 574.4 C 861.7 574.1 841.3 569.8 828.9 565.6 C 816.5 561.3 839.1 589.4 800.0 548.9 C 760.9 508.3 630.2 366.1 594.4 322.2 C 558.7 278.3 585.6 310.9 585.6 285.6 C 585.6 260.2 588.1 196.3 594.4 170.0 C 600.7 143.7 610.9 136.9 623.3 127.8 C 635.7 118.7 676.9 123.9 668.9 115.6 C 660.9 107.2 606.1 86.3 575.6 77.8 C 545.0 69.3 494.4 60.7 485.6 64.4 Z" />
        <path d="M 108.9 283.3 C 106.7 287.8 108.3 285.2 108.9 285.6 C 109.4 285.9 107.8 287.0 112.2 285.6 C 116.7 284.1 125.4 278.3 135.6 276.7 C 145.7 275.0 165.2 275.4 173.3 275.6 C 181.5 275.7 180.6 276.5 184.4 277.8 C 188.3 279.1 193.0 282.0 196.7 283.3 C 200.4 284.6 203.5 283.9 206.7 285.6 C 209.8 287.2 213.1 291.9 215.6 293.3 C 218.0 294.8 213.7 290.4 221.1 294.4 C 228.5 298.5 253.0 313.9 260.0 317.8 C 267.0 321.7 261.1 316.7 263.3 317.8 C 265.6 318.9 269.4 322.8 273.3 324.4 C 277.2 326.1 281.5 325.9 286.7 327.8 C 291.9 329.6 299.3 333.7 304.4 335.6 C 309.6 337.4 314.6 338.3 317.8 338.9 C 320.9 339.4 321.5 338.5 323.3 338.9 C 325.2 339.3 324.4 340.7 328.9 341.1 C 333.3 341.5 345.7 341.5 350.0 341.1 C 354.3 340.7 353.1 339.3 354.4 338.9 C 355.7 338.5 356.1 339.4 357.8 338.9 C 359.4 338.3 362.6 336.9 364.4 335.6 C 366.3 334.3 367.6 333.0 368.9 331.1 C 370.2 329.3 372.0 328.9 372.2 324.4 C 372.4 320.0 371.1 309.4 370.0 304.4 C 368.9 299.4 368.1 298.7 365.6 294.4 C 363.0 290.2 356.7 282.6 354.4 278.9 C 352.2 275.2 353.5 273.9 352.2 272.2 C 350.9 270.6 348.5 270.4 346.7 268.9 C 344.8 267.4 342.4 265.0 341.1 263.3 C 339.8 261.7 344.6 264.8 338.9 258.9 C 333.1 253.0 312.6 233.1 306.7 227.8 C 300.7 222.4 305.6 228.3 303.3 226.7 C 301.1 225.0 296.1 219.8 293.3 217.8 C 290.6 215.7 288.7 215.9 286.7 214.4 C 284.6 213.0 283.1 210.2 281.1 208.9 C 279.1 207.6 276.9 208.1 274.4 206.7 C 272.0 205.2 269.1 201.5 266.7 200.0 C 264.3 198.5 262.6 199.4 260.0 197.8 C 257.4 196.1 253.5 191.5 251.1 190.0 C 248.7 188.5 248.9 190.9 245.6 188.9 C 242.2 186.9 235.0 181.3 231.1 177.8 C 227.2 174.3 224.4 172.0 222.2 167.8 C 220.0 163.5 219.4 154.4 217.8 152.2 C 216.1 150.0 215.9 151.7 212.2 154.4 C 208.5 157.2 203.7 160.9 195.6 168.9 C 187.4 176.9 172.2 192.2 163.3 202.2 C 154.4 212.2 149.1 219.4 142.2 228.9 C 135.4 238.3 127.8 249.8 122.2 258.9 C 116.7 268.0 111.1 278.9 108.9 283.3 Z" />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------- nav -- */

export function Nav() {
  const { dir, toggleLocale } = useLocale();
  const c = useExotica();
  return (
    <header className="sticky top-0 z-40 border-b border-rule/40 bg-ground/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <a href="#top" className="signmark flex items-center gap-2 text-sm">
          <Mark className="h-6 w-6" />
          EXOTICA
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {c.nav.map((l) => (
            <a key={l.href} href={l.href} className="label hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <button onClick={toggleLocale} className="chip rounded-sm border border-ink/60 px-2.5 py-1.5">
          {dir === "rtl" ? "EN" : "ع"}
        </button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------- hero -- */

function Hero() {
  const c = useExotica();
  return (
    <section id="top" className="mx-auto max-w-6xl px-5 pb-14 pt-10 sm:pt-16">
      <Advance className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div data-advance-item style={ai(0)} className="min-w-0">
          <p className="label mb-4">{c.hero.eyebrow}</p>
          <h1 className="sign text-hero m-hero mb-5">{c.hero.headline}</h1>
          <p className="text-lead max-w-prose text-ink-soft">{c.hero.sub}</p>
          <p className="fine mt-4 border-s-2 border-ink ps-3 italic text-ink">{c.hero.finding}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={PROFILE.phone.startsWith("+") ? `tel:${PROFILE.phone.replace(/\s/g, "")}` : "#contact"} className="rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-plate">
              {c.hero.primaryCta}
            </a>
            <a href="#loop" className="label rounded-sm border border-ink/50 px-5 py-2.5">
              {c.hero.secondaryCta}
            </a>
          </div>
        </div>
        <div data-advance-item style={ai(1)} className="grid grid-cols-2 gap-3 self-start">
          {c.hero.counts.map((s) => (
            <div key={s.label} className="rounded-sm bg-plate p-4">
              <p className="signmark tnum text-2xl text-ink">{s.value}</p>
              <p className="fine text-ink-soft">{s.label}</p>
            </div>
          ))}
        </div>
      </Advance>
    </section>
  );
}

/* ------------------------------------------------------------------- loop -- */

function Loop() {
  const c = useExotica();
  return (
    <section id="loop" className="border-t border-rule/40 bg-plate/60 py-14">
      <div className="mx-auto max-w-6xl px-5">
        <Advance className="max-w-3xl">
          <p data-advance-item style={ai(0)} className="label mb-3">{c.loop.eyebrow}</p>
          <h2 data-advance-item style={ai(1)} className="sign text-display m-head mb-4">{c.loop.heading}</h2>
          <p data-advance-item style={ai(2)} className="text-ink-soft">{c.loop.intro}</p>
        </Advance>

        <Advance className="mt-8 overflow-x-auto">
          <div data-advance-item style={ai(0)} className="grid min-w-[520px] grid-cols-[1fr_auto_auto] gap-x-6 gap-y-2 text-sm">
            <p className="label border-b border-rule/50 pb-2">{c.loop.columns.car}</p>
            <p className="label border-b border-rule/50 pb-2 text-right">{c.loop.columns.rmse}</p>
            <p className="label border-b border-rule/50 pb-2">{c.loop.columns.note}</p>
            {LOOP_EVIDENCE.map((row) => {
              const car = CARS.find((cc) => cc.id === row.carId)!;
              return (
                <Fragment key={row.carId}>
                  <p className="latin border-b border-rule/20 py-2">{car.marque} {car.model}</p>
                  <p className="tnum border-b border-rule/20 py-2 text-right">{row.rmse.toFixed(3)}</p>
                  <p className="fine border-b border-rule/20 py-2 text-ink-soft">
                    {"note" in row ? row.note : "0 ↔ 10"}
                  </p>
                </Fragment>
              );
            })}
          </div>
        </Advance>
        <p className="fine mt-4 max-w-3xl text-ink-soft">{c.loop.method}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ solid -- */

function Solid() {
  const c = useExotica();
  return (
    <section id="solid" className="border-t border-rule/40 py-14">
      <div className="mx-auto max-w-6xl px-5">
        <Advance className="max-w-3xl">
          <p data-advance-item style={ai(0)} className="label mb-3">{c.solid.eyebrow}</p>
          <h2 data-advance-item style={ai(1)} className="sign text-display m-head mb-4">{c.solid.heading}</h2>
          <p data-advance-item style={ai(2)} className="text-ink-soft">{c.solid.intro}</p>
        </Advance>
        <div className="mt-8">
          <ColourSolid
            labels={{
              carLabel: c.solid.carLabel,
              positionLabel: c.solid.positionLabel,
              caliperLabel: c.solid.caliperLabel,
              caliperReadout: c.solid.caliperReadout,
              legendCore: c.solid.legendCore,
              legendChroma: c.solid.legendChroma,
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- protocol -- */

function Positions() {
  const c = useExotica();
  const { dir } = useLocale();
  return (
    <section className="border-t border-rule/40 bg-plate/60 py-14">
      <div className="mx-auto max-w-6xl px-5">
        <Advance className="max-w-3xl">
          <p data-advance-item style={ai(0)} className="label mb-3">{c.positions.eyebrow}</p>
          <h2 data-advance-item style={ai(1)} className="sign text-display m-head mb-4">{c.positions.heading}</h2>
          <p data-advance-item style={ai(2)} className="text-ink-soft">{c.positions.intro}</p>
        </Advance>

        <Advance className="mt-8 flex flex-col gap-2">
          {POSITIONS.map((p, i) => {
            const isInterior = i >= 5 && i <= 9;
            return (
              <div key={p.key} data-advance-item style={ai(i)} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3">
                <span className="chip tnum text-ink-soft">{String(i).padStart(2, "0")}</span>
                <div className="h-2.5 overflow-hidden rounded-sm bg-rule/25">
                  <div
                    className="hard-cut h-full"
                    style={{ width: `${Math.min(100, meanSatFor(i) * 260)}%`, background: isInterior ? "var(--color-ink)" : "var(--color-ink-soft)" }}
                  />
                </div>
                <span className={dir === "rtl" ? "chip-loc text-xs" : "chip text-xs"}>{dir === "rtl" ? p.ar : p.en}</span>
              </div>
            );
          })}
        </Advance>
        <p className="fine mt-3 text-ink-soft">{c.positions.boundaryLabel}: 04 → 05</p>

        <div className="mt-8 rounded-sm border-s-2 border-ink bg-ground/60 p-4 ps-4">
          <p className="label mb-1">{c.positions.exceptionLabel}</p>
          <p className="fine text-ink-soft">{c.positions.exceptionNote}</p>
        </div>
      </div>
    </section>
  );
}

/** Mean saturation per position across the seven photographed cars, from the
 *  same build-time histogram data that drives the 3D piece. */
function meanSatFor(pos: number): number {
  const cars = histogramData.cars as Record<string, { positions: { pos: number; mean: number }[] }>;
  let sum = 0;
  let n = 0;
  for (const key of Object.values(HISTOGRAM_KEY)) {
    if (!key) continue;
    const car = cars[key];
    const p = car?.positions.find((x) => x.pos === pos);
    if (p) {
      sum += p.mean;
      n++;
    }
  }
  return n > 0 ? sum / n : 0;
}

/* ----------------------------------------------------------------- cabins -- */

function Cabins() {
  const c = useExotica();
  const cars = histogramData.cars as Record<string, { cabinHex: string | null; chromaTier: string; chromaShare: number }>;
  const photographed = CARS.filter((car) => car.hasPhotos);

  return (
    <section id="cabins" className="border-t border-rule/40 py-14">
      <div className="mx-auto max-w-6xl px-5">
        <Advance className="max-w-3xl">
          <p data-advance-item style={ai(0)} className="label mb-3">{c.cabins.eyebrow}</p>
          <h2 data-advance-item style={ai(1)} className="sign text-display m-head mb-4">{c.cabins.heading}</h2>
          <p data-advance-item style={ai(2)} className="text-ink-soft">{c.cabins.intro}</p>
        </Advance>

        <Advance className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photographed.map((car, i) => {
            const key = HISTOGRAM_KEY[car.id]!;
            const data = cars[key];
            const tierLabel = data.chromaTier === "vivid" ? c.cabins.tierVivid : data.chromaTier === "muted" ? c.cabins.tierMuted : c.cabins.tierNone;
            return (
              <div key={car.id} data-advance-item style={ai(i)} className="min-w-0 overflow-hidden rounded-sm bg-plate">
                <div
                  className="h-20 w-full"
                  style={{ background: data.cabinHex ?? "var(--color-rule)" }}
                  aria-label={data.cabinHex ? `${car.marque} ${car.model} cabin hide` : undefined}
                />
                <div className="p-3">
                  <p className="latin text-xs font-medium">{car.marque} {car.model}</p>
                  <p className="fine mt-1 text-ink-soft">{tierLabel}{data.cabinHex ? ` · ${data.cabinHex}` : ""}</p>
                  {data.chromaTier === "none" && (
                    <p className="fine mt-1 text-ink-soft">
                      {c.cabins.noneNote.replace("{pct}", `${(data.chromaShare * 100).toFixed(3)}%`)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </Advance>
        <p className="fine mt-4 max-w-3xl text-ink-soft">{c.cabins.method}</p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- roster -- */

function specRows(car: Car, specLabels: Record<string, string>, notStated: string) {
  const order: (keyof Car["spec"])[] = ["year", "mileage", "displacement", "power", "torque", "zeroToHundred", "transmission", "drivetrain"];
  return order.map((key) => ({
    label: specLabels[key],
    value: car.spec[key] ?? notStated,
    stated: Boolean(car.spec[key]),
  }));
}

function CarCard({ car, index }: { car: Car; index: number }) {
  const c = useExotica();
  const key = HISTOGRAM_KEY[car.id];
  const rows = specRows(car, c.roster.specLabels, c.roster.notStated);
  const exteriorFrame = key ? framePath(car.id, 1) : null;
  const interiorFrame = key ? framePath(car.id, 8) : null;
  const cabin = key ? (histogramData.cars as Record<string, { cabinHex: string | null }>)[key]?.cabinHex : null;

  return (
    <div data-advance-item style={ai(index)} className="grid gap-0 overflow-hidden rounded-sm bg-plate sm:grid-cols-2">
      <div className="relative aspect-[4/3] min-w-0 overflow-hidden">
        {exteriorFrame && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={exteriorFrame} alt={`${car.marque} ${car.model} — exterior`} className="h-full w-full object-cover grayscale" loading="lazy" />
        )}
        <span className="chip absolute start-2 top-2 rounded-sm bg-floor/80 px-2 py-1 text-plate">{c.roster.exteriorLabel}</span>
      </div>
      <div className="relative aspect-[4/3] min-w-0 overflow-hidden">
        {interiorFrame && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={interiorFrame} alt={`${car.marque} ${car.model} — interior`} className="h-full w-full object-cover" loading="lazy" style={cabin ? { boxShadow: `inset 3px 0 0 ${cabin}` } : undefined} />
        )}
        <span className="chip absolute start-2 top-2 rounded-sm bg-floor/80 px-2 py-1 text-plate">{c.roster.interiorLabel}</span>
      </div>
      <div className="col-span-full p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="latin text-base font-semibold">{car.marque} {car.model}</h3>
          {car.frameCount !== 11 && (
            <span className="fine text-ink-soft">{c.roster.frameCountNote.replace("{n}", String(car.frameCount))}</span>
          )}
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-4">
          {rows.map((r) => (
            <div key={r.label}>
              <dt className="fine text-ink-soft">{r.label}</dt>
              <dd className={`tnum text-sm ${r.stated ? "" : "text-ink-soft/70 italic"}`}>{r.value}</dd>
            </div>
          ))}
        </dl>
        {car.quotes && (
          <div className="mt-3 flex flex-col gap-1">
            {car.quotes.map((q, i) => (
              <p key={i} className="fine italic">
                {q.ar && <span className="bidi" dir="rtl">{q.ar}</span>}
                {q.en && <span className="latin block">{q.en}</span>}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Roster() {
  const c = useExotica();
  const photographed = CARS.filter((car) => car.hasPhotos);
  return (
    <section id="roster" className="border-t border-rule/40 bg-plate/60 py-14">
      <div className="mx-auto max-w-6xl px-5">
        <Advance className="max-w-3xl">
          <p data-advance-item style={ai(0)} className="label mb-3">{c.roster.eyebrow}</p>
          <h2 data-advance-item style={ai(1)} className="sign text-display m-head mb-4">{c.roster.heading}</h2>
          <p data-advance-item style={ai(2)} className="text-ink-soft">{c.roster.intro}</p>
        </Advance>
        <Advance className="mt-8 grid gap-5">
          {photographed.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </Advance>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ money -- */

function Money() {
  const c = useExotica();
  const rox = CARS.find((car) => car.id === "rox-01-vip")!;
  return (
    <section className="border-t border-rule/40 py-14">
      <div className="mx-auto max-w-6xl px-5">
        <Advance className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div data-advance-item style={ai(0)} className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-sm bg-floor p-8 text-center text-plate">
            <Mark className="h-10 w-10 opacity-60" />
            <p className="fine max-w-xs text-plate/70">{c.money.noPhotoNote}</p>
          </div>
          <div data-advance-item style={ai(1)} className="min-w-0">
            <p className="label mb-3">{c.money.eyebrow}</p>
            <h2 className="sign text-display m-head mb-4">{c.money.heading}</h2>
            <p className="text-ink-soft">{c.money.intro}</p>
            <p className="signmark tnum mt-5 text-3xl">{rox.spec.price}</p>
            <p className="fine mt-1 text-ink-soft">{c.money.limitedOffer}</p>
            {rox.features && (
              <div className="mt-5">
                <p className="label mb-2">{c.money.featuresLabel}</p>
                <ul className="flex flex-col gap-1">
                  {rox.features.map((f) => (
                    <li key={f} className="fine list-inside list-disc">{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Advance>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- wall -- */

function Wall() {
  const c = useExotica();
  return (
    <section className="border-t border-rule/40 bg-plate/60 py-14">
      <div className="mx-auto max-w-6xl px-5">
        <Advance className="grid gap-8 md:grid-cols-2">
          <div data-advance-item style={ai(0)} className="min-w-0">
            <p className="label mb-3">{c.wall.eyebrow}</p>
            <h2 className="sign text-display m-head mb-4">{c.wall.heading}</h2>
            <p className="signmark text-lg">{PROFILE.strapline}</p>
            <p className="fine mt-2 text-ink-soft">{c.wall.straplineNote}</p>

            <p className="label mb-1 mt-6">{c.wall.bioLabel}</p>
            <p className="text-sm text-ink-soft">&ldquo;{PROFILE.bio}&rdquo;</p>

            <p className="label mb-1 mt-6">{c.wall.followsLabel}</p>
            <p className="latin text-sm">{PROFILE.follows}</p>
          </div>

          <div data-advance-item style={ai(1)} className="min-w-0">
            <p className="label mb-2">{c.wall.highlightsLabel}</p>
            <div className="flex flex-wrap gap-1.5">
              {PROFILE.highlights.map((h) => (
                <span key={h} className="chip chip-verbatim rounded-sm bg-ground px-2 py-1">{h}</span>
              ))}
            </div>
            <p className="fine mt-3 text-ink-soft">{c.wall.highlightsFootnote}</p>

            <p className="label mb-1 mt-6">{c.wall.languagesLabel}</p>
            <p className="fine text-ink-soft">{c.wall.languagesNote}</p>

            <p className="label mb-1 mt-6">Room, measured</p>
            <div className="flex gap-1.5">
              {[ROOM.wallPanel, ROOM.facetedWall, ROOM.floorMid, ROOM.floorNear, ROOM.panelDark].map((h) => (
                <div key={h} className="flex flex-col items-center gap-1">
                  <div className="h-8 w-8 rounded-sm border border-rule/40" style={{ background: h }} />
                  <span className="fine tnum text-[0.6rem] text-ink-soft">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </Advance>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- contact -- */

function Contact() {
  const c = useExotica();
  return (
    <section id="contact" className="border-t border-rule/40 py-14">
      <div className="mx-auto max-w-6xl px-5">
        <Advance className="grid gap-8 md:grid-cols-2">
          <div data-advance-item style={ai(0)}>
            <h2 className="sign text-display m-head mb-4">{c.contact.heading}</h2>
            <p className="label mb-1">{c.contact.addressLabel}</p>
            <p className="bidi mb-1">{c.contact.address}</p>
            <p className="fine mb-6 text-ink-soft">{c.contact.addressNote}</p>
            <p className="label mb-1">{c.contact.phoneLabel}</p>
            <a href={`tel:${PROFILE.phoneHref.replace("tel:", "")}`} className="latin tnum block text-lg">{PROFILE.phone}</a>
          </div>
          <div data-advance-item style={ai(1)} className="flex flex-col items-start gap-3">
            <a href={c.contact.mapsUrl} target="_blank" rel="noreferrer" className="label rounded-sm border border-ink/50 px-5 py-2.5">Maps</a>
            {c.contact.instagramUrl && (
              <a href={c.contact.instagramUrl} target="_blank" rel="noreferrer" className="label rounded-sm border border-ink/50 px-5 py-2.5">Instagram</a>
            )}
            <a href={`tel:${PROFILE.phoneHref.replace("tel:", "")}`} className="rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-plate">{c.contact.cta}</a>
          </div>
        </Advance>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ shell -- */

export function Sections() {
  return (
    <main>
      <Hero />
      <Loop />
      <Solid />
      <Positions />
      <Cabins />
      <Roster />
      <Money />
      <Wall />
      <Contact />
    </main>
  );
}

export function Footer() {
  const c = useExotica();
  return (
    <footer className="border-t border-rule/40 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5">
        <p className="fine text-ink-soft">{c.footer.rights}</p>
      </div>
    </footer>
  );
}
