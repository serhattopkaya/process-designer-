# Solution Designer — Implementation Plan

## Context

The existing app is a **process flow designer** built with React Flow + Zustand + Tailwind. It supports 6 node types (Start, End, Process, Decision, Subprocess, Delay) with drag-and-drop, properties panel, undo/redo, and JSON export/import.

The goal is to add a **Solution Designer mode** where:
- The left toolbox shows solution blocks (PLC, SQL Server, Kafka, etc.)
- Edges carry communication protocol info and data model definitions
- The properties panel adapts to show block-specific and edge-specific fields
- Both modes coexist with a toggle

---

## Step 1: Extend Type Definitions

**File:** `src/types/index.ts`

Add:
- `SolutionNodeType` — `'plc' | 'plcDataReader' | 'msSqlServer' | 'azureFunction' | 'restApi' | 'kafka'`
- `AppNodeType` — `ProcessNodeType | SolutionNodeType`
- `DesignerMode` — `'processFlow' | 'solutionDesigner'`
- `CommunicationProtocol` — union of 10 protocol string literals:
  - `siemensS7`, `opcUa`, `modbusTcp`, `mqtt`, `httpRest`, `grpc`, `kafka`, `amqp`, `tcpIp`, `azureServiceBus`
- `DataField` — `{ name: string; type: 'string' | 'int' | 'float' | 'bool' | 'datetime' | 'json' }`
- `SolutionEdgeData` — `{ protocol?: CommunicationProtocol; dataFields?: DataField[] }`
- Update `StoreState`: add `mode`, `setMode`, widen `addNode` type param to `AppNodeType`, add `updateEdgeProtocol` and `updateEdgeDataFields` actions

---

## Step 2: Update Store

**File:** `src/store/useStore.ts`

- Add `mode: 'processFlow'` state and `setMode` action
- Add `SOLUTION_NODE_DEFAULTS` record:

| Type | Label | Color | Width | Height |
|------|-------|-------|-------|--------|
| plc | PLC | #0ea5e9 | 180 | 80 |
| plcDataReader | PLC Data Reader | #06b6d4 | 200 | 80 |
| msSqlServer | MS SQL Server | #8b5cf6 | 200 | 80 |
| azureFunction | Azure Function | #f59e0b | 200 | 80 |
| restApi | REST API | #22c55e | 180 | 80 |
| kafka | Kafka | #ef4444 | 180 | 80 |

- Create `ALL_NODE_DEFAULTS = { ...NODE_DEFAULTS, ...SOLUTION_NODE_DEFAULTS }`
- Update `addNode` to accept `AppNodeType`, look up from `ALL_NODE_DEFAULTS`
- Update `autoLayout` to use `ALL_NODE_DEFAULTS`
- Update `onConnect`: when mode is `'solutionDesigner'`, set `data: { protocol: undefined, dataFields: [] }` on new edges
- Add helper actions:
  - `updateEdgeProtocol(edgeId, protocol)` — sets protocol in edge data and updates edge label
  - `updateEdgeDataFields(edgeId, fields)` — sets data fields array on edge
- Add `PROTOCOL_LABELS` constant mapping protocol keys to display strings (e.g., `siemensS7 → 'Siemens S7'`)
- Include `mode` in `exportToJson`, read it in `importFromJson`

---

## Step 3: Create Solution Node Components

**New files (6):**

| File | Icon (Lucide) | Color |
|------|---------------|-------|
| `src/components/nodes/PlcNode.tsx` | `Cpu` | #0ea5e9 |
| `src/components/nodes/PlcDataReaderNode.tsx` | `ScanLine` | #06b6d4 |
| `src/components/nodes/MsSqlServerNode.tsx` | `Database` | #8b5cf6 |
| `src/components/nodes/AzureFunctionNode.tsx` | `Zap` | #f59e0b |
| `src/components/nodes/RestApiNode.tsx` | `Globe` | #22c55e |
| `src/components/nodes/KafkaNode.tsx` | `Radio` | #ef4444 |

