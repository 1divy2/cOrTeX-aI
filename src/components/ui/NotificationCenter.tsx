import { Toaster } from "sonner";
import { useSettingsStore } from "@/store/settings-store";

export default function NotificationCenter() {
  const { theme } = useSettingsStore();

  return (
    <Toaster
      position="bottom-right"
      theme={theme === "system" ? "system" : theme}
      toastOptions={{
        className:
          "paper-panel border-border text-foreground rounded-[16px] shadow-lg",
        style: {
          background: "var(--secondary)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
        },
      }}
    />
  );
}
