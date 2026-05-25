import { motion } from "framer-motion";

import {
  Brain,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  User,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "@tanstack/react-router";

import { AuthModal } from "./AuthModal";

import { logout } from "@/firebase/auth";

import {
  useAuthStore,
} from "@/store/auth-store";

const links = [
  {
    href: "#features",
    label: "Features",
  },
  {
    href: "#ai",
    label: "AI",
  },
  {
    href: "#analytics",
    label: "Analytics",
  },
  {
    href: "#community",
    label: "Community",
  },
];

type NavbarUser = {
  id: string;

  email: string;

  displayName?: string | null;

  photoURL?: string | null;
};

export function Navbar() {
  const navigate =
    useNavigate();

  const {
    user: authUser,
  } = useAuthStore();

  const user =
    authUser as NavbarUser | null;

  const [
    hoverIdx,
    setHoverIdx,
  ] = useState<number | null>(
    null
  );

  const [
    openAuth,
    setOpenAuth,
  ] = useState(false);

  const [
    openMenu,
    setOpenMenu,
  ] = useState(false);

  const [
    scrolled,
    setScrolled,
  ] = useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setOpenAuth(false);
    }
  }, [user]);

  useEffect(() => {
    const handleScroll =
      () => {
        setScrolled(
          window.scrollY > 40
        );
      };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  useEffect(() => {
    function handleClick(
      e: MouseEvent
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          e.target as Node
        )
      ) {
        setOpenMenu(false);
      }
    }

    window.addEventListener(
      "mousedown",
      handleClick
    );

    return () =>
      window.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  async function handleLogout() {
  try {
    setOpenMenu(false);

    await logout();

    navigate({
      to: "/",
    });
  } catch (error) {
    console.error(
      "LOGOUT ERROR:",
      error
    );
  }
}

  function handleNavigate(
    path: string
  ) {
    setOpenMenu(false);

    navigate({
  to: path,
});
  }

  return (
    <>
      <AuthModal
        open={openAuth}
        onClose={() =>
          setOpenAuth(false)
        }
      />

      <motion.header
        initial={{
          y: -30,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="fixed left-1/2 top-4 z-50 w-[min(1180px,calc(100%-2rem))] -translate-x-1/2"
      >

        <motion.div
          animate={{
            scale: scrolled
              ? 0.98
              : 1,
            y: scrolled
              ? -2
              : 0,
          }}
          transition={{
            duration: 0.35,
            ease: "easeOut",
          }}
          className="relative"
        >

          <motion.div
            animate={{
              opacity: scrolled
                ? 0.5
                : 0.3,
              scale: scrolled
                ? 1.05
                : 1,
            }}
            transition={{
              duration: 0.4,
            }}
            className="pointer-events-none absolute -inset-px rounded-full bg-aurora blur-xl"
          />

          <nav
            className={`relative flex items-center justify-between rounded-full border px-5 py-3 transition-all duration-500 ${
              scrolled
                ? "border-white/15 bg-black/60 shadow-[0_0_60px_rgba(168,85,247,0.22)] backdrop-blur-3xl"
                : "border-white/10 bg-white/[0.04] shadow-glow backdrop-blur-2xl"
            }`}
          >

            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03),transparent,rgba(255,255,255,0.03))]" />

            <a
              href="/"
              className="group relative z-10 flex items-center gap-3"
            >

              <motion.div
                whileHover={{
                  rotate: 8,
                  scale: 1.08,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                }}
                className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-aurora shadow-glow"
              >

                <Brain
                  className="h-4 w-4 text-background"
                  strokeWidth={2.5}
                />

                <div className="absolute inset-0 rounded-2xl bg-aurora opacity-0 blur-md transition-opacity group-hover:opacity-70" />

              </motion.div>

              <span className="font-display text-lg font-semibold tracking-tight text-white">

                corTeX

                <span className="text-gradient">
                  .ai
                </span>

              </span>

            </a>

            <div
              className="relative z-10 hidden items-center gap-1 text-sm text-muted-foreground md:flex"
              onMouseLeave={() =>
                setHoverIdx(null)
              }
            >

              {links.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  onMouseEnter={() =>
                    setHoverIdx(i)
                  }
                  className="relative rounded-full px-4 py-2 transition-colors hover:text-white"
                >

                  {hoverIdx === i && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.08]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  <span className="relative">

                    {l.label}

                  </span>

                </a>
              ))}

            </div>

            <div className="relative z-[100] flex items-center gap-2">

              {user ? (

                <div
                  className="relative"
                  ref={menuRef}
                >

                  <button
                    onClick={() =>
                      setOpenMenu(
                        !openMenu
                      )
                    }
                    className="group relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/[0.09]"
                  >

                    <div className="relative h-7 w-7 overflow-hidden rounded-full bg-white/10">

                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="profile"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : null}

                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white">

                        {user.displayName
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}

                      </div>

                    </div>

                    <span className="hidden sm:block">

                      {user.displayName ||
                        "Profile"}

                    </span>

                    <ChevronDown className="h-4 w-4 opacity-60" />

                  </button>

                  {openMenu && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                        scale: 0.96,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      transition={{
                        duration: 0.22,
                      }}
                      className="absolute right-0 top-full z-[9999] mt-3 w-64 overflow-hidden rounded-3xl border border-white/10 bg-black/90 p-2 shadow-[0_0_80px_rgba(168,85,247,0.18)] backdrop-blur-3xl"
                    >

                      <div className="mb-2 border-b border-white/5 p-3">

                        <div className="flex items-center gap-3">

                          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white/10">

                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt="profile"
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : null}

                            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">

                              {user.displayName
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}

                            </div>

                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-medium text-white">

                              {user.displayName}

                            </p>

                            <p className="truncate text-sm text-muted-foreground">

                              {user.email}

                            </p>

                          </div>

                        </div>

                      </div>

                      <button
                        onClick={() =>
                          handleNavigate(
                            "/workspace"
                          )
                        }
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-white transition hover:bg-white/[0.05]"
                      >

                        <LayoutDashboard className="h-4 w-4" />

                        Workspace

                      </button>

                      <button
                        onClick={() =>
                          handleNavigate(
                            "/profile"
                          )
                        }
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-white transition hover:bg-white/[0.05]"
                      >

                        <User className="h-4 w-4" />

                        Profile

                      </button>

                      <button
                        onClick={() =>
                          handleNavigate(
                            "/settings"
                          )
                        }
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-white transition hover:bg-white/[0.05]"
                      >

                        <Settings className="h-4 w-4" />

                        Settings

                      </button>

                      <button
                        onClick={
                          handleLogout
                        }
                        className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-red-300 transition hover:bg-red-500/10"
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
                    onClick={() =>
                      setOpenAuth(true)
                    }
                    className="hidden px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-white sm:inline-flex"
                  >

                    Sign in

                  </button>

                  <motion.button
                    whileHover={{
                      scale: 1.04,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    onClick={() =>
                      setOpenAuth(true)
                    }
                    className="group relative inline-flex items-center gap-2 rounded-full bg-aurora px-5 py-2 text-sm font-semibold text-background shadow-[0_0_40px_rgba(168,85,247,0.35)]"
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