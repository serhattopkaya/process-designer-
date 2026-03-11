# Visual Process Designer — Implementation Plan

## Overview

A modern, single-page web application for visually designing engineering processes. Users can create, connect, and configure process steps on an interactive canvas using drag-and-drop. Think of it as a lightweight, focused alternative to tools like Visio or Lucidchart, tailored for engineering workflows.

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **React 18 + TypeScript** | Type safety, component model, ecosystem |
| Build tool | **Vite** | Fast dev server, quick builds |
| Canvas / Flow | **React Flow (xyflow)** | Mature node-graph library with built-in pan/zoom, drag-drop, edge routing |
| Styling | **Tailwind CSS** | Utility-first, fast iteration, modern look |
| Icons | **Lucide React** | Clean, consistent icon set |
| State | **Zustand** | Lightweight, works well with React Flow |
| Persistence | **localStorage + JSON export/import** | No backend needed initially |

---

## Core Features (MVP)

### 1. Interactive Canvas
- Pan & zoom (scroll / pinch)
- Grid background with snap-to-grid
- Minimap for navigation on large diagrams

### 2. Node Types (Process Steps)
| Node | Purpose | Visual |
|------|---------|--------|
| **Start** | Entry point | Green circle |
| **End** | Exit point | Red circle |
| **Process Step** | Generic action/task | Rounded rectangle, blue |
| **Decision** | Branch / condition | Diamond, amber |
| **Subprocess** | Grouped/nested steps | Double-bordered rectangle, purple |
| **Delay / Wait** | Time-based hold | Half-pill shape, gray |

### 3. Connections (Edges)
- Click-and-drag from source handle to target handle
- Animated edges with directional arrows
- Edge labels (e.g., "Yes" / "No" on decision branches)
- Bezier, step, and straight edge styles

### 4. Sidebar — Toolbox & Properties
- **Left panel — Toolbox**: Drag node types onto the canvas
- **Right panel — Properties**: Select a node/edge to edit:
  - Name / label
  - Description / notes
  - Color / priority
  - Duration estimate
  - Assignee (text field)
  - Custom key-value metadata

### 5. Toolbar
- Undo / Redo
- Delete selected
- Auto-layout (dagre algorithm)
- Zoom controls (fit view, zoom in/out)
- Export as JSON
- Import from JSON
- Export as PNG/SVG

### 6. Modern UI / UX
- Dark mode + light mode toggle
- Smooth animations (framer-motion or CSS transitions)
- Keyboard shortcuts (Delete, Ctrl+Z, Ctrl+S, etc.)
- Context menu (right-click on canvas / nodes)
- Toast notifications for actions

---

## Project Structure

```
process-designer/
├── public/
├── src/
│   ├── components/
│   │   ├── Canvas/
│   │   │   ├── ProcessCanvas.tsx      # Main React Flow canvas
│   │   │   ├── MiniMap.tsx
│   │   │   └── ContextMenu.tsx
│   │   ├── Nodes/
│   │   │   ├── StartNode.tsx
│   │   │   ├── EndNode.tsx
│   │   │   ├── ProcessStepNode.tsx
│   │   │   ├── DecisionNode.tsx
│   │   │   ├── SubprocessNode.tsx
│   │   │   ├── DelayNode.tsx
│   │   │   └── index.ts              # nodeTypes registry
│   │   ├── Edges/
│   │   │   └── CustomEdge.tsx
│   │   ├── Sidebar/
│   │   │   ├── Toolbox.tsx            # Draggable node palette
│   │   │   └── PropertiesPanel.tsx    # Selected element editor
│   │   ├── Toolbar/
│   │   │   └── Toolbar.tsx
│   │   └── UI/
│   │       ├── ThemeToggle.tsx
│   │       └── Toast.tsx
│   ├── store/
│   │   └── useStore.ts               # Zustand store
│   ├── hooks/
│   │   ├── useUndoRedo.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   └── useAutoLayout.ts
│   ├── utils/
│   │   ├── export.ts                 # JSON / PNG / SVG export
│   │   ├── import.ts
│   │   └── layout.ts                 # Dagre auto-layout
│   ├── types/
│   │   └── index.ts                  # Shared TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                     # Tailwind + global styles
├── index.html
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Implementation Phases

### Phase 1 — Scaffolding & Canvas
1. Initialize Vite + React + TypeScript project
2. Install dependencies (reactflow, tailwindcss, zustand, lucide-react, dagre)
3. Set up Tailwind with a modern design-token palette (slate/zinc grays, blue primary, amber accent)
4. Create `App.tsx` layout: sidebar left | canvas center | properties right
5. Set up React Flow canvas with grid background, controls, minimap
6. Create Zustand store with nodes, edges, and selection state

### Phase 2 — Node Types
7. Build all 6 custom node components with distinct shapes/colors
8. Add source/target handles with proper positioning
9. Register node types with React Flow

### Phase 3 — Drag-and-Drop Toolbox
10. Build the left sidebar toolbox with draggable node cards
11. Implement `onDragOver` / `onDrop` on the canvas to create new nodes
12. Assign unique IDs and default labels

### Phase 4 — Properties Panel
13. Build properties panel (right sidebar) that reacts to selection
14. Wire up form fields to update node/edge data in the store
15. Support label, description, color, duration, assignee, metadata

### Phase 5 — Toolbar & Actions
16. Implement toolbar with zoom controls, fit-view, delete
17. Add undo/redo via state history snapshots
18. Implement auto-layout using dagre
19. Add JSON export/import
20. Add PNG export (html-to-image)

### Phase 6 — Polish
21. Dark/light mode toggle with CSS variables + Tailwind `dark:` classes
22. Keyboard shortcuts
23. Right-click context menu
24. Smooth transitions and hover effects
25. Toast notifications
26. Responsive adjustments

---

## UI Design Direction

- **Colors**: Slate-900 background (dark), white (light). Blue-500 primary accent. Subtle gradients on nodes.
- **Typography**: Inter or system-ui font stack. Clean hierarchy.
- **Borders**: Rounded corners (lg/xl). Soft shadows. Glass-morphism on panels (backdrop-blur).
- **Nodes**: Subtle gradient fills, thin borders, drop shadows. Scale-up on hover.
- **Edges**: Animated dashed or solid with directional markers.
- **Layout**: Full-viewport, no page scroll. Panels slide in/out.

---

## Future Enhancements (Post-MVP)

- Real-time collaboration (WebSocket / CRDT)
- Backend persistence (database)
- Version history / diff view
- Process simulation / validation
- Template library (common engineering workflows)
- PDF report generation
- Comments / annotations on nodes
