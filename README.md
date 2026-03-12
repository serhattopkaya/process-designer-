# Process Designer

A visual process flow designer built with React and React Flow. Create, edit, and export business process diagrams with an intuitive drag-and-drop interface.

![Process Designer](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-blue)

## Features

- **6 Node Types** — Start, End, Process, Decision, Subprocess, and Delay nodes with distinct visual styles
- **Drag & Drop** — Drag nodes from the toolbox sidebar onto the canvas
- **Properties Panel** — Edit node labels, descriptions, colors, assignees, and durations
- **Auto Layout** — Automatically arrange nodes using the Dagre layout algorithm
- **Undo / Redo** — Full history support with up to 50 levels of undo
- **Export / Import** — Save and load diagrams as JSON files
- **Export as Image** — Export the canvas as a PNG image
- **Dark Mode** — Toggle between light and dark themes (defaults to system preference)
- **Context Menu** — Right-click nodes to duplicate or delete them
- **MiniMap** — Navigate large diagrams with the interactive minimap
- **Keyboard Shortcuts** — `Ctrl+Z` undo, `Ctrl+Shift+Z` redo, `Delete` to remove selected elements

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the app at [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
```

Production output is written to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Canvas | React Flow (`@xyflow/react`) |
| State | Zustand |
| Layout | Dagre (`@dagrejs/dagre`) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Image Export | html-to-image |

## Project Structure

```
src/
├── components/
│   ├── nodes/          # Custom node components
│   │   ├── StartNode.tsx
│   │   ├── EndNode.tsx
│   │   ├── ProcessStepNode.tsx
│   │   ├── DecisionNode.tsx
│   │   ├── SubprocessNode.tsx
│   │   ├── DelayNode.tsx
│   │   └── index.ts
│   ├── Canvas.tsx       # React Flow canvas
│   ├── Toolbar.tsx      # Top toolbar
│   ├── Toolbox.tsx      # Left sidebar with draggable nodes
│   ├── PropertiesPanel.tsx  # Right sidebar for editing
│   ├── ContextMenu.tsx  # Right-click menu
│   └── Toast.tsx        # Notification toasts
├── store/
│   └── useStore.ts      # Zustand state management
├── types/
│   └── index.ts         # TypeScript type definitions
├── App.tsx
├── main.tsx
└── index.css            # Global styles & Tailwind
```

## Node Types

| Node | Shape | Description |
|------|-------|-------------|
| **Start** | Green circle | Entry point of the process |
| **End** | Red circle | Terminal point of the process |
| **Process** | Blue bordered card | A single process step |
| **Decision** | Yellow diamond | A branching point with Yes/No outputs |
| **Subprocess** | Purple double-bordered card | A reference to another process |
| **Delay** | Gray half-rounded card | A wait or timer step |

## License

MIT
