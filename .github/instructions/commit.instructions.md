---
applyTo: '**'
description: 'Use when a user asks to add or fix something and there are new local changes. The agent must commit the implemented changes using the repository emoji commit convention.'
---

# Commit Instruction

## Trigger

Apply this behavior when both conditions are true:

- The user request is an implementation request (add, fix, refactor, update).
- The working tree contains new changes produced for that request.

## Required Behavior

1. Stage only files related to the user request.
2. Create one commit per completed request batch.
3. Use the required format:
   - `<emoji> <type>(<scope>): <short subject>`
4. Respect allowed mappings:
   - `✨ feat`
   - `🐛 fix`
   - `📝 docs`
   - `♻️ refactor`
   - `✅ test`
   - `🔧 chore`
5. Keep the subject imperative, concise, and without trailing period.

## Validation

- Do not bypass hooks with `--no-verify`.
- If commit validation fails, fix the message and retry.

## Safety Constraints

- Never commit unrelated or pre-existing changes not part of the user request.
- If unrelated modifications are present, stop and ask the user how to proceed.
