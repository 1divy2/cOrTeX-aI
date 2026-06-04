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
    <div className="min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-500">

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
            w-full
            min-w-0
            flex-col
            gap-6
            px-4
            pb-24
            pt-24
            lg:px-8
            lg:pb-10
            lg:pt-28
            max-w-[1900px]
            mx-auto
          "
        >

          {children}

        </motion.div>

      </motion.main>

    </div>
  );
}