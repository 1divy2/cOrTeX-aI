import { Brain } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";
import logo from "@/assets/logo.png";

const columns = [
  {
    title: "Product",
    links: [
      "Features",
      "Workspace AI",
      "Focus",
      "Analytics",
      "Roadmap",
    ],
  },
  {
    title: "Community",
    links: [
      "Open beta",
      "Manifesto",
      "Changelog",
      "Contributors",
      "Brand",
    ],
  },
  {
    title: "Resources",
    links: [
      "Docs",
      "Templates",
      "Guides",
      "Press kit",
      "Status",
    ],
  },
];

const socials = [
  {
    icon: FaGithub,
    label: "GitHub",
    href: "https://github.com/1divy2",
  },
  {
    icon: FaLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/divy-dadheech-211050290/",
  },
  {
    icon: FaXTwitter,
    label: "Twitter",
    href: "https://x.com/1divy2",
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 px-6 pt-20 pb-10">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[var(--violet)]/40 to-transparent" />

      <div className="pointer-events-none absolute -bottom-32 left-1/2 h-80 w-[800px] -translate-x-1/2 rounded-full bg-[var(--violet)]/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 pb-14 md:grid-cols-5">
          <div className="col-span-2 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-glow">

  <img
    src={logo}
    alt="corTeX.ai logo"
    className="h-full w-full object-contain"
  />

</div>

              <span className="font-display text-lg font-semibold">
                corTeX
                <span className="text-gradient">
                  .ai
                </span>
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              An open, AI-native operating system for deep work. Built in public,
              free forever, by and for thinkers.
            </p>

            <div className="mt-5 flex items-center gap-2">
              {socials.map(
                ({
                  icon: Icon,
                  label,
                  href,
                }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="glass flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              )}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="mb-4 text-xs uppercase tracking-[0.18em] text-foreground/80">
                {col.title}
              </div>

              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-muted-foreground md:flex-row">
          <div>
            © 2026 corTeX.ai · Open beta 
          </div>

          
        </div>
      </div>
    </footer>
  );
}