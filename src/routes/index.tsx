import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, lazy, Suspense } from "react";
import { Reveal, RevealLines } from "@/components/reveal";

const CinematicCanvas = lazy(() =>
  import("@/components/cinematic-canvas").then((m) => ({ default: m.CinematicCanvas })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dilli Ganesh — Video Editor Learning to Code" },
      {
        name: "description",
        content:
          "Cinematic portfolio of Dilli Ganesh: video editor, BCA year one, aspiring creative technologist. Every frame has a story.",
      },
      { property: "og:title", content: "Dilli Ganesh — Video Editor Learning to Code" },
      {
        property: "og:description",
        content:
          "Cinematic portfolio of a video editor turning into a creative technologist. Edit. Frame. Story. Code.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAME = "DILLI GANESH";

const projects = [
  {
    no: "01",
    title: "NIGHT SHIFT",
    meta: "VIDEO EDITING / SHORT FILM / 2026",
    body: "A six-minute night drive cut to breathing room. Long takes, almost no music, every cut placed on a headlight.",
  },
  {
    no: "02",
    title: "LOUD QUIET LOUD",
    meta: "EDITING / MUSIC / 2025",
    body: "Rhythm-first assembly. The edit follows the drums until it deliberately stops following them.",
  },
  {
    no: "03",
    title: "SEVEN DAYS",
    meta: "DOCUMENTARY / COLOR / 2025",
    body: "A week compressed into four minutes. Built entirely from B-roll and one voice recorded on a phone.",
  },
  {
    no: "04",
    title: "FIRST COMMIT",
    meta: "CODE / INTERFACE / 2026",
    body: "My first real interface. Terrible in places, honest everywhere. The beginning of the second craft.",
  },
];

function Timecode() {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setFrame((f) => (f + 1) % 24), 1000 / 12);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="mono-label">
      00:0{Math.floor(frame / 12)}:{String(frame).padStart(2, "0")}
    </span>
  );
}

function useActiveWordHighlight(sectionId: string) {
  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const items = section.querySelectorAll<HTMLElement>("[data-word]");
    if (!items.length) return;

    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -rect.top / total));
      const idx = Math.min(items.length - 1, Math.floor(p * items.length));
      items.forEach((el, i) => {
        el.dataset.active = i === idx ? "true" : "false";
        // Progressive opacity for depth feel in 2D fallback
        const dist = Math.abs(i - idx);
        el.style.opacity = String(Math.max(0.2, 1 - dist * 0.22));
      });
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sectionId]);
}

