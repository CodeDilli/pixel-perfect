import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Reveal, RevealLines } from "@/components/reveal";

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

function Index() {
  return (
    <main className="grain min-h-screen bg-background text-foreground">
      {/* HUD */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-5 md:px-10">
        <span className="mono-label">{NAME}</span>
        <Timecode />
      </div>

      {/* SCENE 01 — HERO */}
      <section className="flex min-h-screen flex-col justify-center px-5 pt-28 pb-20 md:px-10">
        <Reveal className="mb-10">
          <span className="mono-label fade-rise block">SCENE 01 / OPENING</span>
        </Reveal>
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
        <Reveal className="mt-12 flex flex-wrap items-end justify-between gap-8">
          <p className="body-copy fade-rise max-w-sm text-balance">
            still learning. still building.{" "}
            <span className="editorial text-foreground">still becoming.</span>
          </p>
          <span className="mono-label fade-rise" style={{ transitionDelay: "120ms" }}>
            V I D E O &nbsp; E D I T O R &nbsp;/&nbsp; BCA · YEAR 01
          </span>
        </Reveal>
      </section>

      {/* SCENE 02 — TRANSFORMATION */}
      <section className="border-t border-border px-5 py-32 md:px-10 md:py-48">
        <Reveal className="mb-16">
          <span className="mono-label fade-rise block">SCENE 02 / TRANSFORMATION</span>
        </Reveal>
        <ul className="space-y-2">
          {["EDIT", "FRAME", "STORY", "CODE", "BUILD", "FUTURE"].map((word, i) => (
            <Reveal as="li" key={word} threshold={0.6} className="group">
              <span className="reveal-mask flex items-baseline gap-6">
                <span
                  className="reveal-line display-l w-full transition-colors duration-500 hover:text-accent"
                  style={{ opacity: 1 - i * 0.06 }}
                >
                  {word}
                </span>
              </span>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-16">
          <p className="mono-label fade-rise">THE WORDS CHANGE. THE INSTINCT DOESN'T.</p>
        </Reveal>
      </section>

      {/* SCENE 03 — SELECTED WORK */}
      <section className="border-t border-border px-5 py-32 md:px-10 md:py-48">
        <Reveal className="mb-24 flex items-baseline justify-between">
          <span className="mono-label fade-rise">SCENE 03 / SELECTED WORK</span>
          <span className="mono-label fade-rise">04 ENTRIES</span>
        </Reveal>

        <div className="space-y-28 md:space-y-40">
          {projects.map((p) => (
            <Reveal as="article" key={p.no} className="grid gap-6 md:grid-cols-12">
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
                  className="mono-label fade-rise mt-5"
                  style={{ transitionDelay: "160ms" }}
                >
                  {p.meta}
                </p>
                <p
                  className="body-copy fade-rise mt-6"
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
      <section className="border-t border-border px-5 py-32 md:px-10 md:py-48">
        <Reveal className="mb-14">
          <span className="mono-label fade-rise block">04 / ABOUT</span>
        </Reveal>
        <RevealLines
          className="display-m uppercase"
          lines={[<>I'M STILL</>, <>FIGURING IT OUT.</>]}
        />
        <Reveal className="mt-12 grid gap-10 md:grid-cols-2">
          <p className="body-copy fade-rise">
            I started in a timeline — trimming, pacing, chasing the exact frame where a shot
            stops being footage and starts being a story. Editing taught me rhythm, patience
            and the discipline of removing things.
          </p>
          <p className="body-copy fade-rise" style={{ transitionDelay: "140ms" }}>
            Now I'm in my first year of BCA, learning to build the tools instead of only using
            them. Same instinct, different timeline: structure, timing, and the quiet
            satisfaction of something finally cutting clean.
          </p>
        </Reveal>
      </section>

      {/* SCENE 05 — NEXT CHAPTER */}
      <section className="border-t border-border px-5 py-32 md:px-10 md:py-48">
        <Reveal className="mb-14">
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
      <section className="border-t border-border px-5 py-32 md:px-10 md:py-48">
        <Reveal className="mb-14">
          <span className="mono-label fade-rise block">SCENE 06 / CONTACT</span>
        </Reveal>
        <RevealLines className="display-m uppercase" lines={[<>GOT A STORY?</>]} />
        <RevealLines
          className="display-xl mt-6 uppercase"
          lines={[<>LET'S</>, <>MAKE</>, <>SOMETHING.</>]}
        />
        <Reveal className="mt-16 flex flex-wrap gap-x-14 gap-y-6">
          <a
            href="mailto:hello@example.com"
            className="mono-label transition-colors hover:text-accent"
          >
            EMAIL
          </a>
          <a href="#" className="mono-label transition-colors hover:text-accent">
            INSTAGRAM
          </a>
          <a href="#" className="mono-label transition-colors hover:text-accent">
            YOUTUBE
          </a>
          <a href="#" className="mono-label transition-colors hover:text-accent">
            GITHUB
          </a>
        </Reveal>
      </section>

      {/* FINAL SHOT */}
      <footer className="border-t border-border px-5 py-32 md:px-10 md:py-52">
        <Reveal>
          <span className="mono-label fade-rise block">END OF SEQUENCE</span>
        </Reveal>
        <RevealLines
          className="display-m mt-12 uppercase"
          lines={[<>EVERY FRAME</>, <>HAS A STORY.</>]}
        />
        <RevealLines
          className="display-m mt-10 uppercase text-muted-foreground"
          lines={[<>I'M LEARNING</>, <>TO BUILD THEM TOO.</>]}
        />
        <Reveal className="mt-24 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="heading fade-rise uppercase">{NAME}</h2>
          <p className="mono-label fade-rise">
            VIDEO EDITOR / BCA / ASPIRING CREATIVE TECHNOLOGIST
          </p>
        </Reveal>
      </footer>
    </main>
  );
}
