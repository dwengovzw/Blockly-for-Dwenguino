---
name: refactor-dwenguino
description: "Step-by-step, safety-first workflow for refactoring the Blockly-for-Dwenguino codebase (online physical-computing IDE for Dwenguino/Halberd). Use when cleaning up code, making it DRY/readable/efficient, migrating legacy jQuery DwenguinoIDE to Lit/TypeScript, decomposing the DwenguinoBlockly god-object, extracting services, tightening types with shared/types, DRYing simulation scenarios or backend controllers, hardening the compilation service, or consolidating build config. Includes per-area checklists and verification commands."
argument-hint: "The module or concern to refactor (e.g. 'extract persistence from dwenguino_blockly.js')"
---

# Refactoring Blockly-for-Dwenguino

A repeatable, behavior-preserving workflow for refactoring this codebase. Read
[AGENTS.md](../../../AGENTS.md) and `/memories/repo/architecture.md` first for the codebase map and
hard rules. The golden rule: **refactor and change-behavior are separate activities — never mix them
silently in one edit.**

## When to use
- Cleaning up, DRYing, or improving readability/efficiency of any module.
- Migrating legacy `DwenguinoIDE` JS toward Lit + TypeScript.
- Decomposing `DwenguinoBlockly`, extracting services, or introducing shared types.
- DRYing simulation scenarios or backend controllers; hardening the compilation service.
- Consolidating tsconfig/webpack/build configuration.

## The 6-step workflow

### 1. Map the target
- Read the **entire** file(s) in scope before editing — no partial-context edits.
- Find all callers and side effects: use `vscode_listCodeUsages` on exported symbols and
  `grep_search` for global/`window` access, jQuery selectors, and event names.
- Identify the **layer/bundle**: legacy IDE (`DwenguinoIDE`), dashboards (Lit/RTK), editor (Lit),
  backend, shared, or vendored (out of scope).
- List the **public contracts** the code participates in (REST paths, block IDs, generated C++,
  saved-state schema, i18n keys) — these must survive the refactor.

### 2. Establish a baseline
Run the **narrowest** check that proves current health before you touch anything:
- Backend: `npm run build-dev-backend` and/or `npm run test-backend`.
- Frontend: `npm run build-dev-frontend` (or just check `get_errors` for TS files).
- Note the current state so you can detect regressions.

### 3. Plan small steps
- Write a `todo` list of **small, independently verifiable** steps.
- Prefer a sequence of safe extractions over one big rewrite.
- For risky areas (gripper/kinematics, compilation service, auth), plan extra verification and keep
  changes minimal.

### 4. Refactor (behavior-preserving)
Apply the smallest change that achieves each step. Common moves:
- **Extract** a cohesive function/module from a large one; give it a clear name and a single job.
- **De-duplicate** repeated logic into one helper (respect existing module boundaries).
- **Introduce types**: convert `.js`→`.ts`, replace inline shapes with `shared/types/` imports.
- **Replace jQuery** DOM manipulation with focused vanilla DOM or a Lit component where the seam is
  clean; don't rip out jQuery wholesale mid-file.
- **Name for intent**: rename locals/functions for readability (use rename refactoring for symbols).
- Keep imports ESM-correct (explicit extensions where the build requires them).

### 5. Verify after every meaningful step
- `get_errors` on all changed files.
- **Build both the frontend and the backend regularly** and scan the output for errors — rebuild
  the side you touched every step, and run the **full** `build-dev` periodically so a change in
  `shared/` or a type can't silently break the other side.
- Run the relevant Jest suite (`test-backend` / `test-frontend`).
- `build-dev-backend` can emit files but still exit non-zero on a type error — check for `error TS`
  lines and the exit code, not just that files were written.
- Fix regressions before continuing. Never batch up unverified edits.

### 6. Report
Summarize: what changed, why it's behavior-preserving (contracts kept, build/tests green), what you
verified, and deferred follow-ups. Persist durable structural findings to
`/memories/repo/architecture.md`.

## Area-specific checklists

### Decomposing `DwenguinoBlockly` (`DwenguinoIDE/js/src/dwenguino_blockly.js`)
- [ ] It's a global god-object mixing state, persistence, UI wiring, and board selection.
- [ ] Extract along seams: **state**, **persistence** (save/load/autosave/upload/download), **UI
      wiring** (menu buttons), **board selector**.
- [ ] Preserve the autosave interval behavior and the `beforeunload` guard.
- [ ] Keep global entry points working — other code and inline handlers reference `DwenguinoBlockly.*`.
- [ ] Verify: `build-dev-frontend` (simulator bundle) + manual smoke of save/load contract.

### Simulation scenarios (`DwenguinoIDE/js/src/scenario/`)
- [ ] Each scenario extends `DwenguinoSimulationScenario` (init state, init display, `updateScenario`).
- [ ] DRY shared boilerplate into the base class **without** changing per-scenario behavior.
- [ ] New scenarios must be registered in `simulation/dwenguino_simulation.js` and map to a
      `SCENARIO` enum value in `shared/types/saved_state.types.ts`.
- [ ] Gripper (`gripper/`) is **3D + kinematics + active development** — minimal, well-tested changes
      only; respect the descriptor JSON contract (see root `KINEMATICS_DESCRIPTOR_GUIDE.md`).

### Backend controllers/routes (`backend/`)
- [ ] Keep the routes → controllers → models MVC separation.
- [ ] Preserve route paths and auth middleware chains (`verifyTokenAjax`, `verifyUserExists`,
      `roleCheck`).
- [ ] DRY the Dwenguino vs Halberd compilation variants in `util.controller.ts`.
- [ ] **Security**: `util.controller.ts` runs user-derived paths through `child_process.exec` — check
      for path traversal / command injection; validate/sanitize inputs; don't remove safeguards.
- [ ] Verify: `build-dev-backend` + `test-backend`.

### Type migration & shared types (`shared/types/`)
- [ ] Move duplicated FE/BE shapes into `shared/types/` and import them from both sides.
- [ ] The legacy IDE barely consumes `shared/` today — introducing it there is high-value.
- [ ] Don't change the saved-state schema shape without an explicit task + migration consideration.

### Build/config consolidation
- [ ] Multiple tsconfigs exist (`tsconfig.json`, `dashboards.tsconfig.json`, `DwenguinoIDE.tsconfig.json`,
      `dev.*`). Consolidate only with user sign-off.
- [ ] `tsconfigold.json.txt` and `.bak` files: propose removal, don't delete silently.

## Verification command reference

| Purpose | Command |
|---------|---------|
| Backend build | `npm run build-dev-backend` |
| Backend tests | `npm run test-backend` |
| Frontend dev build (3 bundles) | `npm run build-dev-frontend` |
| Frontend unit tests | `npm run test-frontend` |
| Full dev build (build both sides — run regularly) | `npm run build-dev` |
| Per-file TS errors | use `get_errors` on changed files |

## Anti-patterns to avoid
- Rewriting a whole legacy file in one pass instead of incremental extraction.
- Mixing a behavior change into a "pure refactor" commit.
- Editing vendored Blockly/closure or `dist/` build outputs.
- Removing jQuery/globals that inline HTML handlers still depend on.
- Deleting `.bak`/design-note files without asking.
- Silently changing REST paths, block IDs, generated C++, or i18n keys.
