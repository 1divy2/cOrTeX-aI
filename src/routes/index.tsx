import { createFileRoute } from "@tanstack/react-router";

import { Navbar } from "@/components/landing/Navbar";

import Hero from "@/components/landing/Hero";

import { Features } from "@/components/landing/Features";

import { Stats } from "@/components/landing/Stats";

import { CTA } from "@/components/landing/CTA";

import { Footer } from "@/components/landing/Footer";

import Reveal from "@/components/ui/Reveal";

export const Route =
  createFileRoute("/")({
    head: () => ({
      meta: [
        {
          title:
            "corTeX — The operating system for deep work",
        },
        {
          name: "description",
          content:
            "corTeX is a distraction-free second brain for deep workers. Notes, tasks, and focus sessions — unified in one calm workspace.",
        },
        {
          property:
            "og:title",
          content:
            "corTeX — The operating system for deep work",
        },
        {
          property:
            "og:description",
          content:
            "A distraction-free second brain for students, builders and researchers. Designed like Apple, engineered for flow.",
        },
      ],
    }),

    component:
      Landing,
  });

function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-white">

      <Navbar />

      <main className="relative">

        <Reveal duration={1}>
          <Hero />
        </Reveal>

        <Reveal
          delay={0.1}
          duration={0.9}
        >
          <Features />
        </Reveal>

        <Reveal
          delay={0.2}
          duration={0.9}
        >
          <Stats />
        </Reveal>

        <Reveal
          delay={0.25}
          duration={0.9}
        >
          <CTA />
        </Reveal>

      </main>

      <Reveal delay={0.1}>
        <Footer />
      </Reveal>

    </div>
  );
}

export default Landing;