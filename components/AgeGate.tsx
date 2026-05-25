"use client";

import { useEffect, useState } from "react";

const KEY = "aurix-age-ok";

export function AgeGate() {
  const [status, setStatus] = useState<"checking" | "open" | "denied" | "ok">(
    "checking",
  );

  useEffect(() => {
    try {
      setStatus(localStorage.getItem(KEY) === "1" ? "ok" : "open");
    } catch {
      setStatus("open");
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      status === "open" || status === "denied" ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [status]);

  if (status === "ok" || status === "checking") return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setStatus("ok");
  };

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-ink/95 px-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Age verification"
    >
      <div className="w-full max-w-md text-center">
        <p className="font-display text-4xl tracking-[0.34em] text-ivory">
          AURIX
        </p>
        <div className="rule-gold mx-auto my-8" />
        {status === "open" ? (
          <>
            <p className="font-serif text-2xl italic leading-snug text-cream">
              A considered indulgence for those of legal drinking age.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-mute">
              Please confirm you are 21 years or older to enter.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={accept}
                className="min-h-[52px] bg-gold px-10 font-sans text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
              >
                I am 21 or older
              </button>
              <button
                onClick={() => setStatus("denied")}
                className="min-h-[52px] border border-line px-10 font-sans text-xs uppercase tracking-[0.25em] text-mute transition-colors hover:text-ivory"
              >
                I am under 21
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="font-serif text-2xl italic leading-snug text-cream">
              We&apos;re sorry.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-mute">
              You must be of legal drinking age to enter AURIX. Please come back
              when you are.
            </p>
            <button
              onClick={() => setStatus("open")}
              className="mt-10 font-sans text-xs uppercase tracking-[0.25em] text-gold underline-offset-4 hover:underline"
            >
              Go back
            </button>
          </>
        )}
        <p className="mt-12 text-[0.65rem] leading-relaxed tracking-wide text-mute-2">
          Please enjoy AURIX responsibly.
        </p>
      </div>
    </div>
  );
}
