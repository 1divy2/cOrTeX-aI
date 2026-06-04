import { motion } from "framer-motion";
import { Brain, ChevronDown, LayoutDashboard, LogOut, Settings, Sparkles, User, Sun, Moon, Hexagon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AuthModal } from "./AuthModal";
import { logout } from "@/firebase/auth";
import { useAuthStore } from "@/store/auth-store";
import { useSettingsStore } from "@/store/settings-store";

const links = [
  { href: "#features", label: "Features" },
  { href: "#analytics", label: "Analytics" },
  { href: "#community", label: "Community" },
];

type NavbarUser = {
  id: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
};

export function Navbar() {
  const navigate = useNavigate();
  const { user: authUser } = useAuthStore();
  const user = authUser as NavbarUser | null;
  const { theme, setTheme } = useSettingsStore();

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [openAuth, setOpenAuth] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (user) {
      setOpenAuth(false);
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    try {
      setOpenMenu(false);
      await logout();
      navigate({ to: "/" });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  }

  function handleNavigate(path: string) {
    setOpenMenu(false);
    navigate({ to: path });
  }

  return (
    <>
      <AuthModal open={openAuth} onClose={() => setOpenAuth(false)} />

      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-1/2 top-4 z-50 w-[min(1180px,calc(100%-2rem))] -translate-x-1/2"
      >
        <motion.div
          animate={{
            scale: scrolled ? 0.98 : 1,
            y: scrolled ? -2 : 0,
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative"
        >
          <nav
            className={`relative flex items-center justify-between rounded-[24px] border border-border px-5 py-3 transition-all duration-500 shadow-sm ${
              scrolled
                ? "bg-background/90 backdrop-blur-md"
                : "bg-background"
            }`}
          >
            <a href="/" className="relative z-10 flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 90, scale: 1.06 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-foreground"
              >
                <Hexagon className="h-5 w-5 text-background" strokeWidth={2.5} />
              </motion.div>
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                corTeX
              </span>
            </a>

            <div
              className="relative z-10 hidden items-center gap-1 text-sm font-bold text-muted-foreground md:flex"
              onMouseLeave={() => setHoverIdx(null)}
            >
              {links.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  onMouseEnter={() => setHoverIdx(i)}
                  className="relative rounded-lg px-4 py-2 transition-colors hover:text-foreground"
                >
                  {hoverIdx === i && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-secondary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </a>
              ))}
            </div>

            <div className="relative z-[100] flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-foreground hover:bg-background hover:text-foreground mr-2"
                aria-label="Toggle Theme"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>

              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="group relative inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-secondary/80"
                  >
                    <div className="relative h-7 w-7 overflow-hidden rounded-lg bg-background border border-border">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="profile"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
                        {user.displayName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    </div>
                    <span className="hidden sm:block">{user.displayName || "Profile"}</span>
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </button>

                  {openMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.22 }}
                      className="paper-panel absolute right-0 top-full z-[9999] mt-3 w-64 overflow-hidden rounded-[24px] border border-border bg-background p-2 shadow-lg"
                    >
                      <div className="mb-2 border-b border-border p-3 bg-secondary/50">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-background border border-border">
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt="profile"
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                              />
                            ) : null}
                            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
                              {user.displayName?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-bold text-foreground">
                              {user.displayName}
                            </p>
                            <p className="truncate text-xs font-medium text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleNavigate("/workspace")}
                        className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-sm font-bold text-foreground transition-colors hover:bg-secondary"
                      >
                        <LayoutDashboard className="h-4 w-4 text-accent" />
                        Workspace
                      </button>
                      <button
                        onClick={() => handleNavigate("/profile")}
                        className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-sm font-bold text-foreground transition-colors hover:bg-secondary"
                      >
                        <User className="h-4 w-4 text-accent" />
                        Profile
                      </button>
                      <button
                        onClick={() => handleNavigate("/settings")}
                        className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-sm font-bold text-foreground transition-colors hover:bg-secondary"
                      >
                        <Settings className="h-4 w-4 text-accent" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="mt-1 flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-sm font-bold text-red-500 transition-colors hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setOpenAuth(true)}
                    className="hidden px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                  >
                    Sign in
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOpenAuth(true)}
                    className="group relative inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2 text-sm font-bold text-background shadow-sm hover:bg-accent transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    Join the beta
                  </motion.button>
                </>
              )}
            </div>
          </nav>
        </motion.div>
      </motion.header>
    </>
  );
}