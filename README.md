# Timestamper

A modular, config-driven PWA for tapping big colored buttons to log timestamped events to a CSV file. Buttons, top-of-screen widgets (steppers, dropdowns, toggles, text fields), and the app title are all defined in [config.json](config.json) — no code changes needed to customize the dashboard.

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
