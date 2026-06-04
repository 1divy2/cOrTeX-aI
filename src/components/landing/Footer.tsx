import { Brain, Hexagon } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const columns = [
  {
    title: "Product",
    links: ["Features", "Intelligence", "Focus", "Analytics", "Roadmap"],
  },
  {
    title: "Community",
    links: ["Open beta", "Manifesto", "Changelog", "Contributors", "Brand"],
  },
  {
    title: "Resources",
    links: ["Docs", "Templates", "Guides", "Press kit", "Status"],
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
    <footer className="relative overflow-hidden border-t border-border bg-background px-6 pt-20 pb-10">
      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 pb-14 md:grid-cols-5">
          <div className="col-span-2 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-foreground">
                <Hexagon className="h-5 w-5 text-background" strokeWidth={2.5} />
              </div>
              <span className="font-display text-lg font-bold text-foreground">
                corTeX
              </span>
            </div>

            <p className="mt-4 text-sm font-medium leading-relaxed text-muted-foreground">
              An open, focused operating system for deep work. Built in public,
              free forever, by and for thinkers.
            </p>

            <div className="mt-5 flex items-center gap-2">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-foreground hover:bg-background hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-foreground/80">
                {col.title}
              </div>

              <ul className="space-y-2.5 text-sm font-medium text-muted-foreground">
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

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs font-bold text-muted-foreground md:flex-row">
          <div>© 2026 corTeX · Open beta</div>
        </div>
      </div>
    </footer>
  );
}