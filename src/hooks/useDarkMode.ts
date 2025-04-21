
import { useEffect, useState } from "react";

export function useDarkMode(defaultDark: boolean = true) {
  const [isDarkMode, setIsDarkMode] = useState(defaultDark);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return { isDarkMode, setIsDarkMode };
}
