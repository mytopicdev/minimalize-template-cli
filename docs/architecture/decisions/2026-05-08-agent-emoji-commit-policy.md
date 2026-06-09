# ADR: Agent Emoji Commit Policy for Implementation Requests

- Status: Accepted
- Date: 2026-05-08
- Owner: repository maintainers

## Context

This repository already defines an emoji-based commit format and validation flow. However, consistency depended on implicit behavior and could vary between contributors and agents.

We need an explicit policy so agents follow the same commit behavior whenever they implement user-requested changes.

## Decision

Adopt an explicit agent commit policy for implementation requests:

- If a user asks to add, fix, refactor, or update and new working tree changes are produced, the agent must create the corresponding commit.
- Commit messages must use the repository format:
  - `<emoji> <type>(<scope>): <short subject>`
- The allowed type and emoji mappings are fixed in repository instructions.
- The agent must stage only files related to the request.
- The agent must not use `--no-verify`.

The policy source is `.github/instructions/commit.instructions.md`.

## Consequences

- Positive outcomes:
  - More predictable commit history from agent-driven changes.
  - Better visual scanability in logs.
  - Fewer invalid commit messages due to consistent policy.
- Tradeoffs and risks:
  - More frequent commits during implementation sessions.
  - Requires care to avoid including unrelated local modifications.

## Alternatives Considered

- Keep policy only in agent instructions without an ADR.
  - Rejected because behavior would remain implicit for agents.
- Enforce only in CI without local behavior guidance.
  - Rejected because feedback arrives late and slows iteration.
- Require manual approval before every agent commit.
  - Rejected for now to preserve a fast local workflow.

## Migration and Impact

- Files or areas affected:
  - `.github/instructions/commit.instructions.md`
  - `README.md`
  - commit validation script and hook flow already in place
- Rollout strategy:
  - Immediate adoption for all new implementation requests.
  - Future enhancement can add stricter PR and branch policies.
- Validation plan:
  - Local hook validation via `.githooks/commit-msg`.
  - CI validation job in `.github/workflows/ci.yml`.

## References

- `.github/instructions/commit.instructions.md`
- `scripts/validate-commit-msg.mjs`
- `.githooks/commit-msg`
- `.github/workflows/ci.yml`
