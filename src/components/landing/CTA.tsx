import { motion } from "framer-motion";

import {
  ArrowRight,
  User,
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
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    try {
      const existing = JSON.parse(
        localStorage.getItem("cortex-waitlist") || "[]"
      );

      existing.push({
        email,
        joinedAt: new Date().toISOString(),
      });

      localStorage.setItem("cortex-waitlist", JSON.stringify(existing));
      await sendWelcomeEmail(email);

      console.log("WELCOME EMAIL SENT");

      setSuccess(true);
      setEmail("");

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

      const workspace = document.getElementById("workspace");
      workspace?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("CTA ERROR:", error);
    }
  };

  return (
    <section id="community" className="relative px-6 pb-40 pt-40 bg-background">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8 }}
          className="relative paper-panel overflow-hidden rounded-[48px] border border-border bg-background px-8 py-20 text-center shadow-lg md:px-16 md:py-24"
        >
          <div className="relative">
            <div className="mb-8 inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-5 py-2 text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              Open beta · free forever · community-built
            </div>

            <h2 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl text-foreground">
              Build the brain
              <br />
              <span className="italic text-accent">
                you've always wanted
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
              corTeX is open and free for students,
              researchers, creators and builders.
              <br className="hidden md:block" />
              Join the next generation of deep workspaces.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-12 flex max-w-2xl flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <div className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@thinking.com"
                  className="h-16 w-full rounded-[16px] border border-border bg-secondary pl-12 pr-5 text-sm font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground focus:bg-background"
                />
              </div>

              <button
                type="submit"
                className="group relative inline-flex h-16 items-center justify-center gap-3 overflow-hidden rounded-[16px] bg-foreground px-8 text-sm font-bold text-background shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-accent"
              >
                {success ? (
                  <>
                    <Check className="relative h-4 w-4" />
                    <span className="relative">Added to waitlist</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="relative h-4 w-4" />
                    <span className="relative">Get free access</span>
                    <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-5 text-sm font-bold text-muted-foreground">
              <button
                onClick={() => window.open("https://github.com/1divy2/cOrTeX-aI", "_blank")}
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <GitBranch className="h-4 w-4" />
                Open source on GitHub
              </button>

              <span className="hidden opacity-30 md:block">•</span>

              <button
                onClick={() => {
                  const features = document.getElementById("features");
                  features?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
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