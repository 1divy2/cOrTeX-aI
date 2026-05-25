import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import WorkspaceSidebar from "./WorkspaceSidebar";

import WorkspaceHeader from "./WorkspaceHeader";

type Props = {
  children: ReactNode;
};

export default function WorkspaceShell({
  children,
}: Props) {
  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  useEffect(() => {
    const syncSidebar =
      () => {
        const collapsed =
          localStorage.getItem(
            "sidebar-collapsed"
          ) === "true";

        setSidebarCollapsed(
          collapsed
        );
      };

    syncSidebar();

    window.addEventListener(
      "storage",
      syncSidebar
    );

    const interval =
      setInterval(
        syncSidebar,
        120
      );

    return () => {
      window.removeEventListener(
        "storage",
        syncSidebar
      );

      clearInterval(
        interval
      );
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-white">

      <WorkspaceSidebar />

      <motion.main
        animate={{
          paddingLeft:
            sidebarCollapsed
              ? 96
              : 280,
        }}
        transition={{
          duration: 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          min-h-screen
          overflow-x-visible
          overflow-y-auto
        "
      >

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_24%)]" />

        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <WorkspaceHeader />

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            w-full
            max-w-[1650px]
            flex-col
            gap-6
            px-8
            pb-10
            pt-28
          "
        >

          {children}

        </div>

      </motion.main>

    </div>
  );
}