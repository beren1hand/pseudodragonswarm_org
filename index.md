---
layout: default
---

<pre class="mural" aria-hidden="true">
🟦🟦🌙🟦🟦🐉🟦🟦✨🟦🟦🟦🟦🐉🟦🟦🟦🟦
🟦🐉🟦🟦🟦🟦🟦✨🟦🟦🟦🟦✨🟦🟦🟦🐉🟦
🟦🟦🟦✨🟦🟦🟦🟦🐉🟦🟦🟦🟦🟦✨🟦🟦🟦
🗻🗻🗻🌋🗻🗻🗻🗻🗻🗻🗻🗻🌋🗻🗻🗻🗻🗻
🌲🌲🌳🌲🌲🪨🌲🌳🌲🌲🌲🌳🌲🌲🌳🌲🌲🌲
🌳🌲🌳🦉🌲🌳🌳🪾🌲🌳🌲🌳🌲🌳🌳🌲🌳🌳
🌳💎🌲🌳🏡🌳🌲🌳🌳🌲🌳🌲🌳🪨🌳🌲🌳🌲
🌲🌳🪨🌳🍄🌲🌳🌳🪾🥚🌲🏠🌳🌳🪾🌳🌳🌳
🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩
</pre>

# 🐉 Pseudodragon Swarm

**A tiny, self-hosted swarm of AI agents you run on your own Linux box — the Unix way.**

Each *bot* is a persistent agent, isolated as its own Unix user, with a plain-markdown brain. Bots talk to each other (and to you) over file-based mail and a small router. Secrets live in `pass`. The thinking runs on a pluggable engine — local Ollama by default, or Claude Code.

It's built entirely from boring, battle-hardened parts — **bash, python3 (stdlib only), systemd, pass/gnupg, ollama, git** — with no frameworks, no `pip` installs, and no paid services required to start. You can read every line.

## The idea 🌱

The installer sets up the *smallest possible* working swarm — a **seed** — and then the bots grow the rest *with you*. You don't configure a platform; you adopt one agent that can build the others.

## What makes it tick ⚙️

- 🧍 **Per-bot Unix user** — isolation is the kernel's, not a sandbox you have to trust.
- 📝 **Markdown brains** — a bot *is* its `soul.md` + `directions.md`. Edit a file, restart, done.
- 📬 **File-based mail + a router** — bots drop messages in each other's inboxes; the filesystem is the message bus *and* the audit log.
- 🔌 **Pluggable engine** — Ollama (free, local) or Claude Code. One small script is the only brain-seam.
- 🔐 **Pluggable secrets** — `pass` by default (offline, zero accounts), 1Password as a drop-in.
- 🛡️ **Supervised by systemd** — bots survive reboots and crashes.

## Quickstart 🚀

```sh
git clone <repo-url> pseudodragon-swarm
cd pseudodragon-swarm
./setup
```

A short, friendly wizard asks five questions and stands up a working swarm. A minute later:

```sh
pseudodragon say jane "what can you help me with?"
pseudodragon bots
pseudodragon doctor
```

## Security 🛡️

Power is on a dial. Your sysadmin bot can be an **advisor** (no sudo, proposes only), an **operator** (a targeted sudo allowlist — the default), or an **artificer** (full autonomy, on your own trusted box). Raising the tier is root-only — a bot can never escalate itself.

And **Tron**, the watchman, runs with *no sudo, no credentials, read-only*. Hourly it checks for privilege drift, exposed secrets, and broken isolation — it **finds; it never fixes**, routing the doing to the sysadmin and to you.

---

🐲 *Small enough to understand and make your own. Welcome to the forge.*
