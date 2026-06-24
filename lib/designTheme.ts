import { DESIGN_THEMES, type DesignTheme } from "./types";

const FALLBACK_THEME_ID: DesignTheme = "modern_esg";

export function getDesignTheme(themeId?: DesignTheme) {
  return DESIGN_THEMES.find((t) => t.id === themeId) ?? DESIGN_THEMES.find((t) => t.id === FALLBACK_THEME_ID)!;
}

/** Apply portal theme by setting data-design-theme on <html> (CSS in globals.css). */
export function applyDesignTheme(themeId?: DesignTheme): DesignTheme {
  const theme = getDesignTheme(themeId);
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-design-theme", theme.id);
  }
  return theme.id;
}

export function clearDesignThemeAttributes(): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-design-theme", FALLBACK_THEME_ID);
}
