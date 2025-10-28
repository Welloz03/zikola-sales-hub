import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  // Determine current theme state for icons/text
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-lg transition-colors"
          onClick={toggleTheme}
        >
          {isDark ? (
            // Show Sun icon in Dark Mode (or when system prefers dark)
            <>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle Light Mode</span>
            </>
          ) : (
            // Show Moon icon in Light Mode
            <>
              <Moon className="h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle Dark Mode</span>
            </>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {isDark ? "الوضع النهاري" : "الوضع الليلي"}
      </TooltipContent>
    </Tooltip>
  );
};

export default ThemeToggle;
