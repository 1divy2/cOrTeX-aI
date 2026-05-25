import { motion } from "framer-motion";

import {
  ArrowRight,
  Brain,
  Check,
  Code2,
  GitBranch,
  Sparkles,
  Users,
} from "lucide-react";

import {
  useState,
} from "react";
import {
  sendWelcomeEmail,
} from "@/lib/sendWelcomeEmail";

export function CTA() {
  const [
    email,
    setEmail,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState(false);

  const handleSubmit =
  async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !email.trim()
    ) {
      return;
    }

    try {
      const existing =
        JSON.parse(
          localStorage.getItem(
            "cortex-waitlist"
          ) || "[]"
        );

      existing.push({
        email,

        joinedAt:
          new Date().toISOString(),
      });

      localStorage.setItem(
        "cortex-waitlist",

        JSON.stringify(
          existing
        )
      );

      await sendWelcomeEmail(
        email
      );

      console.log(
        "WELCOME EMAIL SENT"
      );

      setSuccess(
        true
      );

      setEmail("");

      setTimeout(
        () => {
          setSuccess(
            false
          );
        },

        3000
      );

      const workspace =
        document.getElementById(
          "workspace"
        );

      workspace?.scrollIntoView(
        {
          behavior:
            "smooth",
        }
      );
    } catch (error) {
      console.error(
        "CTA ERROR:",
        error
      );
    }
  };
  return (
    <section
      id="community"
      className="relative px-6 pb-40 pt-40"
    >
      <div className="mx-auto max-w-6xl">

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-120px",
          }}
          transition={{
            duration: 0.8,
          }}
          className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-[rgba(10,10,18,0.82)] px-8 py-20 text-center shadow-[0_0_100px_rgba(168,85,247,0.12)] backdrop-blur-3xl md:px-16 md:py-24"
        >

          <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.04),transparent,transparent)]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_35%)]" />

          <div className="absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-[120px]" />

          <div className="absolute -bottom-40 right-0 h-[26rem] w-[26rem] rounded-full bg-cyan-400/10 blur-[120px]" />

          <div className="relative">

            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">

              <Users className="h-3.5 w-3.5" />

              Open beta · free forever · community-built

            </div>

            <h2 className="font-display text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl">

              Build the brain

              <br />

              <span className="bg-gradient-to-r from-fuchsia-400 via-pink-300 to-cyan-300 bg-clip-text text-transparent">

                you've always wanted

              </span>

            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">

              corTeX.ai is open and free for students,
              researchers, creators and builders.

              <br className="hidden md:block" />

              Join the next generation of intelligent workspaces.

            </p>

            <form
              onSubmit={
                handleSubmit
              }
              className="mx-auto mt-12 flex max-w-2xl flex-col gap-3 sm:flex-row"
            >

              <div className="relative flex-1">

                <div className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500">

                  <Brain className="h-4 w-4" />

                </div>

                <input
                  type="email"
                  required
                  value={
                    email
                  }
                  onChange={(
                    e
                  ) =>
                    setEmail(
                      e.target
                        .value
                    )
                  }
                  placeholder="you@thinking.com"
                  className="h-16 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-12 pr-5 text-sm text-white outline-none backdrop-blur-xl transition-all placeholder:text-zinc-500 focus:border-fuchsia-500/40 focus:bg-white/[0.06]"
                />

              </div>

              <button
                type="submit"
                className="group relative inline-flex h-16 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400 px-8 text-sm font-semibold text-white shadow-[0_0_60px_rgba(168,85,247,0.35)] transition duration-300 hover:scale-[1.02]"
              >

                <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />

                {success ? (
                  <>

                    <Check className="relative h-4 w-4" />

                    <span className="relative">

                      Added to waitlist

                    </span>

                  </>
                ) : (
                  <>

                    <Sparkles className="relative h-4 w-4" />

                    <span className="relative">

                      Get free access

                    </span>

                    <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />

                  </>
                )}

              </button>

            </form>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">

              <button
                onClick={() =>
                  window.open(
                    "https://github.com",
                    "_blank"
                  )
                }
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >

                <GitBranch className="h-4 w-4" />

                Open source on GitHub

              </button>

              <span className="hidden opacity-30 md:block">

                •

              </span>

              <button
                onClick={() => {
                  const features =
                    document.getElementById(
                      "features"
                    );

                  features?.scrollIntoView(
                    {
                      behavior:
                        "smooth",
                    }
                  );
                }}
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >

                <Code2 className="h-4 w-4" />

                Read the manifesto

              </button>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}