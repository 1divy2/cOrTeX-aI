import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CommandPalette from "@/components/workspace/CommandPalette";

import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import {
  useEffect,
} from "react";

import appCss from "../styles.css?url";

import {
  useSettingsStore,
} from "@/store/settings-store";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-white">

      <div className="max-w-md text-center">

        <h1 className="text-7xl font-black tracking-tight">

          404

        </h1>

        <h2 className="mt-4 text-2xl font-semibold">

          Page not found

        </h2>

        <p className="mt-3 text-sm leading-relaxed text-zinc-400">

          The page you're looking for doesn't exist,
          was moved or is still being built.

        </p>

        <div className="mt-8">

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_40px_rgba(168,85,247,0.35)] transition hover:scale-[1.02]"
          >

            Return home

          </Link>

        </div>

      </div>

    </div>
  );
}

function ErrorComponent({
  error,
  reset,
}: {
  error: Error;

  reset: () => void;
}) {
  console.error(error);

  const router =
    useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-white">

      <div className="max-w-md text-center">

        <h1 className="text-2xl font-semibold tracking-tight">

          Something went wrong

        </h1>

        <p className="mt-3 text-sm leading-relaxed text-zinc-400">

          corTeX.ai encountered an unexpected error.
          Try refreshing or return home.

        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">

          <button
            onClick={() => {
              router.invalidate();

              reset();
            }}
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_40px_rgba(168,85,247,0.35)] transition hover:scale-[1.02]"
          >

            Try again

          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
          >

            Go home

          </Link>

        </div>

      </div>

    </div>
  );
}

export const Route =
  createRootRouteWithContext<{
    queryClient: QueryClient;
  }>()({
    head: () => ({
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1",
        },
        {
          title:
            "corTeX.ai — The operating system for deep work",
        },
        {
          name: "description",
          content:
            "An AI-native second brain for notes, tasks, focus sessions and intelligent workflows.",
        },
        {
          name: "author",
          content:
            "corTeX.ai",
        },
        {
          property:
            "og:title",
          content:
            "corTeX.ai",
        },
        {
          property:
            "og:description",
          content:
            "The operating system for deep work.",
        },
        {
          property:
            "og:type",
          content:
            "website",
        },
        {
          name:
            "twitter:card",
          content:
            "summary_large_image",
        },
      ],

      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
      ],
    }),

    shellComponent:
      RootShell,

    component:
      RootComponent,

    notFoundComponent:
      NotFoundComponent,

    errorComponent:
      ErrorComponent,
  });

function ThemeController() {
  const {
    theme,
  } =
    useSettingsStore();

  useEffect(() => {
    const body =
      document.body;

    body.classList.remove(
      "theme-dark",
      "theme-midnight"
    );

    if (
      theme ===
      "midnight"
    ) {
      body.classList.add(
        "theme-midnight"
      );
    } else {
      body.classList.add(
        "theme-dark"
      );
    }
  }, [theme]);

  return null;
}

function RootShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <head>

        <HeadContent />

      </head>

      <body className="bg-background text-white antialiased transition-colors duration-500">

        <div className="fixed inset-0 -z-10 overflow-hidden">

          <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />

          <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />

        </div>

        {children}

        <Scripts />

      </body>

    </html>
  );
}

function RootComponent() {
  const { queryClient } =
    Route.useRouteContext();

  return (
    <QueryClientProvider
      client={queryClient}
    >

      <ThemeController />

      <>
  <Outlet />

  <CommandPalette />
</>

    </QueryClientProvider>
  );
}