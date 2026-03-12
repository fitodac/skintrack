# AI Context Architecture (portable)

Entry point: **AGENTS.md**

- `context/coding/`   Reusable coding preferences (stack-agnostic when possible)
- `context/project/`  Project-specific rules and architecture (source of truth)
- `.trae/rules/`      Trae bridge rules (minimal)
- `.agent/rules/`     Antigravity bridge rules (minimal)
- `.agents/skills/`   Third-party skills packs (optional)
- `README.md`         Human-friendly project overview kept in sync with meaningful changes
- `docs` branch       Separate Mintlify documentation branch kept isolated from app branches

Workflow:
1) Start every prompt by following AGENTS.md
2) Read `context/project/*` always
3) Read `context/coding/*` when relevant
4) Update `README.md` on the app branch for every meaningful feature or fix
5) Switch to the `docs` branch and update Mintlify docs without affecting app branches
