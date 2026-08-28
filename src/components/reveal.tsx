import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  as: Tag = "div",
  threshold = 0.25,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "li" | "article";
  threshold?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    // @ts-expect-error dynamic tag ref typing
    <Tag ref={ref} className={`${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </Tag>
  );
}

/** Masked line-by-line reveal for cinematic display type. */
export function RevealLines({
  lines,
  className = "",
  lineClassName = "",
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
}) {
  return (
    <Reveal className={className} threshold={0.2}>
      {lines.map((line, i) => (
        <span key={i} className="reveal-mask">
          <span
            className={`reveal-line ${lineClassName}`}
            style={{ transitionDelay: `${i * 110}ms` }}
          >
            {line}
          </span>
        </span>
      ))}
    </Reveal>
  );
}
