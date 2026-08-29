# Automation and AI Boundaries
## Current Controlled Guidance

- Trigger: user submits language, jurisdiction, topic, urgency, and facts.
- Owner: application.
- Inputs: public form values and approved source metadata.
- Tools/APIs: no live external model API in the current implementation.
- Output: controlled routing result, refusal, escalation, missing-information
  state, or draft marked for attorney review.
- Hard guardrails: required jurisdiction/topic, unsupported-scope refusal,
  urgency escalation, approved-source filtering, no attorney-client
  relationship statement, and attorney-review boundary.
- Side effects: no autonomous legal action, filing, communication, payment, or
  publication.

## Future Model Adapter

`CLAUDE_API_KEY` is reserved but unused. A live adapter remains blocked until:

- AI governance approves provider, model, regions, data-use terms, retention,
  logging, evaluation, and incident response.
- Inputs are minimized and confidential-data rules are enforced server-side.
- Tool access is explicitly enumerated and defaults to none.
- Output schema validation and failure handling exist.
- Attorney review gates cannot be bypassed by prompt output.
- Rate limits, audit events, kill switch, and credential rotation exist.

The AI key must be a server-only, environment-specific production secret even
in development. No key may be embedded in browser assets or used from GitHub
Pages.
