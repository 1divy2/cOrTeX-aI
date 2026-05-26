import {
  ReactNode,
} from "react";

import {
  motion,
} from "framer-motion";

import WorkspaceSidebar from "./WorkspaceSidebar";
import WorkspaceHeader from "./WorkspaceHeader";

import {
  useWorkspaceStore,
} from "@/store/workspace-store";

type Props = {
  children: ReactNode;
};

export default function WorkspaceShell({
  children,
}: Props) {

  const {
    sidebarCollapsed,
  } = useWorkspaceStore();

  return (
    <div className="min-h-screen overflow-hidden bg-background text-white">

      <WorkspaceSidebar />

      <motion.main
        layout
        animate={{
          paddingLeft:
            sidebarCollapsed
              ? 96
              : 280,
        }}
        transition={{
          duration: 0.34,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="
          relative
          min-h-screen
          overflow-x-hidden
          overflow-y-auto
        "
      >

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.14),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_25%)]" />

        <WorkspaceHeader />

        <motion.div
          layout
          transition={{
            duration: 0.34,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="
            relative
            z-10
            flex
            min-w-0
            flex-col
            gap-6
            px-4
            pb-24
            pt-24
            lg:px-8
            lg:pb-10
            lg:pt-28
          "
        >

          {children}

        </motion.div>

      </motion.main>

    </div>
  );
}