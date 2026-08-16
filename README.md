# TypeReach

A typing test app. Prompts are organized into challenges, each rated on an original difficulty scale based on keyboard hand position rather than a generic easy/medium/hard split.

## Features

**Home screen**
- Browse challenges as tiles: title, difficulty tier, tags, suggested duration
- Filter by tag and by tier
- Live count of challenges matching the current filters

**Difficulty scale (Reach Code)**

Each tier is named after the keys that define it, moving outward from the home row. Each tier also introduces a new typing challenge, not just more text.

| Tier | Name | Introduces |
|------|------|------------|
| `FJ` | Home Row | Short, common words |
| `SL` | Near Reach | Longer sentences |
| `RU` | Top Reach | Commas, multi-clause sentences |
| `VM` | Bottom Reach | Semicolons, colons, contractions |
| `WO` | Full Keyboard | Quotation marks, em dashes, dialogue |
| `10` | Number Row | Digits, currency, dates |
| `QP` | Pinky Corners | Parentheses, ALL CAPS, nested clauses |
| `Z/` | Full Reach | Everything above combined, plus code-like syntax |

**Typing test**
- Word-wrapped prompt rendering, animated caret
- Live WPM, accuracy, and timer
- True accuracy: tracked separately from live accuracy, based on first-attempt correctness rather than corrections
- On-screen keyboard that mirrors physical keystrokes, including shift and caps lock state
- 3-2-1 countdown before each round
- Mobile support via a focusable input overlay
- Quit/restart confirmation dialog

**Results**
- WPM, accuracy, true accuracy, error count, characters typed, duration

## Stack

HTML, CSS, JavaScript (ES modules). No framework, no build step. Fonts: JetBrains Mono (Google Fonts). Icons: Font Awesome, Bootstrap Icons.

## Structure

```
.
├── index.html
├── css/
│   ├── index.css       # reset, shared buttons, screen switching
│   ├── home.css        # challenge browser
│   ├── test.css        # test screen, keyboard, modals
│   └── stats.css       # results screen
└── js/
    ├── index.js         # screen routing
    ├── home.js           # challenge browser
    ├── test.js           # typing logic, stats, keyboard, modals
    ├── stats.js           # results rendering
    └── prompts.js         # challenge data + tier metadata
```

## Running locally

Uses ES modules, so serve it rather than opening the file directly:

```bash
npx serve .
# or
python3 -m http.server
```

## Roadmap

- Accounts: store best scores, completed challenges, history
- User-submitted challenges
- Bookmarking
- Results graph and replay on the stats screen (currently placeholders)
- Light/dark mode toggle
- Bug fixes

Not planned, but possible:
- Leaderboards
- Custom round duration
- Alternate keyboard layouts (Dvorak, Colemak)
- Exportable stats history
- Accessibility pass (screen reader support, reduced motion)

## Known limitations

- Graph and replay are UI placeholders, not functional
- No persistent storage; progress resets on refresh
- Mobile input is functional but not fully hardened across devices

## License

TBD
