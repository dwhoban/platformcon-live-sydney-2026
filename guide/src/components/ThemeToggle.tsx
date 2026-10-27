import { Button } from "@cloudflare/kumo/components/button";
import { DropdownMenu } from "@cloudflare/kumo/components/dropdown";
import { DesktopIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const options = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: DesktopIcon },
] as const;

const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark" || value === "system";

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem("theme");
    return isTheme(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

// Mirrors the inline script in BaseLayout, which applies the theme before first paint.
function applyTheme(theme: Theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch {}
  const dark =
    theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.setAttribute("data-mode", dark ? "dark" : "light");
}

export default function ThemeToggle() {
  // Unknown until mounted, because the server can't read localStorage.
  const [theme, setTheme] = useState<Theme>();

  useEffect(() => setTheme(readTheme()), []);

  const ActiveIcon = options.find((option) => option.value === theme)?.icon ?? DesktopIcon;

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger
        render={
          <Button variant="ghost" shape="square" aria-label={theme ? `Theme: ${theme}` : "Theme"}>
            <ActiveIcon size={18} />
          </Button>
        }
      />
      <DropdownMenu.Content align="end">
        <DropdownMenu.RadioGroup
          value={theme ?? "system"}
          onValueChange={(value: unknown) => {
            if (!isTheme(value)) return;
            setTheme(value);
            applyTheme(value);
          }}
        >
          <DropdownMenu.Label>Theme</DropdownMenu.Label>
          {options.map((option) => (
            <DropdownMenu.RadioItem key={option.value} value={option.value} icon={option.icon}>
              {option.label}
              <DropdownMenu.RadioItemIndicator />
            </DropdownMenu.RadioItem>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
