import { useEffect } from "react";
import { useSettingsStore } from "@/store/settings-store";

export default function ThemeManager() {
  const { theme } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (isDark: boolean) => {
      root.classList.remove("theme-light", "theme-dark", "dark");
      if (isDark) {
        root.classList.add("theme-dark", "dark");
      } else {
        root.classList.add("theme-light");
      }
    };

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches);
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      applyTheme(theme === "dark");
    }
  }, [theme]);

  return null;
}