Each follows the `ProcessStepNode` pattern: styled div with top/bottom `Handle`, icon + label, selected border highlight.

**Update:** `src/components/nodes/index.ts` — register all 6 new types in the `nodeTypes` object.

---

## Step 4: Update Toolbox

**File:** `src/components/Toolbox.tsx`

- Import `useStore` to read `mode`
- Define `processFlowTools` (existing 6) and `solutionDesignerTools` (new 6) arrays
- Render the active tool set based on `mode`
- Update `onDragStart` type from `ProcessNodeType` to `AppNodeType`
- Update footer text per mode

---

## Step 5: Add Mode Toggle to Toolbar

**File:** `src/components/Toolbar.tsx`

- Import `mode` and `setMode` from store
- Add a segmented control (two buttons: "Process Flow" / "Solution Designer") at the left of the toolbar
- Active button: solid bg, inactive: outlined
- Canvas retains nodes/edges when switching (shared data)

---

## Step 6: Update Canvas

**File:** `src/components/Canvas.tsx`

- Import `AppNodeType` instead of `ProcessNodeType`
- Update `onDrop` type cast to `AppNodeType`
- No other changes needed — `nodeTypes` registry handles rendering

---

## Step 7: Update Properties Panel

**File:** `src/components/PropertiesPanel.tsx`

This is the largest change. Three additions:

### A) Solution Block Properties
When a solution node is selected in solution mode, show block-type-specific fields:

| Block Type | Fields |
|------------|--------|
| plc | IP Address, Rack, Slot |
| plcDataReader | PLC Address, Polling Interval |
| msSqlServer | Connection String, Database |
| azureFunction | Function URL, Function Key |
| restApi | Base URL, Auth Type (dropdown: None, API Key, Bearer Token, Basic) |
| kafka | Broker URL, Topic, Group ID |

Keep label, color picker, and delete button for all types.

### B) Protocol Selector
When an edge is selected in solution mode:
- `<select>` dropdown with 10 protocols
- On change: call `updateEdgeProtocol` (also updates edge label on canvas)

### C) Data Model Editor
Below protocol selector:
- List of `[name input] [type dropdown] [× delete]` rows
- "Add Field" button at bottom
- Type options: string, int, float, bool, datetime, json
- On change: call `updateEdgeDataFields`

---

## Implementation Order

```
1. Types (no deps)
2. Store (depends on 1)
3. Node components (depends on 1) — can parallelize with 2
4. Node registry update (depends on 3)
5. Toolbox (depends on 1, 2)
6. Toolbar toggle (depends on 2)
7. Canvas update (depends on 1, 2)
8. Properties panel (depends on 1, 2) — do last, most complex
```

---

## Files Summary

| Action | File |
|--------|------|
| Modify | `src/types/index.ts` |
| Modify | `src/store/useStore.ts` |
| Create | `src/components/nodes/PlcNode.tsx` |
| Create | `src/components/nodes/PlcDataReaderNode.tsx` |
| Create | `src/components/nodes/MsSqlServerNode.tsx` |
| Create | `src/components/nodes/AzureFunctionNode.tsx` |
| Create | `src/components/nodes/RestApiNode.tsx` |
| Create | `src/components/nodes/KafkaNode.tsx` |
| Modify | `src/components/nodes/index.ts` |
| Modify | `src/components/Toolbox.tsx` |
| Modify | `src/components/Toolbar.tsx` |
| Modify | `src/components/Canvas.tsx` |
| Modify | `src/components/PropertiesPanel.tsx` |

---

## Verification Checklist

1. `npm run dev` — app starts without errors
2. Mode toggle switches toolbox between process flow and solution blocks
3. Drag solution blocks onto canvas — render with correct icons/colors
4. Connect two solution blocks — edge appears
5. Select edge — protocol dropdown and data model editor appear
6. Set protocol — edge label updates on canvas
7. Add/remove data fields — persists correctly
8. Select solution node — block-specific properties appear
9. Undo/redo works across all operations
10. Export/import JSON preserves mode, protocols, and data fields
11. Existing process flow mode still works unchanged
