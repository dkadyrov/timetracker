# Timestamper

A modular, config-driven PWA for tapping big colored buttons to log timestamped events to a CSV file. Buttons, top-of-screen widgets (steppers, dropdowns, toggles, text fields), and the app title are all defined in [config.json](config.json) — no code changes needed to customize the dashboard.

## Location data

If the browser grants location permission, the app keeps a background watch on the device's GPS and stamps each logged entry with the most recent fix: `lat`, `lon`, `alt` (decimal degrees and meters) plus `accuracy_m` and `alt_accuracy_m`, the fix's horizontal/vertical error radius in meters. These are included as columns in the exported CSV, right after the timestamp and button. Entries logged before a fix is available (or on devices/browsers without geolocation) export those columns blank.

A GPS row in the hamburger menu shows quality at a glance — yellow/pulsing "Searching…" while acquiring a fix, green ± accuracy once ≤20m, orange for a coarser fix, red "Unavailable" on error/denied permission. Tap it for the exact accuracy figures (including altitude accuracy, when available).

## Themes

The theme picker (menu → Theme) is entirely driven by the `themes` array in `config.json` — there's no hardcoded Light/Dark/Alex in the code. Each entry:

```json
{
  "id": "dark",
  "label": "Dark",
  "metaColor": "#000000",
  "tileStyle": "outline",
  "colors": {
    "bg": "#000000",
    "panel": "#0d0d0d",
    "panel2": "#1a1a1a",
    "text": "#ffffff",
    "muted": "#cfcfcf",
    "accent": "#5b8cff",
    "danger": "#ff5449",
    "controlBg": "rgba(255,255,255,0.16)",
    "controlBgStrong": "rgba(255,255,255,0.22)",
    "hoverBg": "rgba(255,255,255,0.14)",
    "outline": "rgba(255,255,255,0.4)"
  }
}
```

- `id` — stable key used for persistence (`localStorage`) and to match the OS light/dark preference on first launch (an `id` of `"light"` or `"dark"` is treated specially for that auto-detect).
- `label` — text shown in the theme menu.
- `metaColor` — mobile browser chrome / status-bar color (defaults to `colors.bg`).
- `tileStyle` — `"filled"` (default, big buttons filled with their own `color`) or `"outline"` (buttons render as outlined panels — this is what makes "Alex Theme" distinct from Dark).
- `colors` — any of the fields above; omitted fields fall back to the built-in Dark palette.

The shipped `config.json` reproduces the original Light, Dark, and Alex themes exactly — edit those entries, add new ones, or delete ones you don't want. If `themes` is missing entirely (or `config.json` fails to load), the app falls back to the same three built-in themes.

## Button color palette

Button tiles always render white text, so pick colors dark/saturated enough for good contrast. These hex codes are a good starting palette for the `color` field on a button entry in `config.json`:

| Name        | Hex       |
|-------------|-----------|
| Green       | `#2ecc71` |
| Blue        | `#3498db` |
| Indigo      | `#5b8cff` |
| Orange      | `#e67e22` |
| Deep Orange | `#d35400` |
| Yellow      | `#f1c40f` |
| Purple      | `#9b59b6` |
| Pink        | `#e84393` |
| Red         | `#e74c3c` |
| Maroon      | `#922b21` |
| Teal        | `#1abc9c` |
| Cyan        | `#00b8d4` |
| Navy        | `#34495e` |
| Slate       | `#546e7a` |
| Gray        | `#7f8c8d` |

Example:

```json
{ "label": "Takeoff", "context": "Takeoff", "color": "#3498db" }
```