function Index() {
  useActiveWordHighlight("scene-transform");

  return (
    <main className="grain min-h-screen bg-background text-foreground">
      {/* HUD */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-4 sm:px-5 sm:py-5 md:px-10">
        <span className="mono-label">{NAME}</span>
        <Timecode />
      </div>

      {/* SCENE 01 — HERO */}
      <section className="flex min-h-[100svh] flex-col justify-center px-4 pt-24 pb-16 sm:px-5 md:px-10 md:pt-28 md:pb-20">
        <Reveal className="mb-8 md:mb-10">
          <span className="mono-label fade-rise block">SCENE 01 / OPENING</span>
        </Reveal>

        {/* Mobile: stacked single words for maximum impact */}
        <div className="md:hidden">
          <RevealLines
            className="display-xl uppercase"
            lines={[
              <>I</>,
              <>EDIT.</>,
              <>I</>,
              <>CREATE.</>,
              <>
                I <span className="text-accent">CODE.</span>
              </>,
            ]}
          />
        </div>
        <div className="hidden md:block">
          <RevealLines
            className="display-xl uppercase"
            lines={[
              <>I EDIT.</>,
              <>I CREATE.</>,
              <>
                I <span className="text-accent">CODE.</span>
              </>,
            ]}
          />
        </div>

        <Reveal className="mt-10 flex flex-col gap-6 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-8">
          <p className="body-copy fade-rise max-w-sm text-balance">
            still learning. still building.{" "}
            <span className="editorial text-foreground">still becoming.</span>
          </p>
          <span className="mono-label fade-rise" style={{ transitionDelay: "120ms" }}>
            <span className="sm:hidden">VIDEO EDITOR / BCA · Y01</span>
            <span className="hidden sm:inline">
              V I D E O &nbsp; E D I T O R &nbsp;/&nbsp; BCA · YEAR 01
            </span>
          </span>
        </Reveal>
      </section>

      {/* SCENE 02 — 3D TYPOGRAPHY TRANSITION
          Tall scroll runway + sticky viewport. Camera flies through the words.
          Mobile uses a shorter runway to reduce fatigue. */}
      <section
        id="scene-transform"
        className="relative border-t border-border h-[220vh] md:h-[320vh]"
      >
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-background">
          <Suspense fallback={null}>
            <CinematicCanvas sectionId="scene-transform" />
          </Suspense>

          {/* Readable overlay — always present for a11y & reduced-motion */}
          <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between px-4 py-16 sm:px-5 sm:py-20 md:px-10 md:py-24">
            <div className="flex items-baseline justify-between gap-4">
              <span className="mono-label block">SCENE 02 / TRANSITION</span>
              <span className="mono-label block opacity-50">SCROLL</span>
            </div>

            {/* 2D word rail — works without WebGL; cinematic even when reduced-motion */}
            <ul className="flex flex-col gap-0.5 md:gap-0" aria-label="Journey words">
              {["EDIT", "FRAME", "STORY", "CODE", "BUILD", "FUTURE"].map((word, i) => (
                <li
                  key={word}
                  className="font-[family-name:var(--type-display)] text-[clamp(1.75rem,6vw,4.5rem)] font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground transition-[opacity,color] duration-500"
                  data-word={word}
                  data-index={i}
                >
                  {word}
                </li>
              ))}
            </ul>

            <div className="max-w-xl">
              <p className="body-copy !max-w-md text-balance opacity-90">
                The words change. The instinct doesn&apos;t.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 03 — SELECTED WORK */}
      <section className="border-t border-border px-4 py-24 sm:px-5 md:px-10 md:py-48">
        <Reveal className="mb-16 flex items-baseline justify-between md:mb-24">
          <span className="mono-label fade-rise">SCENE 03 / SELECTED WORK</span>
          <span className="mono-label fade-rise">04 ENTRIES</span>
        </Reveal>

        <div className="space-y-20 md:space-y-40">
          {projects.map((p) => (
            <Reveal as="article" key={p.no} className="grid gap-4 md:grid-cols-12 md:gap-6">
              <div className="md:col-span-2">
                <span className="mono-label fade-rise text-accent">{p.no}</span>
              </div>
              <div className="md:col-span-10">
                <RevealLines
                  className="heading uppercase"
                  lines={[<>{p.title}</>]}
                  lineClassName="hover:tracking-tight"
                />
                <p
                  className="mono-label fade-rise mt-4 md:mt-5"
                  style={{ transitionDelay: "160ms" }}
                >
                  {p.meta}
                </p>
                <p
                  className="body-copy fade-rise mt-5 md:mt-6"
                  style={{ transitionDelay: "240ms" }}
                >
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SCENE 04 — ABOUT */}
      <section className="border-t border-border px-4 py-24 sm:px-5 md:px-10 md:py-48">
        <Reveal className="mb-10 md:mb-14">
          <span className="mono-label fade-rise block">04 / ABOUT</span>
        </Reveal>
        <RevealLines
          className="display-m uppercase"
          lines={[<>I&apos;M STILL</>, <>FIGURING IT OUT.</>]}
        />
        <Reveal className="mt-10 grid gap-8 md:mt-12 md:grid-cols-2 md:gap-10">
          <p className="body-copy fade-rise">
            I started in a timeline — trimming, pacing, chasing the exact frame where a shot
            stops being footage and starts being a story. Editing taught me rhythm, patience
            and the discipline of removing things.
          </p>
          <p className="body-copy fade-rise" style={{ transitionDelay: "140ms" }}>
            Now I&apos;m in my first year of BCA, learning to build the tools instead of only using
            them. Same instinct, different timeline: structure, timing, and the quiet
            satisfaction of something finally cutting clean.
          </p>
        </Reveal>
      </section>

      {/* SCENE 05 — NEXT CHAPTER */}
      <section className="border-t border-border px-4 py-24 sm:px-5 md:px-10 md:py-48">
        <Reveal className="mb-10 md:mb-14">
          <span className="mono-label fade-rise block">SCENE 05 / NEXT CHAPTER</span>
        </Reveal>
        <RevealLines
          className="display-l uppercase"
          lines={[
            <>VIDEO</>,
            <span className="text-muted-foreground">↓</span>,
            <>CODE</>,
            <span className="text-muted-foreground">↓</span>,
            <>
              EVERYTHING <span className="editorial lowercase text-accent">in between.</span>
            </>,
          ]}
        />
      </section>

      {/* SCENE 06 — CONTACT */}
      <section className="border-t border-border px-4 py-24 sm:px-5 md:px-10 md:py-48">
        <Reveal className="mb-10 md:mb-14">
          <span className="mono-label fade-rise block">SCENE 06 / CONTACT</span>
        </Reveal>
        <RevealLines className="display-m uppercase" lines={[<>GOT A STORY?</>]} />
        <div className="md:hidden">
          <RevealLines
            className="display-xl mt-4 uppercase"
            lines={[<>LET&apos;S</>, <>MAKE</>, <>SOMETHING.</>]}
          />
        </div>
        <div className="hidden md:block">
          <RevealLines
            className="display-xl mt-6 uppercase"
            lines={[<>LET&apos;S</>, <>MAKE</>, <>SOMETHING.</>]}
          />
        </div>
        <Reveal className="mt-12 flex flex-wrap gap-x-10 gap-y-5 md:mt-16 md:gap-x-14 md:gap-y-6">
          <a
            href="mailto:hello@example.com"
            className="mono-label pointer-events-auto transition-colors hover:text-accent"
          >
            EMAIL
          </a>
          <a href="#" className="mono-label pointer-events-auto transition-colors hover:text-accent">
            INSTAGRAM
          </a>
          <a href="#" className="mono-label pointer-events-auto transition-colors hover:text-accent">
            YOUTUBE
          </a>
          <a href="#" className="mono-label pointer-events-auto transition-colors hover:text-accent">
            GITHUB
          </a>
        </Reveal>
      </section>

      {/* FINAL SHOT */}
      <footer className="border-t border-border px-4 py-24 sm:px-5 md:px-10 md:py-52">
        <Reveal>
          <span className="mono-label fade-rise block">END OF SEQUENCE</span>
        </Reveal>
        <RevealLines
          className="display-m mt-10 uppercase md:mt-12"
          lines={[<>EVERY FRAME</>, <>HAS A STORY.</>]}
        />
        <RevealLines
          className="display-m mt-8 uppercase text-muted-foreground md:mt-10"
          lines={[<>I&apos;M LEARNING</>, <>TO BUILD THEM TOO.</>]}
        />
        <Reveal className="mt-16 flex flex-col gap-4 sm:mt-24 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between">
          <h2 className="heading fade-rise uppercase">{NAME}</h2>
          <p className="mono-label fade-rise">
            VIDEO EDITOR / BCA / ASPIRING CREATIVE TECHNOLOGIST
          </p>
        </Reveal>
      </footer>
    </main>
  );
}
