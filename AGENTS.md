# AGENTS.md — Blockly-for-Dwenguino

Authoritative, always-on guidance for AI agents working in this repository. Keep changes to this
file deliberate — it shapes every agent interaction.

## What this project is

**Blockly-for-Dwenguino** (Dwenguinoblockly) is an online **physical-computing IDE** for the
**Dwenguino** (ATmega/Arduino-compatible) and **Halberd** boards from dwengo.org. Users program
with **visual blocks (Google Blockly)** or **text (Monaco)**, **simulate in the browser**, and can
**compile & flash real hardware** via the backend. It supports accounts, teacher dashboards,
portfolios, and 7 languages (en, nl, fr, de, el, it, ms).

A detailed walkthrough lives in [APPLICATION_SUMMARY.md](APPLICATION_SUMMARY.md).

## The one thing to understand first

The codebase is **mid-migration between two paradigms**. Refactors should push toward the modern one:

| Layer | Style | Direction |
|-------|-------|-----------|
| `Blockly-for-Dwenguino/DwenguinoIDE/js/src/` | Legacy **JS + jQuery/Bootstrap**, global `DwenguinoBlockly` god-object | ← refactor toward TS + modular services |
| `Blockly-for-Dwenguino/dashboards/js/src/` | Modern **Lit + Redux Toolkit + TypeScript** | ✅ the reference style |
| `Blockly-for-Dwenguino/editor/js/src/` | **Lit + TypeScript** shell (WIP) | ✅ next-gen editor direction |
| `backend/` | **TypeScript + ESM + Express + Mongoose**, MVC | ✅ keep clean MVC |

## Repository layout (mind the double nesting)

The git root is `Blockly-for-Dwenguino/`; **frontend source is one level deeper** in
`Blockly-for-Dwenguino/Blockly-for-Dwenguino/`.

```
backend/                      Express + Mongoose (TS, ESM): routes → controllers → models
  compilation/                arduino-cli + Makefile toolchain + bundled bins (linux/windows)
  middleware/ security/       JWT auth, roles, TLS cert
Blockly-for-Dwenguino/        FRONTEND (nested)
  DwenguinoIDE/js/src/        main IDE: dwenguino_blockly.js, simulation/, scenario/, textual_editor/
  dashboards/js/src/          Lit + RTK: components/, state/features/*_slice.ts
  editor/js/src/              Lit editor shell (WIP)
  blockly/                    VENDORED Blockly + custom blocks/ and generators/arduino/
  closure-library/            VENDORED
shared/types/                 types & constants shared FE↔BE (saved_state, user, portfolio, …)
msg/  (+ per-app msg/)         i18n
tests/                        unit (jest + mongodb-memory-server) + end_to_end (puppeteer)
webpack.config.cjs / .dev.cjs 3 bundles: simulator, dashboards, editor
```

## Build, run, test

- **Module system:** ESM (`"type": "module"` in package.json). Node ≥ 16.
- **Frontend build:** `npm run build-dev-frontend` (webpack, 3 bundles) — prod: `npm run build-frontend`.
- **Backend build:** `npm run build-dev-backend` (`tsc` → `backend/dist/`) — prod: `npm run build-backend`.
- **Full:** `npm run build-dev` / `npm run build`.
- **Run backend:** `npm start` (serves `backend/dist/backend/index.js`; needs `MONGODB_URI`; port `12032`).
- **Tests:** `npm test` · backend only: `npm run test-backend` · frontend only: `npm run test-frontend`.
- **Git:** default branch `unified`; active dev on `develop`.

## Rules for agents

**Do not edit (out of scope):**
- Vendored code: `Blockly-for-Dwenguino/blockly/` (except custom `blocks/` & `generators/arduino/`
  when explicitly asked), `Blockly-for-Dwenguino/closure-library/`, `node_modules/`.
- Build outputs: `backend/dist/`, `**/js/dist/`. Edit the sources and rebuild.
- Generated `docs/` (JSDoc).

**Preserve these contracts unless the task is to change them:**
- REST route paths (`backend/routes/`), Blockly block IDs, and generated C++ output.
- Saved-state schema (`shared/types/saved_state.types.ts`) and i18n message keys.
- Auth middleware, Helmet/CSP config, and the compilation flow.

**Safety:**
- Never run destructive git (`push`, `--force`, `reset --hard`, amend published commits) without
  explicit confirmation. Local edits, builds, and tests are fine to run freely.
- Treat `backend/controllers/util.controller.ts` as security-sensitive: it runs user-derived paths
  through `child_process.exec`. Flag issues; don't casually "simplify".

## Conventions

- Prefer **TypeScript** and small single-responsibility modules for new/refactored code.
- Reuse **`shared/types/`** instead of duplicating data shapes across FE/BE.
- In new frontend work, prefer **Lit components + Redux Toolkit** over jQuery/global state.
- Keep `.js` imports written with explicit extensions where the existing ESM/webpack setup requires it.
- Add a new simulation by extending `DwenguinoSimulationScenario` and registering it in
  `DwenguinoIDE/js/src/simulation/dwenguino_simulation.js`.
- After edits, run the **narrowest** relevant build + tests and check `get_errors` before reporting.

## Where to find things

| Task | Location |
|------|----------|
| Custom block definition | `Blockly-for-Dwenguino/blockly/blocks/` |
| Block → C++ generation | `Blockly-for-Dwenguino/blockly/generators/arduino/` |
| Main IDE behavior | `Blockly-for-Dwenguino/DwenguinoIDE/js/src/dwenguino_blockly.js` |
| A simulation scenario | `DwenguinoIDE/js/src/scenario/<scenario>/` |
| 3D gripper / kinematics | `DwenguinoIDE/js/src/scenario/gripper/` (+ root kinematics docs) |
| Textual (Monaco) editor | `DwenguinoIDE/js/src/textual_editor/` |
| Dashboards | `Blockly-for-Dwenguino/dashboards/js/src/` (`components/`, `state/features/`) |
| Backend endpoint | `backend/routes/` → `backend/controllers/` → `backend/models/` |
| Auth / OAuth | `backend/middleware/`, `backend/controllers/oauth.*` |
| Compilation / upload | `backend/controllers/util.controller.ts`, `backend/compilation/` |
| Shared types | `shared/types/` |
| Translations | `msg/`, per-app `msg/`, dashboards XLIFF |

For deep refactoring work, use the **Dwenguino Refactorer** agent
(`.github/agents/refactor.agent.md`) and the **refactor-dwenguino** skill.
