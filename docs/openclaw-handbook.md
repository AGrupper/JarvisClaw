### Installer Configuration Example

Source: https://docs.openclaw.ai/tools/skills

Example of how to configure installers for a skill, specifying installation methods like Homebrew, Node, Go, etc.

```APIDOC
## Installer Example

```markdown
---
name: gemini
description: Use Gemini CLI for coding assistance and Google search lookups.
metadata:
  {
    "openclaw":
      {
        "emoji": "♊️",
        "requires": { "bins": ["gemini"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "gemini-cli",
              "bins": ["gemini"],
              "label": "Install Gemini CLI (brew)",
            },
          ],
      },
  }
---
```

Notes:

* If multiple installers are listed, the gateway picks a **single** preferred option (brew when available, otherwise node).
* If all installers are `download`, OpenClaw lists each entry so you can see the available artifacts.
* Installer specs can include `os: ["darwin"|"linux"|"win32"]` to filter options by platform.
* Node installs honor `skills.install.nodeManager` in `openclaw.json` (default: npm; options: npm/pnpm/yarn/bun).
  This only affects **skill installs**; the Gateway runtime should still be Node
  (Bun is not recommended for WhatsApp/Telegram).
* Gateway-backed installer selection is preference-driven, not node-only:
  when install specs mix kinds, OpenClaw prefers Homebrew when
  `skills.install.preferBrew` is enabled and `brew` exists, then `uv`, then the
  configured node manager, then other fallbacks like `go` or `download`.
* If every install spec is `download`, OpenClaw surfaces all download options
  instead of collapsing to one preferred installer.
* Go installs: if `go` is missing and `brew` is available, the gateway installs Go via Homebrew first and sets `GOBIN` to Homebrew’s `bin` when possible.
* Download installs: `url` (required), `archive` (`tar.gz` | `tar.bz2` | `zip`), `extract` (default: auto when archive detected), `stripComponents`, `targetDir` (default: `~/.openclaw/tools/<skillKey>`).
```

--------------------------------

### Run Gateway Setup and Onboarding

Source: https://docs.openclaw.ai/install/podman

Starts the OpenClaw Gateway container and initiates the setup process, making it accessible via http://127.0.0.1:18789/.

```bash
./scripts/run-openclaw-podman.sh launch setup
```

--------------------------------

### Setup LiteLLM Proxy

Source: https://docs.openclaw.ai/providers/litellm

Install the proxy package and start the server with a specific model.

```bash
pip install 'litellm[proxy]'
litellm --model claude-opus-4-6
```

--------------------------------

### Onboard and Install OpenClaw Service

Source: https://docs.openclaw.ai/

Run the onboarding command to set up and install the OpenClaw service as a daemon. This command guides you through the initial setup and configuration.

```bash
openclaw onboard --install-daemon

```

--------------------------------

### Install OpenClaw CLI

Source: https://docs.openclaw.ai/install/installer

This section provides various examples of how to install the OpenClaw CLI using the `install-cli.sh` script. You can install with default settings, specify a custom prefix and version, use a Git installation method, enable JSON output for automation, or run the onboarding process immediately after installation.

```APIDOC
## Install OpenClaw CLI

This section provides various examples of how to install the OpenClaw CLI using the `install-cli.sh` script. You can install with default settings, specify a custom prefix and version, use a Git installation method, enable JSON output for automation, or run the onboarding process immediately after installation.

### Default Installation

This command installs the OpenClaw CLI with default settings.

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash
```

### Custom Prefix and Version

This command installs the OpenClaw CLI with a custom installation prefix and specifies a version.

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash -s -- --prefix /opt/openclaw --version latest
```

### Git Install

This command installs the OpenClaw CLI using the Git method, specifying a custom directory for the Git checkout.

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash -s -- --install-method git --git-dir ~/openclaw
```

### Automation with JSON Output

This command installs the OpenClaw CLI and enables JSON output for automation purposes, along with a custom prefix.

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash -s -- --json --prefix /opt/openclaw
```

### Run Onboarding After Install

This command installs the OpenClaw CLI and automatically runs the onboarding process immediately after installation.

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash -s -- --onboard
```

### Flags Reference

| Flag                        | Description                                                                     |
| --------------------------- | ------------------------------------------------------------------------------- |
| `--prefix <path>`           | Install prefix (default: `~/.openclaw`)                                         |
| `--install-method npm|git` | Choose install method (default: `npm`). Alias: `--method`                       |
| `--npm`                     | Shortcut for npm method                                                         |
| `--git`, `--github`         | Shortcut for git method                                                         |
| `--git-dir <path>`          | Git checkout directory (default: `~/openclaw`). Alias: `--dir`                  |
| `--version <ver>`           | OpenClaw version or dist-tag (default: `latest`)                                |
| `--node-version <ver>`      | Node version (default: `22.22.0`)                                               |
| `--json`                    | Emit NDJSON events                                                              |
| `--onboard`                 | Run `openclaw onboard` after install                                            |
| `--no-onboard`              | Skip onboarding (default)                                                       |
| `--set-npm-prefix`          | On Linux, force npm prefix to `~/.npm-global` if current prefix is not writable |
| `--help`                    | Show usage (`-h`)                                                               |

### Environment Variables Reference

| Variable                                    | Description                                   |
| ------------------------------------------- | --------------------------------------------- |
| `OPENCLAW_PREFIX=<path>`                    | Install prefix                                |
| `OPENCLAW_INSTALL_METHOD=git|npm`          | Install method                                |
| `OPENCLAW_VERSION=<ver>`                    | OpenClaw version or dist-tag                  |
| `OPENCLAW_NODE_VERSION=<ver>`               | Node version                                  |
| `OPENCLAW_GIT_DIR=<path>`                   | Git checkout directory for git installs       |
| `OPENCLAW_GIT_UPDATE=0|1`                  | Toggle git updates for existing checkouts     |
| `OPENCLAW_NO_ONBOARD=1`                     | Skip onboarding                               |
| `OPENCLAW_NPM_LOGLEVEL=error|warn|notice` | npm log level                                 |
| `SHARP_IGNORE_GLOBAL_LIBVIPS=0|1`          | Control sharp/libvips behavior (default: `1`) |
```

--------------------------------

### Gmail Webhook Setup Examples

Source: https://docs.openclaw.ai/cli/webhooks

Various configurations for setting up Gmail webhooks, including project-specific and custom URL setups.

```bash
openclaw webhooks gmail setup --account you@example.com
openclaw webhooks gmail setup --account you@example.com --project my-gcp-project --json
openclaw webhooks gmail setup --account you@example.com --hook-url https://gateway.example.com/hooks/gmail
```

--------------------------------

### Onboard with Google Gemini CLI

Source: https://docs.openclaw.ai/providers/models

Example command to onboard with the Google Gemini CLI provider. This may require a local 'gemini' installation.

```bash
openclaw onboard --auth-choice google-gemini-cli
```

--------------------------------

### OpenClaw CLI Configuration Commands

Source: https://docs.openclaw.ai/gateway/configuration

Examples of using the OpenClaw CLI for interactive setup and configuration management. Use 'openclaw onboard' for a full onboarding flow or 'openclaw configure' for a guided setup. CLI commands can get, set, or unset specific configuration values.

```bash
openclaw onboard       # full onboarding flow
openclaw configure     # config wizard
```

```bash
openclaw config get agents.defaults.workspace
openclaw config set agents.defaults.heartbeat.every "2h"
openclaw config unset plugins.entries.brave.config.webSearch.apiKey
```

--------------------------------

### First-time ClawDock Setup Flow

Source: https://docs.openclaw.ai/install/clawdock

A sequence of commands to perform the initial setup of ClawDock, including starting the gateway, fixing the token, and accessing the dashboard. Followed by device approval if necessary.

```bash
clawdock-start
clawdock-fix-token
clawdock-dashboard
```

```bash
clawdock-devices
clawdock-approve <request-id>
```

--------------------------------

### Start Development Gateway

Source: https://docs.openclaw.ai/start/setup

Commands to install dependencies and run the Gateway in watch mode for hot reloading.

```bash
pnpm install
pnpm gateway:watch
```

```bash
bun install
bun run gateway:watch
```

--------------------------------

### Generate and Install Shell Completions

Source: https://docs.openclaw.ai/cli/completion

Examples of using the completion command with various flags for shell targeting, installation, and state management.

```bash
openclaw completion
openclaw completion --shell zsh
openclaw completion --install
openclaw completion --shell fish --install
openclaw completion --write-state
openclaw completion --shell bash --write-state
```

--------------------------------

### Install Prerequisites

Source: https://docs.openclaw.ai/install/exe-dev

Install necessary system packages on the VM.

```bash
sudo apt-get update
sudo apt-get install -y git curl jq ca-certificates openssl
```

--------------------------------

### Bootstrap OpenClaw Setup

Source: https://docs.openclaw.ai/start/setup

Initializes the OpenClaw environment. Use the global command or run via package manager if a global install is missing.

```bash
openclaw setup
```

```bash
openclaw setup
```

```bash
pnpm openclaw setup
```

```bash
bun run openclaw setup
```

--------------------------------

### GitHub Read Helper Examples

Source: https://docs.openclaw.ai/help/scripts

Examples of using the `scripts/gh-read` helper for GitHub API calls with a GitHub App installation token. Ensure required environment variables are set.

```bash
scripts/gh-read pr view 123
```

```bash
scripts/gh-read run list -R openclaw/openclaw
```

```bash
scripts/gh-read api repos/openclaw/openclaw/pulls/123
```

--------------------------------

### Installer Configuration for Skills

Source: https://docs.openclaw.ai/tools/skills

Define installer specifications for a skill, including package manager details and required binaries. This example shows Homebrew installation for the Gemini CLI.

```markdown
---
name: gemini
description: Use Gemini CLI for coding assistance and Google search lookups.
metadata:
  {
    "openclaw":
      {
        "emoji": "♊️",
        "requires": { "bins": ["gemini"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "gemini-cli",
              "bins": ["gemini"],
              "label": "Install Gemini CLI (brew)",
            },
          ],
      },
  }
---

```

--------------------------------

### Run Onboarding with Setup

Source: https://docs.openclaw.ai/cli/setup

Use the `--wizard` flag with `openclaw setup` to run the full onboarding flow. This is an alternative to running onboarding flags directly.

```bash
openclaw setup --wizard
```

--------------------------------

### Define Setup Entry Point

Source: https://docs.openclaw.ai/plugins/sdk-channel-plugins

Create a lightweight setup entry to avoid loading heavy runtime code during onboarding or when the channel is disabled.

```typescript
import { defineSetupPluginEntry } from "openclaw/plugin-sdk/channel-core";
import { acmeChatPlugin } from "./src/channel.js";

export default defineSetupPluginEntry(acmeChatPlugin);
```

--------------------------------

### Gmail Webhook Setup and Execution

Source: https://docs.openclaw.ai/cli/webhooks

Basic commands to initialize and start the Gmail webhook integration.

```bash
openclaw webhooks gmail setup --account you@example.com
openclaw webhooks gmail run
```

--------------------------------

### Install Openclaw AI (Skip Onboarding)

Source: https://docs.openclaw.ai/install/installer

Install Openclaw AI without going through the initial onboarding process. This is useful for automated setups.

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

--------------------------------

### Local Notes Examples

Source: https://docs.openclaw.ai/reference/templates/TOOLS

Examples of environment-specific configurations for tools, including cameras, SSH, and text-to-speech preferences. These notes are unique to your setup and should be kept separate from shared skills.

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

--------------------------------

### GET /install.sh

Source: https://docs.openclaw.ai/install/installer

The installation script for OpenClaw. This script supports various installation methods, version selection, and configuration flags to customize the environment setup.

```APIDOC
## GET /install.sh

### Description
Downloads and executes the OpenClaw installation script. Supports various flags to control the installation method, versioning, and onboarding process.

### Method
GET

### Endpoint
https://openclaw.ai/install.sh

### Parameters
#### Query Parameters
- **--install-method** (string) - Optional - Choose install method (npm or git). Alias: --method.
- **--npm** (flag) - Optional - Shortcut for npm method.
- **--git** (flag) - Optional - Shortcut for git method. Alias: --github.
- **--version** (string) - Optional - npm version, dist-tag, or package spec (default: latest).
- **--beta** (flag) - Optional - Use beta dist-tag if available.
- **--git-dir** (string) - Optional - Checkout directory (default: ~/openclaw). Alias: --dir.
- **--no-git-update** (flag) - Optional - Skip git pull for existing checkout.
- **--no-prompt** (flag) - Optional - Disable prompts.
- **--no-onboard** (flag) - Optional - Skip onboarding.
- **--onboard** (flag) - Optional - Enable onboarding.
- **--dry-run** (flag) - Optional - Print actions without applying changes.
- **--verbose** (flag) - Optional - Enable debug output.
- **--help** (flag) - Optional - Show usage.

### Request Example
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --dry-run
```

--------------------------------

### Install and Setup Honcho Plugin

Source: https://docs.openclaw.ai/concepts/memory-honcho

Install the Honcho plugin, set it up with API credentials, and force a gateway restart. This is the initial step to integrate Honcho memory into your OpenClaw project.

```bash
openclaw plugins install @honcho-ai/openclaw-honcho
openclaw honcho setup
openclaw gateway --force
```

--------------------------------

### Install OpenClaw with Ansible Quick Start

Source: https://docs.openclaw.ai/install/ansible

Execute this command to automatically install and configure OpenClaw on your production servers using the openclaw-ansible script. Ensure you have the necessary prerequisites met.

```bash
curl -fsSL https://raw.githubusercontent.com/openclaw/openclaw-ansible/main/install.sh | bash
```

--------------------------------

### Openclaw Daemon Usage Examples

Source: https://docs.openclaw.ai/cli/daemon

These commands manage the Openclaw Gateway service. Use them to check status, install, start, stop, restart, or uninstall the service.

```bash
openclaw daemon status
openclaw daemon install
openclaw daemon start
openclaw daemon stop
openclaw daemon restart
openclaw daemon uninstall
```

--------------------------------

### Run Onboarding Wizard

Source: https://docs.openclaw.ai/channels/feishu

Execute the onboarding wizard to configure Feishu credentials and start the gateway.

```bash
openclaw onboard
```

--------------------------------

### Start UI Development Server

Source: https://docs.openclaw.ai/web/control-ui

Launches the UI development server for local testing.

```bash
pnpm ui:dev
```

--------------------------------

### Install Docker and Dependencies

Source: https://docs.openclaw.ai/install/hetzner

Update package lists and install necessary packages like git and curl, then install Docker. Verify the installation by checking Docker and Docker Compose versions.

```bash
apt-get update
apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sh
```

```bash
docker --version
docker compose version
```

--------------------------------

### Install OpenClaw from Source for Development

Source: https://docs.openclaw.ai/help/faq

Steps for contributors and developers to install OpenClaw from source. This includes cloning the repository, installing dependencies, building the project, and building UI assets. Onboarding can be initiated via `pnpm openclaw onboard` if a global install is not present.

```bash
git clone https://github.com/openclaw/openclaw.git
```

```bash
cd openclaw
```

```bash
pnpm install
```

```bash
pnpm build
```

```bash
pnpm ui:build # auto-installs UI deps on first run
```

```bash
openclaw onboard
```

--------------------------------

### Dev Profile Quick Start Commands

Source: https://docs.openclaw.ai/gateway

Commands to quickly set up a development environment, start a gateway that allows unconfigured clients, and check the system status. Defaults include isolated state/config and a base gateway port of 19001.

```bash
openclaw --dev setup
openclaw --dev gateway --allow-unconfigured
openclaw --dev status
```

--------------------------------

### Install Tailscale

Source: https://docs.openclaw.ai/install/oracle

Install Tailscale and bring up the node with SSH enabled.

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up --ssh --hostname=openclaw
```

--------------------------------

### Install Gateway Service with Profiles

Source: https://docs.openclaw.ai/gateway/multiple-gateways

Install the Gateway as a service using profiles to scope service names and configurations.

```bash
openclaw --profile main gateway install
openclaw --profile rescue gateway install
```

--------------------------------

### Basic Openclaw Onboarding

Source: https://docs.openclaw.ai/cli/onboard

Demonstrates basic onboarding commands, including quickstart and manual flows, and remote gateway connections.

```bash
openclaw onboard
openclaw onboard --flow quickstart
openclaw onboard --flow manual
openclaw onboard --mode remote --remote-url wss://gateway-host:18789
```

--------------------------------

### Groq Configuration File Example

Source: https://docs.openclaw.ai/providers/groq

A complete configuration file example including environment variable for the API key and default agent model settings for Groq.

```json5
{
  env: { GROQ_API_KEY: "gsk_..." },
  agents: {
    defaults: {
      model: { primary: "groq/llama-3.3-70b-versatile" },
    },
  },
}
```

--------------------------------

### Run Verbose Installer

Source: https://docs.openclaw.ai/help/faq

Execute the installation script with verbose output enabled to debug installation hangs or failures.

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --verbose
```

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --beta --verbose
```

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --install-method git --verbose
```

--------------------------------

### Install Tailscale on VPS

Source: https://docs.openclaw.ai/help/faq

Installs Tailscale and logs in on a Virtual Private Server. Ensure you have curl installed.

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

--------------------------------

### Quick Setup for OpenClaw with EC2 Instance Roles

Source: https://docs.openclaw.ai/providers/bedrock

A comprehensive guide to setting up an EC2 instance with an IAM role for Bedrock access. This includes creating the IAM role and policy, attaching it to an instance profile, associating the profile with an EC2 instance, configuring OpenClaw on the instance, and verifying model discovery.

```bash
# 1. Create IAM role and instance profile
aws iam create-role --role-name EC2-Bedrock-Access \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "ec2.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

aws iam attach-role-policy --role-name EC2-Bedrock-Access \
  --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess

aws iam create-instance-profile --instance-profile-name EC2-Bedrock-Access
aws iam add-role-to-instance-profile \
  --instance-profile-name EC2-Bedrock-Access \
  --role-name EC2-Bedrock-Access

# 2. Attach to your EC2 instance
aws ec2 associate-iam-instance-profile \
  --instance-id i-xxxxx \
  --iam-instance-profile Name=EC2-Bedrock-Access

# 3. On the EC2 instance, enable discovery explicitly
openclaw config set plugins.entries.amazon-bedrock.config.discovery.enabled true
openclaw config set plugins.entries.amazon-bedrock.config.discovery.region us-east-1

# 4. Optional: add an env marker if you want auto mode without explicit enable
echo 'export AWS_PROFILE=default' >> ~/.bashrc
echo 'export AWS_REGION=us-east-1' >> ~/.bashrc
source ~/.bashrc

# 5. Verify models are discovered
openclaw models list
```

--------------------------------

### Install OpenClaw from Source

Source: https://docs.openclaw.ai/install

Clones the OpenClaw repository, installs dependencies, builds the project, links it globally, and runs the onboarding process.

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install && pnpm ui:build && pnpm build
pnpm link --global
openclaw onboard --install-daemon
```

--------------------------------

### Run OpenClaw Gateway Onboarding

Source: https://docs.openclaw.ai/install/digitalocean

Initiates the OpenClaw gateway onboarding process, which includes model authentication, channel setup, gateway token generation, and systemd daemon installation.

```bash
openclaw onboard --install-daemon
```

--------------------------------

### Open WebUI Quick Setup

Source: https://docs.openclaw.ai/gateway/openai-http-api

Instructions for quickly setting up Open WebUI to connect with OpenClaw, including base URLs and model configuration.

```APIDOC
## Open WebUI quick setup

For a basic Open WebUI connection:

* Base URL: `http://127.0.0.1:18789/v1`
* Docker on macOS base URL: `http://host.docker.internal:18789/v1`
* API key: your Gateway bearer token
* Model: `openclaw/default`

Expected behavior:

* `GET /v1/models` should list `openclaw/default`
* Open WebUI should use `openclaw/default` as the chat model id
* If you want a specific backend provider/model for that agent, set the agent's normal default model or send `x-openclaw-model`

Quick smoke:

```bash
curl -sS http://127.0.0.1:18789/v1/models \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

If that returns `openclaw/default`, most Open WebUI setups can connect with the same base URL and token.
```

--------------------------------

### Pairing Command Examples

Source: https://docs.openclaw.ai/cli/pairing

Examples for listing and approving pairing requests via the OpenClaw CLI.

```bash
openclaw pairing list telegram
openclaw pairing list --channel telegram --account work
openclaw pairing list telegram --json

openclaw pairing approve <code>
openclaw pairing approve telegram <code>
openclaw pairing approve --channel telegram --account work <code> --notify
```

--------------------------------

### Quick Start Browser Commands

Source: https://docs.openclaw.ai/cli/browser

Basic commands to list profiles, start a browser, navigate to a URL, and take a snapshot.

```bash
openclaw browser profiles
openclaw browser --browser-profile openclaw start
openclaw browser --browser-profile openclaw open https://example.com
openclaw browser --browser-profile openclaw snapshot
```

--------------------------------

### Setup and Onboarding API

Source: https://docs.openclaw.ai/cli

Commands for generating shell completion scripts and initializing the OpenClaw configuration and workspace.

```APIDOC
## Setup and Onboarding

### Completion

Generate shell-completion scripts and optionally install them.

**Command:** `completion [-s <zsh|bash|powershell|fish>] [-i] [--write-state] [-y]`

**Options:**
* `-s, --shell <zsh|bash|powershell|fish>`: Specify the shell type.
* `-i, --install`: Install the completion script into your shell profile.
* `--write-state`: Write the completion script to a state file.
* `-y, --yes`: Automatically confirm installation.

**Notes:**
* Without `--install` or `--write-state`, the script is printed to stdout.
* `--install` adds an `OpenClaw Completion` block to your shell profile, pointing to the cached script.

### Setup

Initialize configuration and workspace.

**Command:** `setup [--workspace <dir>] [--wizard] [--non-interactive] [--mode <local|remote>] [--remote-url <url>] [--remote-token <token>]`

**Options:**
* `--workspace <dir>`: Path for the agent workspace (default: `~/.openclaw/workspace`).
* `--wizard`: Run the onboarding wizard.
* `--non-interactive`: Run onboarding without prompts.
* `--mode <local|remote>`: Set the onboarding mode.
* `--remote-url <url>`: Specify the remote Gateway URL.
* `--remote-token <token>`: Provide the remote Gateway token.

**Onboarding Trigger:** Onboarding automatically runs if any onboarding-related flags are present (e.g., `--non-interactive`, `--mode`, `--remote-url`, `--remote-token`).
```

--------------------------------

### Install OpenClaw with Onboarding

Source: https://docs.openclaw.ai/help/faq

Recommended installation method using the official script and onboarding wizard. The wizard can also build UI assets. After onboarding, the Gateway typically runs on port 18789.

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

```bash
openclaw onboard --install-daemon
```

--------------------------------

### Start Gateway in Development Mode

Source: https://docs.openclaw.ai/help/debugging

Use the `gateway:dev` command to launch the gateway with a dev profile, isolating state and creating a safe, disposable debugging setup. This also enables the dev bootstrap process.

```bash
pnpm gateway:dev
```

```bash
OPENCLAW_PROFILE=dev openclaw tui
```

--------------------------------

### Define a setup plugin entry

Source: https://docs.openclaw.ai/plugins/sdk-setup

Use this entry point to register setup surfaces without loading heavy runtime dependencies. It is triggered during onboarding, configuration repair, or deferred channel startup.

```typescript
// setup-entry.ts
import { defineSetupPluginEntry } from "openclaw/plugin-sdk/channel-core";
import { myChannelPlugin } from "./src/channel.js";

export default defineSetupPluginEntry(myChannelPlugin);
```

--------------------------------

### Install OpenClaw Gateway service in WSL2

Source: https://docs.openclaw.ai/platforms/windows

Installs the OpenClaw Gateway as a system service within your WSL2 distribution. This is the recommended method for a stable setup.

```bash
openclaw onboard --install-daemon
```

```bash
openclaw gateway install
```

```bash
openclaw configure
```

--------------------------------

### Install plugin bundles

Source: https://docs.openclaw.ai/plugins/bundles

Commands to install bundles from local directories, archives, or marketplaces.

```bash
# Local directory
openclaw plugins install ./my-bundle

# Archive
openclaw plugins install ./my-bundle.tgz

# Claude marketplace
openclaw plugins marketplace list <marketplace-name>
openclaw plugins install <plugin-name>@<marketplace-name>
```

--------------------------------

### Configure One-Time Container Setup Command

Source: https://docs.openclaw.ai/gateway/sandboxing

Sets a command to run once after the sandbox container is created. This command executes via `sh -lc` inside the container. It's useful for installing packages or performing initial setup.

```yaml
agents.defaults.sandbox.docker.setupCommand: "apt-get update && apt-get install -y nodejs"
```

--------------------------------

### Install OpenClaw with bun

Source: https://docs.openclaw.ai/install

Installs the latest version of OpenClaw globally using bun and then runs the onboarding process with daemon installation. Bun is supported for global CLI installs.

```bash
bun add -g openclaw@latest
openclaw onboard --install-daemon
```

--------------------------------

### Install Prerequisites with APT

Source: https://docs.openclaw.ai/install/ansible

Installs Ansible and Git using apt. Ensure your package list is updated first.

```bash
sudo apt update && sudo apt install -y ansible git
```

--------------------------------

### Initialize Openclaw Setup

Source: https://docs.openclaw.ai/cli/setup

Run `openclaw setup` to initialize the `~/.openclaw/openclaw.json` configuration file and the agent workspace. This command can also be used with flags to initiate the onboarding process.

```bash
openclaw setup
```

```bash
openclaw setup --workspace ~/.openclaw/workspace
```

```bash
openclaw setup --wizard
```

```bash
openclaw setup --non-interactive --mode remote --remote-url wss://gateway-host:18789 --remote-token <token>
```

--------------------------------

### Channel and Setup Utilities

Source: https://docs.openclaw.ai/plugins/sdk-overview

Detailed exports for channel management, setup adapters, and runtime configuration tools.

```APIDOC
## Channel and Setup Utilities

### Description
Provides access to channel-specific logic, setup wizard helpers, and runtime adapters for OpenClaw AI plugins.

### Key Modules
- **plugin-sdk/channel-setup**: `createOptionalChannelSetupSurface`, `createOptionalChannelSetupAdapter`, `createOptionalChannelSetupWizard`, `DEFAULT_ACCOUNT_ID`, `createTopLevelChannelDmPolicy`, `setSetupChannelEnabled`, `splitSetupEntries`
- **plugin-sdk/setup-runtime**: `createPatchedAccountSetupAdapter`, `createEnvPatchedAccountSetupAdapter`, `createSetupInputPresenceValidator`, `noteChannelLookupFailure`, `noteChannelLookupSummary`, `promptResolvedAllowFrom`, `createAllowlistSetupWizardProxy`, `createDelegatedSetupWizardProxy`
- **plugin-sdk/setup-tools**: `formatCliCommand`, `detectBinary`, `extractArchive`, `resolveBrewExecutable`, `formatDocsLink`, `CONFIG_DIR`
```

--------------------------------

### Install OpenClaw

Source: https://docs.openclaw.ai/install/azure

Execute the OpenClaw installation script within the VM. This script installs Node LTS, dependencies, OpenClaw, and launches the onboarding wizard.

```bash
curl -fsSL https://openclaw.ai/install.sh -o /tmp/install.sh
bash /tmp/install.sh
rm -f /tmp/install.sh
```

--------------------------------

### One-time DNS Server Setup for Gateway Host

Source: https://docs.openclaw.ai/gateway/bonjour

Installs and configures CoreDNS on the gateway host to serve a chosen discovery domain from a local database file. This setup is crucial for enabling wide-area Bonjour discovery over Tailscale.

```bash
openclaw dns setup --apply
```

--------------------------------

### Manage Gateway Service Lifecycle

Source: https://docs.openclaw.ai/cli/gateway

Commands to install, start, stop, restart, and uninstall the Gateway service. Lifecycle commands accept `--json` for scripting. `gateway install` supports `--port`, `--runtime`, `--token`, `--force`, and `--json`.

```bash
openclaw gateway install
```

```bash
openclaw gateway start
```

```bash
openclaw gateway stop
```

```bash
openclaw gateway restart
```

```bash
openclaw gateway uninstall
```

--------------------------------

### Run OpenClaw Ansible Playbook

Source: https://docs.openclaw.ai/install/ansible

Executes the main OpenClaw installation playbook. This command initiates the automated setup process.

```bash
./run-playbook.sh
```

--------------------------------

### Install OpenClaw

Source: https://docs.openclaw.ai/install/exe-dev

Execute the official OpenClaw installation script.

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

--------------------------------

### Create and Connect to VM

Source: https://docs.openclaw.ai/install/exe-dev

Commands to provision and access an exe.dev virtual machine.

```bash
ssh exe.dev new
```

```bash
ssh <vm-name>.exe.xyz
```

--------------------------------

### Install Node Host as a Service

Source: https://docs.openclaw.ai/cli/node

Installs the node host as a background user service.

```bash
openclaw node install --host <gateway-host> --port 18789
```

--------------------------------

### Install OpenClaw

Source: https://docs.openclaw.ai/install/macos-vm

Installs the OpenClaw package globally and initializes the daemon.

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

--------------------------------

### Interactive Setup Commands

Source: https://docs.openclaw.ai/channels/qqbot

Alternative methods to configure channels using the interactive CLI wizard.

```bash
openclaw channels add
openclaw configure --section channels
```

--------------------------------

### Switch to OpenClaw User

Source: https://docs.openclaw.ai/install/ansible

After installation, switch to the 'openclaw' user to perform post-installation setup tasks. This is often required before running configuration or login commands.

```bash
sudo -i -u openclaw
```

--------------------------------

### Install and Verify imsg CLI

Source: https://docs.openclaw.ai/channels/imessage

Install the imsg tool via Homebrew and verify the installation.

```bash
brew install steipete/tap/imsg
imsg rpc --help
```

--------------------------------

### Absolute Minimum Openclaw AI Configuration

Source: https://docs.openclaw.ai/gateway/configuration-examples

Use this minimal configuration to get started quickly. Save it to `~/.openclaw/openclaw.json` to enable direct messaging with the bot from a specified WhatsApp number.

```json5
{
  agent: { workspace: "~/.openclaw/workspace" },
  channels: { whatsapp: { allowFrom: ["+15555550123"] } },
}
```

--------------------------------

### Install Node.js on Windows

Source: https://docs.openclaw.ai/install/node

Install Node.js using winget or Chocolatey.

```powershell
winget install OpenJS.NodeJS.LTS
```

```powershell
choco install nodejs-lts
```

--------------------------------

### Onboard with OpenCode API Key (Zen and Go)

Source: https://docs.openclaw.ai/start/wizard-cli-automation

Onboard with OpenCode using an API key. Use `--auth-choice opencode-zen` for the Zen catalog or `--auth-choice opencode-go` for the Go catalog. Ensure OPENCODE_API_KEY is set.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice opencode-zen \
  --opencode-zen-api-key "$OPENCODE_API_KEY" \
  --gateway-port 18789 \
  --gateway-bind loopback
```

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice opencode-go \
  --opencode-go-api-key "$OPENCODE_API_KEY" \
  --gateway-port 18789 \
  --gateway-bind loopback
```

--------------------------------

### Create and Configure GCP Project

Source: https://docs.openclaw.ai/install/gcp

Sets up a new project and configures the CLI to use it.

```bash
gcloud projects create my-openclaw-project --name="OpenClaw Gateway"
gcloud config set project my-openclaw-project
```

--------------------------------

### CLI Examples for Adding Cron Jobs

Source: https://docs.openclaw.ai/automation/cron-jobs

Examples demonstrating how to add cron jobs using the `openclaw cron add` command for different scenarios.

```APIDOC
## CLI Examples

### One-shot Reminder (Main Session)

```bash
openclaw cron add \
  --name "Calendar check" \
  --at "20m" \
  --session main \
  --system-event "Next heartbeat: check calendar." \
  --wake now
```

### Recurring Isolated Job with Delivery

```bash
openclaw cron add \
  --name "Morning brief" \
  --cron "0 7 * * *" \
  --tz "America/Los_Angeles" \
  --session isolated \
  --message "Summarize overnight updates." \
  --announce \
  --channel slack \
  --to "channel:C1234567890"
```

### Isolated Job with Model and Thinking Override

```bash
openclaw cron add \
  --name "Deep analysis" \
  --cron "0 6 * * 1" \
  --tz "America/Los_Angeles" \
  --session isolated \
  --message "Weekly deep analysis of project progress." \
  --model "opus" \
  --thinking high \
  --announce
```
```

--------------------------------

### Full QMD Configuration Example

Source: https://docs.openclaw.ai/reference/memory-config

A comprehensive QMD configuration including backend settings, citations, update intervals, limits, scope, and paths for markdown files.

```json5
{
  memory: {
    backend: "qmd",
    citations: "auto",
    qmd: {
      includeDefaultMemory: true,
      update: { interval: "5m", debounceMs: 15000 },
      limits: { maxResults: 6, timeoutMs: 4000 },
      scope: {
        default: "deny",
        rules: [{ action: "allow", match: { chatType: "direct" } }],
      },
      paths: [{ name: "docs", path: "~/notes", pattern: "**/*.md" }],
    },
  },
}
```

--------------------------------

### Install Project Dependencies

Source: https://docs.openclaw.ai/platforms/mac/dev-setup

Installs all project-wide dependencies using pnpm. Ensure Node.js and pnpm are installed beforehand.

```bash
pnpm install
```

--------------------------------

### Configure Venice via Non-interactive Setup

Source: https://docs.openclaw.ai/providers/venice

Automate the onboarding process by providing the API key as a flag.

```bash
openclaw onboard --non-interactive \
  --auth-choice venice-api-key \
  --venice-api-key "vapi_xxxxxxxxxxxx"
```

--------------------------------

### Install Zalo Personal Plugin from npm

Source: https://docs.openclaw.ai/plugins/zalouser

Use this command to install the Zalo Personal plugin from npm. Restart the Gateway after installation.

```bash
openclaw plugins install @openclaw/zalouser
```

--------------------------------

### Setup CoreDNS for Wide-Area Discovery

Source: https://docs.openclaw.ai/cli/dns

Use this command to plan or apply CoreDNS setup for unicast DNS-SD discovery. The `--apply` flag installs or updates the CoreDNS configuration and restarts the service, requiring sudo privileges. It is currently only supported on macOS with Homebrew CoreDNS.

```bash
openclaw dns setup
```

```bash
openclaw dns setup --domain openclaw.internal
```

```bash
openclaw dns setup --apply
```

--------------------------------

### Install WhatsApp Plugin

Source: https://docs.openclaw.ai/channels/whatsapp

Use this command to manually install the WhatsApp plugin if it's not automatically handled during onboarding or channel addition.

```bash
openclaw plugins install @openclaw/whatsapp
```

--------------------------------

### CLI: openclaw dns setup

Source: https://docs.openclaw.ai/cli/dns

Plan or apply CoreDNS setup for unicast DNS-SD discovery.

```APIDOC
## CLI: openclaw dns setup

### Description
Plan or apply CoreDNS setup for unicast DNS-SD discovery. Without --apply, it acts as a planning helper; with --apply, it installs/updates CoreDNS config and restarts the service (macOS/Homebrew only).

### Parameters
#### Query Parameters
- **--domain** (string) - Optional - Wide-area discovery domain (e.g., openclaw.internal).
- **--apply** (boolean) - Optional - Install or update CoreDNS config and restart the service.
```

--------------------------------

### Setup Agent Workspace

Source: https://docs.openclaw.ai/start/openclaw

Initializes the agent workspace directory and required configuration files.

```bash
openclaw setup
```

--------------------------------

### Onboard OpenCode Go via CLI

Source: https://docs.openclaw.ai/providers/opencode-go

Use these commands to authenticate and onboard the OpenCode Go provider.

```bash
openclaw onboard --auth-choice opencode-go
# or non-interactive
openclaw onboard --opencode-go-api-key "$OPENCODE_API_KEY"
```

--------------------------------

### Install Plugins with Explicit Marketplace Source

Source: https://docs.openclaw.ai/cli/plugins

Commands to install plugins by explicitly defining the marketplace source via name, GitHub shorthand, URL, or local path.

```bash
openclaw plugins install <plugin-name> --marketplace <marketplace-name>
openclaw plugins install <plugin-name> --marketplace <owner/repo>
openclaw plugins install <plugin-name> --marketplace https://github.com/<owner>/<repo>
openclaw plugins install <plugin-name> --marketplace ./my-marketplace
```

--------------------------------

### Install and Enable acpx Plugin

Source: https://docs.openclaw.ai/tools/acp-agents

Commands to install the acpx plugin and explicitly enable it in the configuration.

```bash
openclaw plugins install acpx
openclaw config set plugins.entries.acpx.enabled true
```

--------------------------------

### Systemd User Unit Configuration for OpenClaw Gateway

Source: https://docs.openclaw.ai/platforms/linux

Create this systemd user unit file for minimal OpenClaw Gateway setup. Ensure to replace `<profile>` and `<version>` with your specific values. Enable and start the service using `systemctl --user`.

```systemd
[Unit]
Description=OpenClaw Gateway (profile: <profile>, v<version>)
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/local/bin/openclaw gateway --port 18789
Restart=always
RestartSec=5
TimeoutStopSec=30
TimeoutStartSec=30
SuccessExitStatus=0 143
KillMode=control-group

[Install]
WantedBy=default.target
```

```bash
systemctl --user enable --now openclaw-gateway[-<profile>].service
```

--------------------------------

### Setup and Gateway Commands with Profiles

Source: https://docs.openclaw.ai/gateway/multiple-gateways

Use profiles to manage separate configurations and state directories for different Gateway instances. Ensure unique ports for each instance.

```bash
# main
openclaw --profile main setup
openclaw --profile main gateway --port 18789

# rescue
openclaw --profile rescue setup
openclaw --profile rescue gateway --port 19001
```

--------------------------------

### Setup Podman Gateway

Source: https://docs.openclaw.ai/install/podman

Run this script for one-time setup of the OpenClaw Gateway in Podman. It builds the local image and creates necessary configuration files.

```bash
./scripts/podman/setup.sh
```

--------------------------------

### Configure Venice via Interactive Setup

Source: https://docs.openclaw.ai/providers/venice

Use the interactive onboarding command to configure authentication and select a default model.

```bash
openclaw onboard --auth-choice venice-api-key
```

--------------------------------

### Connect and update system

Source: https://docs.openclaw.ai/install/oracle

Connect to the instance via SSH and update the package repository and install build essentials.

```bash
ssh ubuntu@YOUR_PUBLIC_IP

sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential
```

--------------------------------

### Quadlet File Location

Source: https://docs.openclaw.ai/install/podman

The Quadlet file for Openclaw is installed at this location if the setup script with the --quadlet flag was used.

```bash
~/.config/containers/systemd/openclaw.container
```

--------------------------------

### Channel Setup Wizard Implementation

Source: https://docs.openclaw.ai/plugins/sdk-setup

Defines an interactive setup wizard for a channel plugin, including status and credential handling.

```typescript
import type { ChannelSetupWizard } from "openclaw/plugin-sdk/channel-setup";

const setupWizard: ChannelSetupWizard = {
  channel: "my-channel",
  status: {
    configuredLabel: "Connected",
    unconfiguredLabel: "Not configured",
    resolveConfigured: ({ cfg }) => Boolean((cfg.channels as any)?.["my-channel"]?.token),
  },
  credentials: [
    {
      inputKey: "token",
      providerHint: "my-channel",
      credentialLabel: "Bot token",
      preferredEnvVar: "MY_CHANNEL_BOT_TOKEN",
      envPrompt: "Use MY_CHANNEL_BOT_TOKEN from environment?",
      keepPrompt: "Keep current token?",
      inputPrompt: "Enter your bot token:",
      inspect: ({ cfg, accountId }) => {
        const token = (cfg.channels as any)?.["my-channel"]?.token;
        return {
          accountConfigured: Boolean(token),
          hasConfiguredValue: Boolean(token),
        };
      },
    },
  ],
};
```

--------------------------------

### Install LINE Plugin

Source: https://docs.openclaw.ai/channels/line

Commands to install the LINE plugin manually for older builds or custom installations.

```bash
openclaw plugins install @openclaw/line
```

```bash
openclaw plugins install ./path/to/local/line-plugin
```

--------------------------------

### Install Openclaw AI (Default)

Source: https://docs.openclaw.ai/install/installer

Use this command to install Openclaw AI with default settings. Ensure you have curl installed.

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash
```

--------------------------------

### Install OpenClaw

Source: https://docs.openclaw.ai/platforms/windows

Clones the repository and installs dependencies required to run OpenClaw.

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build # auto-installs UI deps on first run
pnpm build
openclaw onboard
```

--------------------------------

### Install Plugin via Link

Source: https://docs.openclaw.ai/cli/plugins

Install a local directory as a plugin without copying files by adding it to the load paths.

```bash
openclaw plugins install -l ./my-plugin
```

--------------------------------

### Install Context Engine Plugin

Source: https://docs.openclaw.ai/concepts/context-engine

Install plugins via npm or from a local development path.

```bash
# Install from npm
openclaw plugins install @martian-engineering/lossless-claw

# Or install from a local path (for development)
openclaw plugins install -l ./my-context-engine
```

--------------------------------

### Install Local acpx Plugin

Source: https://docs.openclaw.ai/tools/acp-agents

Installs the acpx plugin from a local directory path.

```bash
openclaw plugins install ./path/to/local/acpx-plugin
```

--------------------------------

### Gateway Management Commands

Source: https://docs.openclaw.ai/channels/feishu

Provides commands to manage the OpenCLaw gateway service, including status checks, installation, starting, stopping, and restarting.

```bash
openclaw gateway status
openclaw gateway install
openclaw gateway stop
openclaw gateway restart
```

--------------------------------

### Start the claude-max-api server

Source: https://docs.openclaw.ai/providers/claude-max-api-proxy

Run this command to start the proxy server. The server will be accessible at http://localhost:3456.

```bash
claude-max-api
# Server runs at http://localhost:3456
```

--------------------------------

### Install OpenClaw with Beta Flag

Source: https://docs.openclaw.ai/help/faq

Use this command to install the beta version of OpenClaw on macOS or Linux. Ensure you have curl installed.

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --beta
```

--------------------------------

### Install Matrix Plugin

Source: https://docs.openclaw.ai/channels/matrix

Commands to install the Matrix plugin from npm or a local directory.

```bash
openclaw plugins install @openclaw/matrix
```

```bash
openclaw plugins install ./path/to/local/matrix-plugin
```

--------------------------------

### Install Node.js on macOS

Source: https://docs.openclaw.ai/install/node

Install Node.js using Homebrew.

```bash
brew install node
```

--------------------------------

### Install OpenClaw with pnpm

Source: https://docs.openclaw.ai/install

Installs the latest version of OpenClaw globally using pnpm, approves build scripts, and runs the onboarding process with daemon installation.

```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g
openclaw onboard --install-daemon
```

--------------------------------

### Install dependencies with Bun

Source: https://docs.openclaw.ai/install/bun

Commands to install project dependencies using Bun.

```sh
bun install
```

```sh
bun install --no-save
```

--------------------------------

### Run Packaged Gateway

Source: https://docs.openclaw.ai/start/setup

Starts the Gateway manually from the repository after building.

```bash
node openclaw.mjs gateway --port 18789 --verbose
```

--------------------------------

### Configure global skills and installation settings

Source: https://docs.openclaw.ai/tools/skills-config

Defines skill loading directories, installation managers, and per-skill environment configurations in ~/.openclaw/openclaw.json.

```json5
{
  skills: {
    allowBundled: ["gemini", "peekaboo"],
    load: {
      extraDirs: ["~/Projects/agent-scripts/skills", "~/Projects/oss/some-skill-pack/skills"],
      watch: true,
      watchDebounceMs: 250,
    },
    install: {
      preferBrew: true,
      nodeManager: "npm", // npm | pnpm | yarn | bun (Gateway runtime still Node; bun not recommended)
    },
    entries: {
      "image-lab": {
        enabled: true,
        apiKey: { source: "env", provider: "default", id: "GEMINI_API_KEY" }, // or plaintext string
        env: {
          GEMINI_API_KEY: "GEMINI_KEY_HERE",
        },
      },
      peekaboo: { enabled: true },
      sag: { enabled: false },
    },
  },
}
```

--------------------------------

### Onboard Volcengine with API Key

Source: https://docs.openclaw.ai/providers/volcengine

Use this command to set up the Volcengine API key for authentication. This is the first step in configuring the provider.

```bash
openclaw onboard --auth-choice volcengine-api-key
```

--------------------------------

### Install CLI Tool (install-cli.sh)

Source: https://docs.openclaw.ai/install/installer

Installs the OpenClaw CLI tool using install-cli.sh with JSON output and a specified installation prefix. This is suitable for automated deployments.

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash -s -- --json --prefix /opt/openclaw
```

--------------------------------

### Start the Gateway Service

Source: https://docs.openclaw.ai/gateway

Use these commands to start the Gateway service locally. The `--verbose` flag enables debug/trace output to stdio. The `--force` flag can be used to kill any existing listener on the selected port before starting.

```bash
openclaw gateway --port 18789
# debug/trace mirrored to stdio
openclaw gateway --port 18789 --verbose
# force-kill listener on selected port, then start
openclaw gateway --force
```

--------------------------------

### Install Hook Packs

Source: https://docs.openclaw.ai/cli/hooks

Install hook packs using the unified plugins installer. Supports local paths, archives, and npm packages.

```bash
openclaw plugins install <package>        # ClawHub first, then npm
openclaw plugins install <package> --pin  # pin version
openclaw plugins install <path>           # local path
```

```bash
# Local directory
openclaw plugins install ./my-hook-pack

# Local archive
openclaw plugins install ./my-hook-pack.zip

# NPM package
openclaw plugins install @openclaw/my-hook-pack

# Link a local directory without copying
openclaw plugins install -l ./my-hook-pack
```

--------------------------------

### Install plugin from ClawHub explicitly

Source: https://docs.openclaw.ai/plugins/sdk-setup

Forces the installation to use the ClawHub registry.

```bash
openclaw plugins install clawhub:@myorg/openclaw-my-plugin   # ClawHub only
```

--------------------------------

### Install OpenClaw (Windows PowerShell)

Source: https://docs.openclaw.ai/install

Use this command to quickly install OpenClaw on Windows using PowerShell. It handles Node installation and launches onboarding.

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

--------------------------------

### ACP Doctor Readiness Check

Source: https://docs.openclaw.ai/tools/acp-agents

Run this command for a fast readiness check of the ACP setup. It helps identify potential issues before starting a session.

```bash
/acp doctor
```

--------------------------------

### Install Node.js 24

Source: https://docs.openclaw.ai/install/raspberry-pi

Configure the NodeSource repository and install Node.js version 24.

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
node --version
```

--------------------------------

### Run OpenClaw Configuration Commands

Source: https://docs.openclaw.ai/cli/configure

Examples of executing the interactive configuration wizard with various section filters.

```bash
openclaw configure
openclaw configure --section web
openclaw configure --section model --section channels
openclaw configure --section gateway --section daemon
```

--------------------------------

### Install ClawHub CLI

Source: https://docs.openclaw.ai/tools/clawhub

Global installation of the ClawHub CLI tool for registry-authenticated workflows.

```bash
npm i -g clawhub
```

```bash
pnpm add -g clawhub
```

--------------------------------

### Install Voice Call Plugin from npm

Source: https://docs.openclaw.ai/plugins/voice-call

Use this command to install the Voice Call plugin from npm. Ensure you restart the Gateway after installation.

```bash
openclaw plugins install @openclaw/voice-call
```

--------------------------------

### Install Plugins from ClawHub

Source: https://docs.openclaw.ai/cli/plugins

Commands to install specific packages or versions directly from the ClawHub registry.

```bash
openclaw plugins install clawhub:openclaw-codex-app-server
openclaw plugins install clawhub:openclaw-codex-app-server@1.2.3
```

--------------------------------

### Full OpenClaw Configuration Example

Source: https://docs.openclaw.ai/gateway/configuration-examples

A complete JSON5 configuration file demonstrating major options including environment variables, authentication profiles, logging, routing, and channel-specific settings.

```json5
{
  // Environment + shell
  env: {
    OPENROUTER_API_KEY: "sk-or-...",
    vars: {
      GROQ_API_KEY: "gsk-...",
    },
    shellEnv: {
      enabled: true,
      timeoutMs: 15000,
    },
  },

  // Auth profile metadata (secrets live in auth-profiles.json)
  auth: {
    profiles: {
      "anthropic:default": { provider: "anthropic", mode: "api_key" },
      "anthropic:work": { provider: "anthropic", mode: "api_key" },
      "openai:default": { provider: "openai", mode: "api_key" },
      "openai-codex:personal": { provider: "openai-codex", mode: "oauth" },
    },
    order: {
      anthropic: ["anthropic:default", "anthropic:work"],
      openai: ["openai:default"],
      "openai-codex": ["openai-codex:personal"],
    },
  },

  // Identity
  identity: {
    name: "Samantha",
    theme: "helpful sloth",
    emoji: "🦥",
  },

  // Logging
  logging: {
    level: "info",
    file: "/tmp/openclaw/openclaw.log",
    consoleLevel: "info",
    consoleStyle: "pretty",
    redactSensitive: "tools",
  },

  // Message formatting
  messages: {
    messagePrefix: "[openclaw]",
    responsePrefix: ">",
    ackReaction: "👀",
    ackReactionScope: "group-mentions",
  },

  // Routing + queue
  routing: {
    groupChat: {
      mentionPatterns: ["@openclaw", "openclaw"],
      historyLimit: 50,
    },
    queue: {
      mode: "collect",
      debounceMs: 1000,
      cap: 20,
      drop: "summarize",
      byChannel: {
        whatsapp: "collect",
        telegram: "collect",
        discord: "collect",
        slack: "collect",
        signal: "collect",
        imessage: "collect",
        webchat: "collect",
      },
    },
  },

  // Tooling
  tools: {
    media: {
      audio: {
        enabled: true,
        maxBytes: 20971520,
        models: [
          { provider: "openai", model: "gpt-4o-mini-transcribe" },
          // Optional CLI fallback (Whisper binary):
          // { type: "cli", command: "whisper", args: ["--model", "base", "{{MediaPath}}"] }
        ],
        timeoutSeconds: 120,
      },
      video: {
        enabled: true,
        maxBytes: 52428800,
        models: [{ provider: "google", model: "gemini-3-flash-preview" }],
      },
    },
  },

  // Session behavior
  session: {
    scope: "per-sender",
    dmScope: "per-channel-peer", // recommended for multi-user inboxes
    reset: {
      mode: "daily",
      atHour: 4,
      idleMinutes: 60,
    },
    resetByChannel: {
      discord: { mode: "idle", idleMinutes: 10080 },
    },
    resetTriggers: ["/new", "/reset"],
    store: "~/.openclaw/agents/default/sessions/sessions.json",
    maintenance: {
      mode: "warn",
      pruneAfter: "30d",
      maxEntries: 500,
      rotateBytes: "10mb",
      resetArchiveRetention: "30d", // duration or false
      maxDiskBytes: "500mb", // optional
      highWaterBytes: "400mb", // optional (defaults to 80% of maxDiskBytes)
    },
    typingIntervalSeconds: 5,
    sendPolicy: {
      default: "allow",
      rules: [{ action: "deny", match: { channel: "discord", chatType: "group" } }],
    },
  },

  // Channels
  channels: {
    whatsapp: {
      dmPolicy: "pairing",
      allowFrom: ["+15555550123"],
      groupPolicy: "allowlist",
      groupAllowFrom: ["+15555550123"],
      groups: { "*": { requireMention: true } },
    },

    telegram: {
      enabled: true,
      botToken: "YOUR_TELEGRAM_BOT_TOKEN",
      allowFrom: ["123456789"],
      groupPolicy: "allowlist",
      groupAllowFrom: ["123456789"],
      groups: { "*": { requireMention: true } },
    },

    discord: {
      enabled: true,
      token: "YOUR_DISCORD_BOT_TOKEN",
      dm: { enabled: true, allowFrom: ["123456789012345678"] },
      guilds: {
        "123456789012345678": {
          slug: "friends-of-openclaw",
          requireMention: false,
          channels: {
            general: { allow: true },
            help: { allow: true, requireMention: true },
          },
        },
      },
    },

    slack: {
      enabled: true,
      botToken: "xoxb-REPLACE_ME",
      appToken: "xapp-REPLACE_ME",
      channels: {
        "#general": { allow: true, requireMention: true },
      },
      dm: { enabled: true, allowFrom: ["U123"] },
      slashCommand: {
        enabled: true,
        name: "openclaw",
        sessionPrefix: "slack:slash",
        ephemeral: true,
      },
    },
  },

  // Agent runtime
  agents: {
    defaults: {
      workspace: "~/.openclaw/workspace",
      userTimezone: "America/Chicago",
      model: {
        primary: "anthropic/claude-sonnet-4-6",
        fallbacks: ["anthropic/claude-opus-4-6", "openai/gpt-5.4"],
      },
      imageModel: {
        primary: "openrouter/anthropic/claude-sonnet-4-6",
      },
      models: {
        "anthropic/claude-opus-4-6": { alias: "opus" },
```

--------------------------------

### Channel Configuration Example

Source: https://docs.openclaw.ai/plugins/sdk-setup

An example JSON object demonstrating the structure of a channel configuration.

```APIDOC
## Channel Configuration Example

This example shows a typical configuration for a channel within the `openclaw` structure.

### Request Body Example

```json
{
  "openclaw": {
    "channel": {
      "id": "my-channel",
      "label": "My Channel",
      "selectionLabel": "My Channel (self-hosted)",
      "detailLabel": "My Channel Bot",
      "docsPath": "/channels/my-channel",
      "docsLabel": "my-channel",
      "blurb": "Webhook-based self-hosted chat integration.",
      "order": 80,
      "aliases": ["mc"],
      "preferOver": ["my-channel-legacy"],
      "selectionDocsPrefix": "Guide:",
      "selectionExtras": ["Markdown"],
      "markdownCapable": true,
      "exposure": {
        "configured": true,
        "setup": true,
        "docs": true
      },
      "quickstartAllowFrom": true
    }
  }
}
```
```

--------------------------------

### Install OpenClaw

Source: https://docs.openclaw.ai/

Install the OpenClaw package globally using npm. Ensure you have Node.js 24 or Node.js 22 LTS installed.

```bash
npm install -g openclaw@latest

```

--------------------------------

### CLI Setup for Qianfan API Key

Source: https://docs.openclaw.ai/providers/qianfan

Use this command to initiate the OpenClaw onboarding process and select Qianfan as your authentication method.

```bash
openclaw onboard --auth-choice qianfan-api-key
```

--------------------------------

### Install Opik Plugin

Source: https://docs.openclaw.ai/plugins/community

Install the official Opik plugin to export agent traces. This allows monitoring agent behavior, cost, tokens, and errors.

```bash
openclaw plugins install @opik/opik-openclaw
```

--------------------------------

### Hooks Management API

Source: https://docs.openclaw.ai/cli/index

Manage internal agent hooks. Supports listing, getting info, checking status, enabling, disabling, installing, and updating hooks.

```APIDOC
## Hooks Management

Manage internal agent hooks.

### Subcommands

* `hooks list`: List all hooks.
* `hooks info <name>`: Show details for a specific hook.
* `hooks check`: Check the status of hooks.
* `hooks enable <name>`: Enable a hook.
* `hooks disable <name>`: Disable a hook.
* `hooks install <path-or-spec>`: Install a hook (deprecated alias for `openclaw plugins install`).
* `hooks update [id]`: Update a hook (deprecated alias for `openclaw plugins update`).

### Common Options

* `--json`: Output in JSON format.
* `--eligible`: Show only eligible hooks.
* `-v`, `--verbose`: Include verbose output.

### Notes

* Plugin-managed hooks cannot be enabled or disabled through `openclaw hooks`; enable or disable the owning plugin instead.
* `hooks install` and `hooks update` still work as compatibility aliases, but they print deprecation warnings and forward to the plugin commands.
```

--------------------------------

### Install Openclaw AI (Git Method)

Source: https://docs.openclaw.ai/install/installer

Install Openclaw AI using the git method, which checks out the repository directly. This is an alternative to the default npm installation.

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --install-method git
```

--------------------------------

### Install Nextcloud Talk Plugin via CLI

Source: https://docs.openclaw.ai/channels/nextcloud-talk

Use this command to install the Nextcloud Talk plugin from the npm registry. Ensure you have the OpenClaw CLI installed.

```bash
openclaw plugins install @openclaw/nextcloud-talk
```

--------------------------------

### Local Prefix Installer

Source: https://docs.openclaw.ai/install

Installs OpenClaw and Node under a local prefix like ~/.openclaw, useful for avoiding system-wide Node installs.

```bash
curl -fsSL https://openclaw.ai/install-cli.sh | bash
```

--------------------------------

### Onboard OpenCode Catalogs via CLI

Source: https://docs.openclaw.ai/providers/opencode

Use these commands to authenticate and configure the Zen or Go catalogs. Ensure the OPENCODE_API_KEY environment variable is set before execution.

```bash
openclaw onboard --auth-choice opencode-zen
openclaw onboard --opencode-zen-api-key "$OPENCODE_API_KEY"
```

```bash
openclaw onboard --auth-choice opencode-go
openclaw onboard --opencode-go-api-key "$OPENCODE_API_KEY"
```

--------------------------------

### Download new skills

Source: https://docs.openclaw.ai/tools/clawhub

Install a specific skill package by its slug.

```bash
clawhub install my-skill-pack
```

--------------------------------

### Nodes vs. Second Gateway Installation

Source: https://docs.openclaw.ai/help/faq

Guidance on when to add a device as a node versus installing a second gateway.

```APIDOC
## Nodes vs. Second Gateway Installation

### Description
This section clarifies the distinction between adding a device as a 'node' and installing a separate 'gateway', helping users choose the appropriate setup.

### When to Add a Node
*   If you only require **local tools** (screen, camera, exec) on a second laptop, add it as a **node**.
*   This approach maintains a single Gateway and avoids configuration duplication.
*   Local node tools are currently supported on macOS, with plans for broader OS support.

### When to Install a Second Gateway
*   Install a second Gateway only when you need **hard isolation** between environments or require two fully independent bots.

### Related Documentation
*   [Nodes](/nodes)
*   [Nodes CLI](/cli/nodes)
*   [Multiple gateways](/gateway/multiple-gateways)
```

--------------------------------

### Invoke Command on Openclaw Node via RPC

Source: https://docs.openclaw.ai/nodes

Invoke a command on a specified Openclaw node using low-level RPC. This example evaluates JavaScript to get the current location.

```bash
openclaw nodes invoke --node <idOrNameOrIp> --command canvas.eval --params '{"javaScript":"location.href"}'
```

--------------------------------

### Install OpenClaw (Git Method PowerShell)

Source: https://docs.openclaw.ai/install/installer

Installs OpenClaw using the Git method via PowerShell. This clones the repository and builds the project with pnpm. Requires Git to be installed.

```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -InstallMethod git
```

--------------------------------

### Onboard with fal API Key

Source: https://docs.openclaw.ai/providers/fal

Use this command to set up authentication for the fal provider. It prompts for your FAL_KEY.

```bash
openclaw onboard --auth-choice fal-api-key
```

--------------------------------

### Install OpenClaw Skills on Linux

Source: https://docs.openclaw.ai/help/faq

Commands for searching, installing, and managing skills on Linux systems using the OpenClaw CLI. Native installation writes to the active workspace.

```bash
openclaw skills search "calendar"
```

```bash
openclaw skills search --limit 20
```

```bash
openclaw skills install <skill-slug>
```

```bash
openclaw skills install <skill-slug> --version <version>
```

```bash
openclaw skills install <skill-slug> --force
```

```bash
openclaw skills update --all
```

```bash
openclaw skills list --eligible
```

```bash
openclaw skills check
```

--------------------------------

### Install external plugin

Source: https://docs.openclaw.ai/plugins/sdk-setup

Installs a plugin from ClawHub or npm, with ClawHub prioritized by default.

```bash
openclaw plugins install @myorg/openclaw-my-plugin
```

--------------------------------

### Date Range Search with Brave

Source: https://docs.openclaw.ai/tools/brave-search

Conduct a search within a specific date range using Brave. This example demonstrates filtering results published after a start date and before an end date.

```javascript
await web_search({
  query: "AI developments",
  date_after: "2024-01-01",
  date_before: "2024-06-30",
});
```

--------------------------------

### Install WSL2 and Ubuntu

Source: https://docs.openclaw.ai/platforms/windows

Installs the WSL2 subsystem and a specific Linux distribution.

```powershell
wsl --install
# Or pick a distro explicitly:
wsl --list --online
wsl --install -d Ubuntu-24.04
```

--------------------------------

### Install plugins via CLI

Source: https://docs.openclaw.ai/tools/plugin

Installs plugins from npm, local directories, or archive files.

```bash
# From npm
openclaw plugins install @openclaw/voice-call

# From a local directory or archive
openclaw plugins install ./my-plugin
openclaw plugins install ./my-plugin.tgz
```

--------------------------------

### Manage Marketplace Plugins

Source: https://docs.openclaw.ai/cli/plugins

Commands to list available plugins in a marketplace and install them using shorthand notation.

```bash
openclaw plugins marketplace list <marketplace-name>
openclaw plugins install <plugin-name>@<marketplace-name>
```

--------------------------------

### Define Setup Plugin Entry

Source: https://docs.openclaw.ai/plugins/sdk-entrypoints

Use `defineSetupPluginEntry` for lightweight `setup-entry.ts` files. It returns just `{ plugin }` without runtime or CLI wiring, suitable for disabled, unconfigured, or deferred loading scenarios.

```typescript
import { defineSetupPluginEntry } from "openclaw/plugin-sdk/channel-core";

export default defineSetupPluginEntry(myChannelPlugin);
```

--------------------------------

### Onboard Kimi Coding API Key

Source: https://docs.openclaw.ai/providers/moonshot

Use this command to onboard the Kimi Coding API with your API key.

```bash
openclaw onboard --auth-choice kimi-code-api-key
```

--------------------------------

### Custom Linux systemd User Unit Configuration

Source: https://docs.openclaw.ai/gateway

Example systemd user unit file for configuring the OpenClaw gateway with custom settings like port and restart behavior. This is useful for custom install paths or specific service requirements.

```ini
[Unit]
Description=OpenClaw Gateway
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/local/bin/openclaw gateway --port 18789
Restart=always
RestartSec=5
TimeoutStopSec=30
TimeoutStartSec=30
SuccessExitStatus=0 143
KillMode=control-group

[Install]
WantedBy=default.target
```

--------------------------------

### Verify Binary Installation

Source: https://docs.openclaw.ai/install/docker-vm-runtime

Check that the required binaries are correctly installed and accessible within the container.

```bash
docker compose exec openclaw-gateway which gog
docker compose exec openclaw-gateway which goplaces
docker compose exec openclaw-gateway which wacli
```

--------------------------------

### OpenClaw Gateway Smoke Check

Source: https://docs.openclaw.ai/platforms/mac/bundled-gateway

Verify the OpenClaw CLI installation and start the Gateway in local mode. The Gateway is configured to run on port 18999 and bind to the loopback interface. This is followed by a health check call to ensure the Gateway is responsive.

```bash
openclaw --version

OPENCLAW_SKIP_CHANNELS=1 \
OPENCLAW_SKIP_CANVAS_HOST=1 \
openclaw gateway --port 18999 --bind loopback
```

```bash
openclaw gateway call health --url ws://127.0.0.1:18999 --timeout 3000
```

--------------------------------

### Automate onboarding with environment-backed references

Source: https://docs.openclaw.ai/start/wizard-cli-automation

Use this command to store environment-backed references instead of plaintext values. Provider environment variables must be set in the process environment.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice openai-api-key \
  --secret-input-mode ref \
  --accept-risk
```

--------------------------------

### Install Plugins via Default Registry

Source: https://docs.openclaw.ai/cli/plugins

Installs a plugin using the default resolution order, preferring ClawHub over npm.

```bash
openclaw plugins install openclaw-codex-app-server
```

--------------------------------

### Define CLI Backend Configuration

Source: https://docs.openclaw.ai/gateway/cli-backends

Full configuration example for a custom CLI backend, including argument mapping and session handling.

```json5
{
  agents: {
    defaults: {
      cliBackends: {
        "codex-cli": {
          command: "/opt/homebrew/bin/codex",
        },
        "my-cli": {
          command: "my-cli",
          args: ["--json"],
          output: "json",
          input: "arg",
          modelArg: "--model",
          modelAliases: {
            "claude-opus-4-6": "opus",
            "claude-sonnet-4-6": "sonnet",
          },
          sessionArg: "--session",
          sessionMode: "existing",
          sessionIdFields: ["session_id", "conversation_id"],
          systemPromptArg: "--system",
          // Codex-style CLIs can point at a prompt file instead:
          // systemPromptFileConfigArg: "-c",
          // systemPromptFileConfigKey: "model_instructions_file",
          systemPromptWhen: "first",
          imageArg: "--image",
          imageMode: "repeat",
          serialize: true,
        },
      },
    },
  },
}
```

--------------------------------

### Install Zalo Personal Plugin from Local Folder (Dev)

Source: https://docs.openclaw.ai/plugins/zalouser

Install the Zalo Personal plugin from a local folder for development purposes. Ensure you run `pnpm install` within the plugin's source directory and restart the Gateway afterwards.

```bash
PLUGIN_SRC=./path/to/local/zalouser-plugin
openclaw plugins install "$PLUGIN_SRC"
cd "$PLUGIN_SRC" && pnpm install
```

--------------------------------

### Creating an Optional Channel Setup Surface

Source: https://docs.openclaw.ai/plugins/sdk-setup

Helper function to create an optional setup surface for a channel, returning both adapter and wizard components.

```typescript
import { createOptionalChannelSetupSurface } from "openclaw/plugin-sdk/channel-setup";

const setupSurface = createOptionalChannelSetupSurface({
  channel: "my-channel",
  label: "My Channel",
  npmSpec: "@myorg/openclaw-my-channel",
  docsPath: "/channels/my-channel",
});
// Returns { setupAdapter, setupWizard }
```

--------------------------------

### Tailscale Integration for VPS and Mac

Source: https://docs.openclaw.ai/help/faq

Step-by-step guide to setting up Tailscale on a VPS and connecting from a Mac for secure access.

```APIDOC
## Setting up Tailscale on a VPS and connecting from a Mac

### Description
This guide outlines the minimal steps to establish a secure connection between a VPS running Openclaw AI and a Mac using Tailscale.

### Steps

1.  **Install and Login on the VPS**:
    ```bash
    curl -fsSL https://tailscale.com/install.sh | sh
    sudo tailscale up
    ```

2.  **Install and Login on your Mac**:
    *   Use the Tailscale application and sign in to the same tailnet.

3.  **Enable MagicDNS (Recommended)**:
    *   In the Tailscale admin console, enable MagicDNS to assign a stable name to the VPS.

4.  **Use the Tailnet Hostname**:
    *   SSH: `ssh user@your-vps.tailnet-xxxx.ts.net`
    *   Gateway WS: `ws://your-vps.tailnet-xxxx.ts.net:18789`

### Exposing Gateway via Tailscale Serve
To access the Control UI without SSH, use Tailscale Serve on the VPS:

```bash
openclaw gateway --tailscale serve
```

This binds the gateway to the loopback interface and exposes HTTPS through Tailscale. See [Tailscale](/gateway/tailscale) for more details.
```

--------------------------------

### Install Node.js on Linux

Source: https://docs.openclaw.ai/install/node

Install Node.js on Ubuntu/Debian or Fedora/RHEL systems.

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs
```

```bash
sudo dnf install nodejs
```

--------------------------------

### Install Lume

Source: https://docs.openclaw.ai/install/macos-vm

Installs the Lume CLI tool and adds it to the user's PATH.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/trycua/cua/main/libs/lume/scripts/install.sh)"
```

```bash
echo 'export PATH="$PATH:$HOME/.local/bin"' >> ~/.zshrc && source ~/.zshrc
```

```bash
lume --version
```

--------------------------------

### Basic Provider Test Setup

Source: https://docs.openclaw.ai/plugins/sdk-provider-plugins

This snippet shows the basic setup for testing a provider using vitest. Ensure your provider configuration is exported correctly.

```typescript
import { describe, it, expect } from "vitest";
// Export your provider config object from index.ts or a dedicated file
import { acmeProvider } from "./provider.js";

describe("acme-ai provider", () => {
```

--------------------------------

### Start Openclaw Service

Source: https://docs.openclaw.ai/install/podman

Use this command to start the Openclaw service managed by Systemd.

```bash
systemctl --user start openclaw.service
```

--------------------------------

### Start a Node Host

Source: https://docs.openclaw.ai/nodes

Run this command on the node machine to connect to a gateway host and register as a node host.

```bash
openclaw node run --host <gateway-host> --port 18789 --display-name "Build Node"
```

--------------------------------

### Install Twitch Plugin via CLI

Source: https://docs.openclaw.ai/channels/twitch

Use this command to install the Twitch plugin from the npm registry using the OpenClaw CLI. Ensure you have the CLI installed and configured.

```bash
openclaw plugins install @openclaw/twitch
```

--------------------------------

### Install a Skill

Source: https://docs.openclaw.ai/cli/skills

Installs a skill from ClawHub into the active workspace's `skills/` directory. The --force flag overwrites an existing skill folder for the same slug. A specific version can also be installed.

```bash
openclaw skills install <slug>
```

```bash
openclaw skills install <slug> --version <version>
```

```bash
openclaw skills install <slug> --force
```

--------------------------------

### Install OpenClaw from GitHub Main

Source: https://docs.openclaw.ai/install

Installs OpenClaw directly from the main branch of the GitHub repository using npm.

```bash
npm install -g github:openclaw/openclaw#main
```

--------------------------------

### Tail Gateway Logs with CLI

Source: https://docs.openclaw.ai/cli/logs

Various command-line examples for tailing logs, including following streams, setting limits, and configuring output formats.

```bash
openclaw logs
openclaw logs --follow
openclaw logs --follow --interval 2000
openclaw logs --limit 500 --max-bytes 500000
openclaw logs --json
openclaw logs --plain
openclaw logs --no-color
openclaw logs --limit 500
openclaw logs --local-time
openclaw logs --follow --local-time
openclaw logs --url ws://127.0.0.1:18789 --token "$OPENCLAW_GATEWAY_TOKEN"
```

--------------------------------

### Install Docker on VM

Source: https://docs.openclaw.ai/install/gcp

Installs Docker and adds the current user to the docker group to avoid sudo requirements.

```bash
sudo apt-get update
sudo apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

--------------------------------

### Load and verify skills

Source: https://docs.openclaw.ai/tools/creating-skills

Restart the session or gateway to load new skills, then verify the installation.

```bash
# From chat
/new

# Or restart the gateway
openclaw gateway restart
```

```bash
openclaw skills list
```

--------------------------------

### Onboard with Cloudflare AI Gateway

Source: https://docs.openclaw.ai/providers/cloudflare-ai-gateway

Use this command to set up the Cloudflare AI Gateway provider and API key during onboarding. This is the interactive setup.

```bash
openclaw onboard --auth-choice cloudflare-ai-gateway-api-key
```

--------------------------------

### Reset CLI Configuration Examples

Source: https://docs.openclaw.ai/cli/reset

Examples of resetting local state with various scopes and flags. Run openclaw backup create first to ensure data can be restored.

```bash
openclaw backup create
openclaw reset
openclaw reset --dry-run
openclaw reset --scope config --yes --non-interactive
openclaw reset --scope config+creds+sessions --yes --non-interactive
openclaw reset --scope full --yes --non-interactive
```

--------------------------------

### Install a Community Plugin

Source: https://docs.openclaw.ai/plugins/community

Use this command to install any community plugin from ClawHub or npm. Replace `<package-name>` with the actual name of the plugin.

```bash
openclaw plugins install <package-name>
```

--------------------------------

### Inspect Context Detail Output

Source: https://docs.openclaw.ai/concepts/context

Example output from the /context detail command showing a breakdown of top skills and tools by size.

```text
🧠 Context breakdown (detailed)
…
Top skills (prompt entry size):
- frontend-design: 412 chars (~103 tok)
- oracle: 401 chars (~101 tok)
… (+10 more skills)

Top tools (schema size):
- browser: 9,812 chars (~2,453 tok)
- exec: 6,240 chars (~1,560 tok)
… (+N more tools)
```

--------------------------------

### Explain Sandbox Configuration

Source: https://docs.openclaw.ai/cli/sandbox

Inspect effective sandbox modes, tool policies, and elevated gates.

```bash
openclaw sandbox explain
openclaw sandbox explain --session agent:main:main
openclaw sandbox explain --agent work
openclaw sandbox explain --json
```

--------------------------------

### Install Voice Call Plugin from Local Folder

Source: https://docs.openclaw.ai/plugins/voice-call

Install the Voice Call plugin from a local directory for development purposes. This method avoids copying files. Remember to install dependencies and restart the Gateway.

```bash
PLUGIN_SRC=./path/to/local/voice-call-plugin
openclaw plugins install "$PLUGIN_SRC"
cd "$PLUGIN_SRC" && pnpm install
```

--------------------------------

### Run OpenClaw Onboarding with Synthetic API Key

Source: https://docs.openclaw.ai/providers/synthetic

Use this command to initiate the onboarding process for the Synthetic provider when using an API key. It sets up the necessary authentication.

```bash
openclaw onboard --auth-choice synthetic-api-key
```

--------------------------------

### Build the Docker image

Source: https://docs.openclaw.ai/install/docker

Build the gateway image locally using the setup script, or optionally use a pre-built image from the GitHub Container Registry.

```bash
./scripts/docker/setup.sh
```

```bash
export OPENCLAW_IMAGE="ghcr.io/openclaw/openclaw:latest"
./scripts/docker/setup.sh
```

--------------------------------

### Install ClawDock Helpers

Source: https://docs.openclaw.ai/install/clawdock

Installs the ClawDock helper script to your local machine and sources it into your shell configuration. Ensure you are using the correct canonical helper path.

```bash
mkdir -p ~/.clawdock && curl -sL https://raw.githubusercontent.com/openclaw/openclaw/main/scripts/clawdock/clawdock-helpers.sh -o ~/.clawdock/clawdock-helpers.sh
echo 'source ~/.clawdock/clawdock-helpers.sh' >> ~/.zshrc && source ~/.zshrc
```

--------------------------------

### Onboard Qwen Provider via CLI

Source: https://docs.openclaw.ai/providers/qwen

Use these commands to authenticate with specific Qwen endpoints. Choose the command corresponding to your plan and region.

```bash
# Global Coding Plan endpoint
openclaw onboard --auth-choice qwen-api-key

# China Coding Plan endpoint
openclaw onboard --auth-choice qwen-api-key-cn

# Global Standard (pay-as-you-go) endpoint
openclaw onboard --auth-choice qwen-standard-api-key

# China Standard (pay-as-you-go) endpoint
openclaw onboard --auth-choice qwen-standard-api-key-cn
```

--------------------------------

### Configure LINE Channel

Source: https://docs.openclaw.ai/channels/line

Configuration examples for setting up the LINE channel, including minimal settings, file-based credentials, and multi-account support.

```json5
{
  channels: {
    line: {
      enabled: true,
      channelAccessToken: "LINE_CHANNEL_ACCESS_TOKEN",
      channelSecret: "LINE_CHANNEL_SECRET",
      dmPolicy: "pairing",
    },
  },
}
```

```json5
{
  channels: {
    line: {
      tokenFile: "/path/to/line-token.txt",
      secretFile: "/path/to/line-secret.txt",
    },
  },
}
```

```json5
{
  channels: {
    line: {
      accounts: {
        marketing: {
          channelAccessToken: "...",
          channelSecret: "...",
          webhookPath: "/line/marketing",
        },
      },
    },
  },
}
```

--------------------------------

### Install and Build OpenClaw CLI

Source: https://docs.openclaw.ai/platforms/mac/remote

Commands to install dependencies and link the OpenClaw CLI globally on the remote host.

```bash
pnpm install && pnpm build && pnpm link --global
```

--------------------------------

### Playwright Installation for Docker

Source: https://docs.openclaw.ai/tools/browser

Instructions for installing Playwright within a Dockerized OpenClaw Gateway.

```APIDOC
## Docker Playwright Install

If your Gateway runs in Docker, use the bundled CLI to install Playwright:

```bash
docker compose run --rm openclaw-cli \
  node /app/node_modules/playwright-core/cli.js install chromium
```

To persist browser downloads, set `PLAYWRIGHT_BROWSERS_PATH` (e.g., `/home/node/.cache/ms-playwright`) and ensure `/home/node` is persisted via `OPENCLAW_HOME_VOLUME` or a bind mount.
```

--------------------------------

### Start and Open Browser via CLI

Source: https://docs.openclaw.ai/tools/browser-login

Use these commands to start the OpenClaw browser or open a specific URL. Specify a browser profile name if you have multiple.

```bash
openclaw browser start
openclaw browser open https://x.com
```

--------------------------------

### Run install.sh for macOS/Linux/WSL

Source: https://docs.openclaw.ai/install/installer

Executes the standard installation script for OpenClaw on Unix-based systems.

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash
```

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --help
```

--------------------------------

### Start the Gateway

Source: https://docs.openclaw.ai/platforms/android

Commands to initialize the Gateway for local or remote Android access.

```bash
openclaw gateway --port 18789 --verbose
```

```bash
openclaw gateway --tailscale serve
```

--------------------------------

### Install claude-max-api-proxy

Source: https://docs.openclaw.ai/providers/claude-max-api-proxy

Requires Node.js 20+ and Claude Code CLI. Verify Claude CLI is authenticated after installation.

```bash
# Requires Node.js 20+ and Claude Code CLI
npm install -g claude-max-api-proxy

# Verify Claude CLI is authenticated
claude --version
```

--------------------------------

### Verify installation

Source: https://docs.openclaw.ai/install/oracle

Check the status of the OpenClaw service and Tailscale connectivity.

```bash
openclaw --version
systemctl --user status openclaw-gateway.service
tailscale serve status
curl http://localhost:18789
```

--------------------------------

### Install and Update Plugins via CLI

Source: https://docs.openclaw.ai/gateway/security

Use these commands to install or update plugins. Treat these operations as if running untrusted code, as npm lifecycle scripts can execute code during installation. Prefer pinned versions and inspect unpacked code.

```bash
openclaw plugins install <package>
```

```bash
openclaw plugins update <id>
```

--------------------------------

### Install Zalo plugin via CLI

Source: https://docs.openclaw.ai/channels/zalo

Commands to install the Zalo plugin manually if it is not included in the current build.

```bash
openclaw plugins install @openclaw/zalo
```

```bash
openclaw plugins install ./path/to/local/zalo-plugin
```

--------------------------------

### Install Homebrew on Linux

Source: https://docs.openclaw.ai/help/faq

Use this script to install Homebrew on a Linux system. Ensure the PATH is updated for systemd services.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
brew install <formula>
```

--------------------------------

### Install OpenClaw via Shell

Source: https://docs.openclaw.ai/start/getting-started

Use these commands to install OpenClaw on macOS, Linux, or Windows.

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

--------------------------------

### Install Nextcloud Talk Plugin from Local Checkout

Source: https://docs.openclaw.ai/channels/nextcloud-talk

Install the Nextcloud Talk plugin by providing a local path to the plugin's directory. This is useful when running from a git repository.

```bash
openclaw plugins install ./path/to/local/nextcloud-talk-plugin
```

--------------------------------

### dns setup

Source: https://docs.openclaw.ai/cli

Configures Wide-area discovery DNS helpers using CoreDNS and Tailscale.

```APIDOC
## `dns setup`

### Description
Sets up Wide-area discovery DNS helpers (CoreDNS + Tailscale).

### Method
`setup`

### Endpoint
`dns setup`

### Parameters
#### Path Parameters
None

#### Query Parameters
- **--domain** (string) - Optional - The domain name for DNS configuration.
- **--apply** (boolean) - Optional - Installs/updates CoreDNS config (requires sudo; macOS only).

### Request Example
```bash
openclaw dns setup --domain example.com --apply
```

### Response
Prints the recommended OpenClaw + Tailscale DNS config. If `--apply` is used, it installs/updates the CoreDNS config.
```

--------------------------------

### Install signal-cli on Linux

Source: https://docs.openclaw.ai/channels/signal

Installs the latest version of signal-cli from GitHub releases. Ensure you have curl and tar installed. This script fetches the latest release, extracts it to /opt, and creates a symbolic link for easy access.

```bash
VERSION=$(curl -Ls -o /dev/null -w %{url_effective} https://github.com/AsamK/signal-cli/releases/latest | sed -e 's/^.*\/v//')
curl -L -O "https://github.com/AsamK/signal-cli/releases/download/v${VERSION}/signal-cli-${VERSION}-Linux-native.tar.gz"
sudo tar xf "signal-cli-${VERSION}-Linux-native.tar.gz" -C /opt
sudo ln -sf /opt/signal-cli /usr/local/bin/
signal-cli --version
```

--------------------------------

### Install Microsoft Teams Plugin

Source: https://docs.openclaw.ai/channels/msteams

Install the Microsoft Teams plugin for OpenClaw. Use this command for packaged builds or custom installs that exclude bundled Teams.

```bash
openclaw plugins install @openclaw/msteams
```

--------------------------------

### Interactive Deepseek Onboarding

Source: https://docs.openclaw.ai/providers/deepseek

Use this command to interactively set up your Deepseek API key. It will prompt for your key and set the default model.

```bash
openclaw onboard --auth-choice deepseek-api-key
```

--------------------------------

### CLI Setup for Kilo Gateway

Source: https://docs.openclaw.ai/providers/kilocode

Use this command to onboard with Kilo Gateway using your API key. Alternatively, set the KILOCODE_API_KEY environment variable.

```bash
openclaw onboard --auth-choice kilocode-api-key
```

```bash
export KILOCODE_API_KEY="<your-kilocode-api-key>" # pragma: allowlist secret
```

--------------------------------

### Run install-cli.sh for local prefix installation

Source: https://docs.openclaw.ai/install/installer

Installs OpenClaw into a local prefix (~/.openclaw) without requiring root privileges.

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash
```

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash -s -- --help
```

--------------------------------

### Start background process

Source: https://docs.openclaw.ai/gateway/background-process

Executes a command immediately in the background.

```json
{ "tool": "exec", "command": "npm run build", "background": true }
```

--------------------------------

### Configure vLLM API Key

Source: https://docs.openclaw.ai/concepts/model-providers

Environment variable setup for local vLLM auto-discovery.

```bash
export VLLM_API_KEY="vllm-local"
```

--------------------------------

### Interactive Vydra API Key Onboarding

Source: https://docs.openclaw.ai/providers/vydra

Use this command for interactive onboarding to set up your Vydra API key.

```bash
openclaw onboard --auth-choice vydra-api-key
```

--------------------------------

### Troubleshooting sharp build errors with npm

Source: https://docs.openclaw.ai/install

Use this command when `sharp` fails due to a globally installed libvips. It ignores the global libvips during installation.

```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

--------------------------------

### Start inferrs server

Source: https://docs.openclaw.ai/providers/inferrs

Launch the inferrs server with a specific model, host, port, and device.

```bash
inferrs serve google/gemma-4-E2B-it \
  --host 127.0.0.1 \
  --port 8080 \
  --device metal
```

--------------------------------

### Setting up Ollama for Local Models

Source: https://docs.openclaw.ai/help/faq

Follow these steps to install Ollama, pull a local model, and onboard it with OpenClaw for local model usage.

```bash
https://ollama.com/download
```

```bash
ollama pull gemma4
```

```bash
ollama signin
```

```bash
openclaw onboard
```

--------------------------------

### Onboard Alibaba Provider with API Key

Source: https://docs.openclaw.ai/providers/alibaba

Use this command to set up the Alibaba provider by choosing an authentication method. It configures OpenClaw to use the Qwen standard API key for authentication.

```bash
openclaw onboard --auth-choice qwen-standard-api-key
```

--------------------------------

### Markdown Input Example

Source: https://docs.openclaw.ai/concepts/markdown-formatting

Example of raw Markdown input used for IR conversion.

```markdown
Hello **world** — see [docs](https://docs.openclaw.ai).
```

--------------------------------

### Test Manual OpenClaw Gateway Start

Source: https://docs.openclaw.ai/install/ansible

Manually starts the OpenClaw gateway as the 'openclaw' user to test service functionality.

```bash
# Test manual start
sudo -i -u openclaw
cd ~/openclaw
openclaw gateway run
```

--------------------------------

### Install OpenClaw Plugins

Source: https://docs.openclaw.ai/tools/plugin

Commands for installing plugins from various sources like ClawHub, npm, local paths, or marketplaces. Options control overwriting and linking.

```bash
openclaw plugins install <package>         # install (ClawHub first, then npm)
```

```bash
openclaw plugins install clawhub:<pkg>     # install from ClawHub only
```

```bash
openclaw plugins install <spec> --force    # overwrite existing install
```

```bash
openclaw plugins install <path>            # install from local path
```

```bash
openclaw plugins install -l <path>         # link (no copy) for dev
```

```bash
openclaw plugins install <plugin> --marketplace <source>
```

```bash
openclaw plugins install <plugin> --marketplace https://github.com/<owner>/<repo>
```

```bash
openclaw plugins install <spec> --pin      # record exact resolved npm spec
```

```bash
openclaw plugins install <spec> --dangerously-force-unsafe-install
```

--------------------------------

### Manage Browser via CLI

Source: https://docs.openclaw.ai/tools/browser

Use these commands to check status, start the browser, navigate to URLs, or take snapshots.

```bash
openclaw browser --browser-profile openclaw status
openclaw browser --browser-profile openclaw start
openclaw browser --browser-profile openclaw open https://example.com
openclaw browser --browser-profile openclaw snapshot
```

--------------------------------

### Configure Delayed Channel Load with setupEntry

Source: https://docs.openclaw.ai/plugins/architecture

Set 'openclaw.startup.deferConfiguredChannelFullLoadUntilAfterListen' to true to use 'setupEntry' during the gateway's pre-listen phase. This is useful when 'setupEntry' provides all necessary startup capabilities.

```json
{
  "name": "@scope/my-channel",
  "openclaw": {
    "extensions": ["./index.ts"],
    "setupEntry": "./setup-entry.ts",
    "startup": {
      "deferConfiguredChannelFullLoadUntilAfterListen": true
    }
  }
}
```

--------------------------------

### Install Mattermost Plugin

Source: https://docs.openclaw.ai/channels/mattermost

Commands to install the Mattermost plugin via the npm registry or from a local git repository.

```bash
openclaw plugins install @openclaw/mattermost
```

```bash
openclaw plugins install ./path/to/local/mattermost-plugin
```

--------------------------------

### Start Gateway and Approve Pairing

Source: https://docs.openclaw.ai/channels/imessage

Commands to start the gateway and manage iMessage pairing requests.

```bash
openclaw gateway
```

```bash
openclaw pairing list imessage
openclaw pairing approve imessage <CODE>
```

--------------------------------

### Non-interactive Git Install (install.sh)

Source: https://docs.openclaw.ai/install/installer

Installs OpenClaw non-interactively using the install.sh script with the Git method. Sets environment variables for installation method and to disable prompts.

```bash
OPENCLAW_INSTALL_METHOD=git OPENCLAW_NO_PROMPT=1 \
  curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash
```

--------------------------------

### Onboard Hugging Face Provider

Source: https://docs.openclaw.ai/providers/huggingface

Run the interactive onboarding command to configure the Hugging Face provider.

```bash
openclaw onboard --auth-choice huggingface-api-key
```

--------------------------------

### Setup Gmail Webhooks with OpenClaw CLI

Source: https://docs.openclaw.ai/automation/cron-jobs

This command initiates the setup wizard for Gmail webhooks, configuring OpenClaw to receive triggers from your Gmail account. It automatically writes necessary configuration and sets up Tailscale Funnel for the push endpoint.

```bash
openclaw webhooks gmail setup --account openclaw@gmail.com
```

--------------------------------

### Install a Skill with OpenClaw

Source: https://docs.openclaw.ai/tools/skills

Use this command to install a specific skill into your active workspace. The skill will be placed in the `skills/` directory.

```bash
openclaw skills install <skill-slug>
```

--------------------------------

### Install OpenClaw Plugins via CLI

Source: https://docs.openclaw.ai/cli/plugins

Standard commands for installing plugins from various sources including ClawHub, npm, and local paths.

```bash
openclaw plugins install <package>                      # ClawHub first, then npm
openclaw plugins install clawhub:<package>              # ClawHub only
openclaw plugins install <package> --force              # overwrite existing install
openclaw plugins install <package> --pin                # pin version
openclaw plugins install <package> --dangerously-force-unsafe-install
openclaw plugins install <path>                         # local path
openclaw plugins install <plugin>@<marketplace>         # marketplace
openclaw plugins install <plugin> --marketplace <name>  # marketplace (explicit)
openclaw plugins install <plugin> --marketplace https://github.com/<owner>/<repo>
```

--------------------------------

### Gateway Management

Source: https://docs.openclaw.ai/gateway/health

Start the gateway manually if it is unreachable.

```bash
openclaw gateway --port 18789
```

--------------------------------

### Deploy and verify application

Source: https://docs.openclaw.ai/install/fly

Executes the deployment process and checks the status of the running instance.

```bash
fly deploy
```

```bash
fly status
fly logs
```

--------------------------------

### Install OpenClaw without Onboarding (macOS/Linux/WSL2)

Source: https://docs.openclaw.ai/install

Installs OpenClaw on macOS, Linux, or WSL2 without launching the onboarding process.

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

--------------------------------

### Minimal remote setup configuration

Source: https://docs.openclaw.ai/gateway/openshell

Configures OpenShell in remote mode with a default sandbox backend.

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "all",
        backend: "openshell",
      },
    },
  },
  plugins: {
    entries: {
      openshell: {
        enabled: true,
        config: {
          from: "openclaw",
          mode: "remote",
        },
      },
    },
  },
}
```

--------------------------------

### Non-interactive Onboarding with Cloudflare AI Gateway

Source: https://docs.openclaw.ai/providers/cloudflare-ai-gateway

Perform a non-interactive setup for Cloudflare AI Gateway, providing all necessary details as command-line arguments. This is useful for automated deployments.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice cloudflare-ai-gateway-api-key \
  --cloudflare-ai-gateway-account-id "your-account-id" \
  --cloudflare-ai-gateway-gateway-id "your-gateway-id" \
  --cloudflare-ai-gateway-api-key "$CLOUDFLARE_AI_GATEWAY_API_KEY"
```

--------------------------------

### Minimal Matrix Setup with Access Token

Source: https://docs.openclaw.ai/channels/matrix

This configuration enables the Matrix channel using an access token for authentication. Ensure `homeserver` and `accessToken` are correctly set.

```json5
{
  channels: {
    matrix: {
      enabled: true,
      homeserver: "https://matrix.example.org",
      accessToken: "syt_xxx",
      dm: { policy: "pairing" },
    },
  },
}
```

--------------------------------

### Configure Agent Skills

Source: https://docs.openclaw.ai/gateway/configuration-reference

Sets up skill loading paths, installation preferences, and individual skill configurations.

```json5
{
  skills: {
    allowBundled: ["gemini", "peekaboo"],
    load: {
      extraDirs: ["~/Projects/agent-scripts/skills"],
    },
    install: {
      preferBrew: true,
      nodeManager: "npm", // npm | pnpm | yarn | bun
    },
    entries: {
      "image-lab": {
        apiKey: { source: "env", provider: "default", id: "GEMINI_API_KEY" }, // or plaintext string
        env: { GEMINI_API_KEY: "GEMINI_KEY_HERE" },
      },
      peekaboo: { enabled: true },
      sag: { enabled: false },
    },
  },
}
```

--------------------------------

### Shelley Automated Installation Prompt

Source: https://docs.openclaw.ai/install/exe-dev

Prompt used by the Shelley agent to perform a non-interactive OpenClaw installation.

```text
Set up OpenClaw (https://docs.openclaw.ai/install) on this VM. Use the non-interactive and accept-risk flags for openclaw onboarding. Add the supplied auth or token as needed. Configure nginx to forward from the default port 18789 to the root location on the default enabled site config, making sure to enable Websocket support. Pairing is done by "openclaw devices list" and "openclaw devices approve <request id>". Make sure the dashboard shows that OpenClaw's health is OK. exe.dev handles forwarding from port 8000 to port 80/443 and HTTPS for us, so the final "reachable" should be <vm-name>.exe.xyz, without port specification.
```

--------------------------------

### Start OpenClaw Gateway

Source: https://docs.openclaw.ai/channels/feishu

Start the OpenClaw gateway service. This command is necessary for the bot to function and receive events.

```bash
openclaw gateway
```

--------------------------------

### Example verbose flow

Source: https://docs.openclaw.ai/concepts/active-memory

Demonstrates the expected interaction flow and output when verbose mode is enabled.

```text
/verbose on
what wings should i order?
```

```text
...normal assistant reply...

🧩 Active Memory: ok 842ms recent 34 chars
🔎 Active Memory Debug: Lemon pepper wings with blue cheese.
```

--------------------------------

### Debug Trace Installation (PowerShell)

Source: https://docs.openclaw.ai/install/installer

Enables PowerShell debug tracing for the OpenClaw installation script. Note that install.ps1 does not have a dedicated -Verbose flag yet. This helps in debugging installation issues.

```powershell
# install.ps1 has no dedicated -Verbose flag yet.
Set-PSDebug -Trace 1
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -NoOnboard
Set-PSDebug -Trace 0
```

--------------------------------

### Install Feishu Plugin

Source: https://docs.openclaw.ai/channels/feishu

Use this command to manually install the Feishu plugin if it is not included in your current OpenClaw build.

```bash
openclaw plugins install @openclaw/feishu
```

--------------------------------

### Invoke Music Generation Tool

Source: https://docs.openclaw.ai/providers/comfy

Example command to trigger the music generation tool using a prompt string.

```text
/tool music_generate prompt="Warm ambient synth loop with soft tape texture"
```

--------------------------------

### Simple .prose File Example

Source: https://docs.openclaw.ai/prose

An example of a basic `.prose` file that demonstrates multi-agent research and synthesis with parallel execution. It defines two agents, 'researcher' and 'writer', and runs them in parallel to gather findings and draft a summary.

```prose
# Research + synthesis with two agents running in parallel.

input topic: "What should we research?"

agent researcher:
  model: sonnet
  prompt: "You research thoroughly and cite sources."

agent writer:
  model: opus
  prompt: "You write a concise summary."

parallel:
  findings = session: researcher
    prompt: "Research {topic}."
  draft = session: writer
    prompt: "Summarize {topic}."

session "Merge the findings + draft into a final answer."
context: { findings, draft }
```

--------------------------------

### Update installed skills

Source: https://docs.openclaw.ai/tools/clawhub

Update all locally installed skills to their latest versions.

```bash
clawhub update --all
```

--------------------------------

### Install Google Chrome on Linux

Source: https://docs.openclaw.ai/tools/browser-linux-troubleshooting

Use these commands to download and install the official Google Chrome package, which avoids snap's AppArmor issues. Ensure dependencies are fixed if necessary.

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt --fix-broken install -y  # if there are dependency errors
```

--------------------------------

### Onboard to OpenRouter CLI

Source: https://docs.openclaw.ai/providers/openrouter

Use this command to onboard with OpenRouter using an API key. This sets up the necessary configuration for using OpenRouter as your LLM provider.

```bash
openclaw onboard --auth-choice openrouter-api-key
```

--------------------------------

### Install and Restart Openclaw Node Service

Source: https://docs.openclaw.ai/nodes

Install the Openclaw node service by specifying the gateway host and port, then restart the service. This is used for setting up a node host.

```bash
openclaw node install --host <gateway-host> --port 18789 --display-name "Build Node"
openclaw node restart
```

--------------------------------

### Install Synology Chat Plugin Locally

Source: https://docs.openclaw.ai/channels/synology-chat

Use this command to install the Synology Chat plugin from a local checkout if it's not bundled with your OpenClaw release.

```bash
openclaw plugins install ./path/to/local/synology-chat-plugin
```

--------------------------------

### Install OpenClaw CLI via shell script

Source: https://docs.openclaw.ai/install/installer

Various methods to invoke the installation script with different configuration flags.

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash
```

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash -s -- --prefix /opt/openclaw --version latest
```

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash -s -- --install-method git --git-dir ~/openclaw
```

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash -s -- --json --prefix /opt/openclaw
```

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash -s -- --onboard
```

--------------------------------

### Quadlet-managed Podman Setup

Source: https://docs.openclaw.ai/install/podman

Use this flag to set up the OpenClaw Gateway for management by systemd user services via Quadlet. This is a Linux-only option.

```bash
./scripts/podman/setup.sh --quadlet
```

--------------------------------

### ClawDock Setup and Maintenance

Source: https://docs.openclaw.ai/install/clawdock

Commands for configuring the gateway token, updating the Docker image, rebuilding, and cleaning up containers and volumes.

```bash
clawdock-fix-token
```

```bash
clawdock-update
```

```bash
clawdock-rebuild
```

```bash
clawdock-clean
```

--------------------------------

### Automate Onboarding with Non-Interactive Mode

Source: https://docs.openclaw.ai/reference/wizard

Use the --non-interactive flag for automated or scripted onboarding. Add --json for a machine-readable summary. This example configures local mode, API key authentication, and skips skills.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice apiKey \
  --anthropic-api-key "$ANTHROPIC_API_KEY" \
  --gateway-port 18789 \
  --gateway-bind loopback \
  --install-daemon \
  --daemon-runtime node \
  --skip-skills
```

--------------------------------

### List Plugins

Source: https://docs.openclaw.ai/cli/plugins

Display installed plugins with optional filtering and formatting flags.

```bash
openclaw plugins list
openclaw plugins list --enabled
openclaw plugins list --verbose
openclaw plugins list --json
```

--------------------------------

### Install Twitch Plugin from Local Checkout

Source: https://docs.openclaw.ai/channels/twitch

Install the Twitch plugin by providing a local path to the plugin's directory. This is useful when working with a git checkout of the plugin.

```bash
openclaw plugins install ./path/to/local/twitch-plugin
```

--------------------------------

### Update System and Dependencies

Source: https://docs.openclaw.ai/install/raspberry-pi

Update the OS packages and install essential build tools and utilities.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl build-essential

# Set timezone (important for cron and reminders)
sudo timedatectl set-timezone America/Chicago
```

--------------------------------

### OpenClaw Configuration Example

Source: https://docs.openclaw.ai/

Example JSON configuration for OpenClaw. This configuration specifies rules for WhatsApp channel access, including allowed senders and mention requirements for group chats.

```json
{
  channels: {
    whatsapp: {
      allowFrom: ["+15555550123"],
      groups: { "*": { requireMention: true } },
    },
  },
  messages: { groupChat: { mentionPatterns: ["@openclaw"] } },
}

```

--------------------------------

### Install OpenClaw Gateway Service (CLI)

Source: https://docs.openclaw.ai/platforms/linux

Use these CLI commands to install the OpenClaw Gateway service. Select 'Gateway service' when prompted. 'openclaw doctor' can be used for repair or migration.

```bash
openclaw onboard --install-daemon
```

```bash
openclaw gateway install
```

```bash
openclaw configure
```

```bash
openclaw doctor
```

--------------------------------

### Search documentation via CLI

Source: https://docs.openclaw.ai/cli/docs

Execute search queries against the live documentation index. Running without arguments opens the search entrypoint.

```bash
openclaw docs
openclaw docs browser existing-session
openclaw docs sandbox allowHostControl
openclaw docs gateway token secretref
```

--------------------------------

### Install OpenClaw from Git Checkout

Source: https://docs.openclaw.ai/help/faq

Installs OpenClaw from a git checkout, allowing the AI agent to read the code and docs. This method enables the agent to reason about the exact version being run. To revert to a stable version, re-run the installer without the --install-method git flag.

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --install-method git
```

--------------------------------

### Automate onboarding with baseline configuration

Source: https://docs.openclaw.ai/start/wizard-cli-automation

Use this command for automated local onboarding with plaintext API keys. Ensure the ANTHROPIC_API_KEY environment variable is set before execution.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice apiKey \
  --anthropic-api-key "$ANTHROPIC_API_KEY" \
  --secret-input-mode plaintext \
  --gateway-port 18789 \
  --gateway-bind loopback \
  --install-daemon \
  --daemon-runtime node \
  --skip-skills
```

--------------------------------

### Message Envelope Examples

Source: https://docs.openclaw.ai/date-time

Visual examples of message envelope formatting with different timezone and elapsed time configurations.

```text
[Provider ... 2026-01-05 16:26 PST] message text
```

```text
[WhatsApp +1555 2026-01-18 00:19 PST] hello
```

```text
[WhatsApp +1555 2026-01-18 00:19 CST] hello
```

```text
[WhatsApp +1555 +30s 2026-01-18T05:19Z] follow-up
```

--------------------------------

### Install OpenClaw (GitHub Main Tag PowerShell)

Source: https://docs.openclaw.ai/install/installer

Installs OpenClaw from the 'main' tag on GitHub using npm via PowerShell. This is useful for testing the latest development branch.

```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -Tag main
```

--------------------------------

### Complete Broadcast Configuration

Source: https://docs.openclaw.ai/channels/broadcast-groups

A full example showing agent definitions and multiple broadcast group mappings.

```json
{
  "agents": {
    "list": [
      {
        "id": "code-reviewer",
        "name": "Code Reviewer",
        "workspace": "/path/to/code-reviewer",
        "sandbox": { "mode": "all" }
      },
      {
        "id": "security-auditor",
        "name": "Security Auditor",
        "workspace": "/path/to/security-auditor",
        "sandbox": { "mode": "all" }
      },
      {
        "id": "docs-generator",
        "name": "Documentation Generator",
        "workspace": "/path/to/docs-generator",
        "sandbox": { "mode": "all" }
      }
    ]
  },
  "broadcast": {
    "strategy": "parallel",
    "120363403215116621@g.us": ["code-reviewer", "security-auditor", "docs-generator"],
    "120363424282127706@g.us": ["support-en", "support-de"],
    "+15555550123": ["assistant", "logger"]
  }
}
```

--------------------------------

### Switching OpenClaw Installation Methods

Source: https://docs.openclaw.ai/help/faq

Commands to migrate between npm and git installation flavors. Always run the doctor command after switching to update the gateway service entrypoint.

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm build
openclaw doctor
openclaw gateway restart
```

```bash
npm install -g openclaw@latest
openclaw doctor
openclaw gateway restart
```

--------------------------------

### Install Openclaw AI (GitHub Main via npm)

Source: https://docs.openclaw.ai/install/installer

Install the 'main' version of Openclaw AI from GitHub using npm. This allows you to test the latest development branch.

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --version main
```

--------------------------------

### Install and Manage Gateway Service (Linux systemd user)

Source: https://docs.openclaw.ai/gateway

Commands to install and manage the OpenClaw gateway as a systemd user service on Linux. Use `systemctl --user enable --now` for automatic startup and persistence. Enabling linger is recommended for persistence after logout.

```bash
openclaw gateway install
```

```bash
systemctl --user enable --now openclaw-gateway[-<profile>].service
```

```bash
openclaw gateway status
```

```bash
sudo loginctl enable-linger <user>
```

--------------------------------

### Example Broadcast Group Configuration

Source: https://docs.openclaw.ai/channels/channel-routing

Configure broadcast groups to run multiple agents for the same peer. This example shows parallel execution for specific WhatsApp group IDs and phone numbers.

```json5
{
  broadcast: {
    strategy: "parallel",
    "120363403215116621@g.us": ["alfred", "baerbel"],
    "+15555550123": ["support", "logger"],
  },
}
```

--------------------------------

### Plugin Entry Point

Source: https://docs.openclaw.ai/tools/plugin

Example of a native plugin's entry object, exporting the `register` function.

```APIDOC
## Plugin API Overview

Native plugins export an entry object that exposes `register(api)`. Older plugins may still use `activate(api)` as a legacy alias, but new plugins should use `register`.

OpenClaw loads the entry object and calls `register(api)` during plugin activation. The loader still falls back to `activate(api)` for older plugins, but bundled plugins and new external plugins should treat `register` as the public contract.

### Plugin Entry Object Example

```typescript
export default definePluginEntry({
  id: "my-plugin",
  name: "My Plugin",
  register(api) {
    api.registerProvider({
      /* ... */
    });
    api.registerTool({
      /* ... */
    });
    api.registerChannel({
      /* ... */
    });
  },
});
```
```

--------------------------------

### Verify bundle detection

Source: https://docs.openclaw.ai/plugins/bundles

Commands to list installed plugins and inspect specific bundle details.

```bash
openclaw plugins list
openclaw plugins inspect <id>
```

--------------------------------

### Install and Manage Gateway Service (macOS)

Source: https://docs.openclaw.ai/gateway

Commands to install, check status, restart, and stop the OpenClaw gateway service on macOS using launchd. LaunchAgent labels are typically `ai.openclaw.gateway` or `ai.openclaw.<profile>`.

```bash
openclaw gateway install
```

```bash
openclaw gateway status
```

```bash
openclaw gateway restart
```

```bash
openclaw gateway stop
```

--------------------------------

### Structured Patch Format Example

Source: https://docs.openclaw.ai/tools/apply-patch

This example shows the expected format for the input string when using the apply_patch tool. It includes adding, updating, and deleting files, with specific line changes indicated.

```plaintext
*** Begin Patch
*** Add File: path/to/file.txt
+line 1
+line 2
*** Update File: src/app.ts
@@
-old line
+new line
*** Delete File: obsolete.txt
*** End Patch
```

--------------------------------

### Create macOS VM

Source: https://docs.openclaw.ai/install/macos-vm

Downloads the latest macOS IPSW and initializes the virtual machine.

```bash
lume create openclaw --os macos --ipsw latest
```

--------------------------------

### Brave Search API Configuration Example

Source: https://docs.openclaw.ai/tools/brave-search

Configure Brave Search as a web search provider. Set the API key and choose between 'web' or 'llm-context' modes. Legacy 'tools.web.search.apiKey' is supported but not canonical.

```json5
{
  plugins: {
    entries: {
      brave: {
        config: {
          webSearch: {
            apiKey: "BRAVE_API_KEY_HERE",
            mode: "web", // or "llm-context"
          },
        },
      },
    },
  },
  tools: {
    web: {
      search: {
        provider: "brave",
        maxResults: 5,
        timeoutSeconds: 30,
      },
    },
  },
}
```

--------------------------------

### Verify OpenClaw CLI Installation

Source: https://docs.openclaw.ai/install

Run these commands to confirm the OpenClaw CLI is installed and check for configuration issues or gateway status.

```bash
openclaw --version      # confirm the CLI is available
openclaw doctor         # check for config issues
openclaw gateway status # verify the Gateway is running
```

--------------------------------

### Example Agent and Binding Configuration

Source: https://docs.openclaw.ai/channels/channel-routing

Define agent lists and bindings to map inbound channels and peers to specific agents. This configuration sets up a 'support' agent and binds Slack and Telegram channels to it.

```json5
{
  agents: {
    list: [{ id: "support", name: "Support", workspace: "~/.openclaw/workspace-support" }],
  },
  bindings: [
    { match: { channel: "slack", teamId: "T123" }, agentId: "support" },
    { match: { channel: "telegram", peer: { kind: "group", id: "-100123" } }, agentId: "support" },
  ],
}
```

--------------------------------

### Start OpenClaw Gateway Container

Source: https://docs.openclaw.ai/install/podman

Launches the OpenClaw Gateway container using Podman. This script handles container startup and necessary bind-mounts.

```bash
./scripts/run-openclaw-podman.sh launch
```

--------------------------------

### Install OpenClaw (Custom Git Directory PowerShell)

Source: https://docs.openclaw.ai/install/installer

Installs OpenClaw using the Git method and specifies a custom directory for cloning the repository. The default is '%USERPROFILE%\openclaw'.

```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -InstallMethod git -GitDir "C:\openclaw"
```

--------------------------------

### Install OpenClaw without Onboarding (Windows PowerShell)

Source: https://docs.openclaw.ai/install

Installs OpenClaw on Windows using PowerShell without launching the onboarding process.

```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -NoOnboard
```

--------------------------------

### Onboard with Gemini API Key

Source: https://docs.openclaw.ai/providers/google

Initializes the OpenClaw environment using a Gemini API key.

```bash
openclaw onboard --auth-choice gemini-api-key
```

--------------------------------

### Quick Start Web Fetch

Source: https://docs.openclaw.ai/tools/web-fetch

Call the web_fetch tool directly to retrieve content from a URL. It is enabled by default and requires no configuration.

```javascript
await web_fetch({ url: "https://example.com/article" });
```

--------------------------------

### Login to WhatsApp accounts

Source: https://docs.openclaw.ai/concepts/multi-agent

Link WhatsApp accounts before starting the gateway.

```bash
openclaw channels login --channel whatsapp --account personal
openclaw channels login --channel whatsapp --account biz
```

--------------------------------

### Run install.ps1 for Windows

Source: https://docs.openclaw.ai/install/installer

Executes the PowerShell installation script for Windows environments.

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -Tag beta -NoOnboard -DryRun
```

--------------------------------

### Manual Environment Variable Example for Multiple Gateways

Source: https://docs.openclaw.ai/gateway/multiple-gateways

Manually set environment variables for configuration path and state directory to run isolated Gateway instances.

```bash
OPENCLAW_CONFIG_PATH=~/.openclaw/main.json \
OPENCLAW_STATE_DIR=~/.openclaw-main \
openclaw gateway --port 18789

OPENCLAW_CONFIG_PATH=~/.openclaw/rescue.json \
OPENCLAW_STATE_DIR=~/.openclaw-rescue \
openclaw gateway --port 19001
```

--------------------------------

### Non-interactive Onboarding

Source: https://docs.openclaw.ai/providers/huggingface

Configure the provider without user interaction by passing the API key directly.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice huggingface-api-key \
  --huggingface-api-key "$HF_TOKEN"
```

--------------------------------

### Run Gateway via CLI

Source: https://docs.openclaw.ai/gateway/tailscale

Commands to start the gateway with Tailscale Serve or Funnel modes enabled.

```bash
openclaw gateway --tailscale serve
openclaw gateway --tailscale funnel --auth password
```

--------------------------------

### Install Teams Plugin from Local Checkout

Source: https://docs.openclaw.ai/channels/msteams

Install the Microsoft Teams plugin from a local Git repository checkout. This is useful when developing or testing the plugin.

```bash
openclaw plugins install ./path/to/local/msteams-plugin
```

--------------------------------

### Inspect Context List Output

Source: https://docs.openclaw.ai/concepts/context

Example output from the /context list command showing workspace file injection status and token counts.

```text
🧠 Context breakdown
Workspace: <workspaceDir>
Bootstrap max/file: 20,000 chars
Sandbox: mode=non-main sandboxed=false
System prompt (run): 38,412 chars (~9,603 tok) (Project Context 23,901 chars (~5,976 tok))

Injected workspace files:
- AGENTS.md: OK | raw 1,742 chars (~436 tok) | injected 1,742 chars (~436 tok)
- SOUL.md: OK | raw 912 chars (~228 tok) | injected 912 chars (~228 tok)
- TOOLS.md: TRUNCATED | raw 54,210 chars (~13,553 tok) | injected 20,962 chars (~5,241 tok)
- IDENTITY.md: OK | raw 211 chars (~53 tok) | injected 211 chars (~53 tok)
- USER.md: OK | raw 388 chars (~97 tok) | injected 388 chars (~97 tok)
- HEARTBEAT.md: MISSING | raw 0 | injected 0
- BOOTSTRAP.md: OK | raw 0 chars (~0 tok) | injected 0 chars (~0 tok)

Skills list (system prompt text): 2,184 chars (~546 tok) (12 skills)
Tools: read, edit, write, exec, process, browser, message, sessions_send, …
Tool list (system prompt text): 1,032 chars (~258 tok)
Tool schemas (JSON): 31,988 chars (~7,997 tok) (counts toward context; not shown as text)
Tools: (same as above)

Session tokens (cached): 14,250 total / ctx=32,000
```

--------------------------------

### Dry-run success and failure examples

Source: https://docs.openclaw.ai/cli/config

Examples of the JSON output returned by a successful or failed dry-run operation.

```json
{
  "ok": true,
  "operations": 1,
  "configPath": "~/.openclaw/openclaw.json",
  "inputModes": ["builder"],
  "checks": {
    "schema": false,
    "resolvability": true,
    "resolvabilityComplete": true
  },
  "refsChecked": 1,
  "skippedExecRefs": 0
}
```

```json
{
  "ok": false,
  "operations": 1,
  "configPath": "~/.openclaw/openclaw.json",
  "inputModes": ["builder"],
  "checks": {
    "schema": false,
    "resolvability": true,
    "resolvabilityComplete": true
  },
  "refsChecked": 1,
  "skippedExecRefs": 0,
  "errors": [
    {
      "kind": "resolvability",
      "message": "Error: Environment variable \"MISSING_TEST_SECRET\" is not set.",
      "ref": "env:default:MISSING_TEST_SECRET"
    }
  ]
}
```

--------------------------------

### Install Hook Packs with OpenClaw CLI

Source: https://docs.openclaw.ai/automation/hooks

Use this command to install hook packs from npm. Only registry-only npm specs are accepted; Git, URL, file specs, and semver ranges are rejected.

```bash
openclaw plugins install <path-or-spec>
```

--------------------------------

### Create a skill directory

Source: https://docs.openclaw.ai/tools/creating-skills

Create a new folder in your workspace to house the skill files.

```bash
mkdir -p ~/.openclaw/workspace/skills/hello-world
```

--------------------------------

### Install OpenClaw CLI

Source: https://docs.openclaw.ai/platforms/mac/bundled-gateway

Install the OpenClaw CLI globally using npm. Replace `<version>` with the desired version. Node 24 is the default, and Node 22.14+ is also compatible.

```bash
npm install -g openclaw@<version>
```

--------------------------------

### Configure SGLang API Key

Source: https://docs.openclaw.ai/concepts/model-providers

Environment variable setup for local SGLang auto-discovery.

```bash
export SGLANG_API_KEY="sglang-local"
```

--------------------------------

### Create the Fly app and volume

Source: https://docs.openclaw.ai/install/fly

Initializes the application environment and persistent storage on Fly.io.

```bash
# Clone the repo
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# Create a new Fly app (pick your own name)
fly apps create my-openclaw

# Create a persistent volume (1GB is usually enough)
fly volumes create openclaw_data --size 1 --region iad
```

--------------------------------

### Install and Manage Gateway Service (Windows)

Source: https://docs.openclaw.ai/gateway

Commands to install, check status, restart, and stop the OpenClaw gateway on Windows. Managed startup typically uses a Scheduled Task named 'OpenClaw Gateway'.

```powershell
openclaw gateway install
```

```powershell
openclaw gateway status --json
```

```powershell
openclaw gateway restart
```

```powershell
openclaw gateway stop
```

--------------------------------

### Target Format Examples

Source: https://docs.openclaw.ai/cli/message

Examples of target formats for different providers. WhatsApp uses E.164 or group JID, Telegram uses chat ID or @username, and Discord uses channel or user IDs.

```bash
openclaw message --target whatsapp:+1234567890 send "Message to WhatsApp user"
```

```bash
openclaw message --target @my_telegram_bot send "Message to Telegram user"
```

```bash
openclaw message --target channel:1234567890 send "Message to Discord channel"
```

```bash
openclaw message --target user:9876543210 send "Message to Discord user"
```

```bash
openclaw message --target spaces/ABCDEFG send "Message to Google Chat space"
```

```bash
openclaw message --target users/HIJKLMN send "Message to Google Chat user"
```

```bash
openclaw message --target channel:abcdefgh send "Message to Slack channel"
```

```bash
openclaw message --target user:ijklmnop send "Message to Slack user"
```

```bash
openclaw message --target channel:mnopqrst send "Message to Mattermost channel"
```

```bash
openclaw message --target user:qrstuvwx send "Message to Mattermost user"
```

```bash
openclaw message --target signal:+11234567890 send "Message to Signal user"
```

```bash
openclaw message --target group:abcdef send "Message to Signal group"
```

```bash
openclaw message --target username:testuser send "Message to Signal username"
```

```bash
openclaw message --target chat_id:12345 send "Message to iMessage chat"
```

```bash
openclaw message --target chat_guid:ABCDEF send "Message to iMessage chat by GUID"
```

```bash
openclaw message --target @user:server.com send "Message to Matrix user"
```

```bash
openclaw message --target !room:server.com send "Message to Matrix room"
```

```bash
openclaw message --target #alias:server.com send "Message to Matrix alias"
```

```bash
openclaw message --target conversation:19:abc@thread.tacv2 send "Message to Microsoft Teams conversation"
```

```bash
openclaw message --target user:00000000-0000-0000-0000-000000000000 send "Message to Microsoft Teams user"
```

--------------------------------

### Configure Gateway with Tailscale Serve

Source: https://docs.openclaw.ai/install/digitalocean

Installs Tailscale, enables its 'serve' mode, and configures the OpenClaw gateway to use Tailscale for access. Access the gateway via `https://<magicdns>/`.

```bash
curl -fsSL https://tailscale.com/install.sh | sh
tailscale up
openclaw config set gateway.tailscale.mode serve
openclaw gateway restart
```

--------------------------------

### Configure Web Search Provider

Source: https://docs.openclaw.ai/help/faq

Example structure for configuring a web search provider, such as Brave, within the plugins section.

```json5
{
  plugins: {
    entries: {
      brave: {
        config: {
          webSearch: {
```

--------------------------------

### Build Control UI

Source: https://docs.openclaw.ai/web/control-ui

Compiles static files for the Control UI. Automatically installs dependencies on the first run.

```bash
pnpm ui:build
```

--------------------------------

### Manage Node.js with fnm

Source: https://docs.openclaw.ai/install/node

Install and switch Node.js versions using the fnm version manager.

```bash
fnm install 24
fnm use 24
```

--------------------------------

### Onboard with Mistral API Key

Source: https://docs.openclaw.ai/cli/onboard

This non-interactive command is for onboarding using a Mistral API key. Make sure the MISTRAL_API_KEY is exported in your environment.

```bash
openclaw onboard --non-interactive \
  --auth-choice mistral-api-key \
  --mistral-api-key "$MISTRAL_API_KEY"
```

--------------------------------

### List OpenClaw Plugins

Source: https://docs.openclaw.ai/tools/plugin

Use these commands to view installed plugins. Options include compact, enabled-only, verbose, and JSON output.

```bash
openclaw plugins list                       # compact inventory
```

```bash
openclaw plugins list --enabled            # only loaded plugins
```

```bash
openclaw plugins list --verbose            # per-plugin detail lines
```

```bash
openclaw plugins list --json               # machine-readable inventory
```

--------------------------------

### Build and Run OpenClaw Gateway Manually

Source: https://docs.openclaw.ai/install/docker

Build the Docker image, run onboarding and configuration steps for the gateway, and then start the gateway in detached mode. Ensure you run `docker compose` from the repo root.

```bash
docker build -t openclaw:local -f Dockerfile .
docker compose run --rm --no-deps --entrypoint node openclaw-gateway \
  dist/index.js onboard --mode local --no-install-daemon
docker compose run --rm --no-deps --entrypoint node openclaw-gateway \
  dist/index.js config set --batch-json '[{"path":"gateway.mode","value":"local"},{"path":"gateway.bind","value":"lan"},{"path":"gateway.controlUi.allowedOrigins","value":["http://localhost:18789","http://127.0.0.1:18789"]}]'
docker compose up -d openclaw-gateway
```

--------------------------------

### Apply Patch Tool Usage Example

Source: https://docs.openclaw.ai/tools/apply-patch

This JSON demonstrates how to use the apply_patch tool with a sample patch for updating a file. Ensure the 'input' field contains the complete patch content, including begin and end markers.

```json
{
  "tool": "apply_patch",
  "input": "*** Begin Patch\n*** Update File: src/index.ts\n@@\n-const foo = 1\n+const foo = 2\n*** End Patch"
}
```

--------------------------------

### Install QQbot Plugin

Source: https://docs.openclaw.ai/plugins/community

Install the QQbot plugin to connect OpenClaw to QQ via the QQ Bot API. It supports private chats, group mentions, channel messages, and rich media.

```bash
openclaw plugins install @tencent-connect/openclaw-qqbot
```

--------------------------------

### Execute Agent Commands

Source: https://docs.openclaw.ai/cli/agent

Examples of running agent turns with various flags for routing, messaging, and delivery.

```bash
openclaw agent --to +15555550123 --message "status update" --deliver
openclaw agent --agent ops --message "Summarize logs"
openclaw agent --session-id 1234 --message "Summarize inbox" --thinking medium
openclaw agent --to +15555550123 --message "Trace logs" --verbose on --json
openclaw agent --agent ops --message "Generate report" --deliver --reply-channel slack --reply-to "#reports"
openclaw agent --agent ops --message "Run locally" --local
```

--------------------------------

### Update All Installed Skills

Source: https://docs.openclaw.ai/tools/skills

This command updates all skills that are currently installed in your workspace. Ensure you have the latest versions of your skills.

```bash
openclaw skills update --all
```

--------------------------------

### Onboard OpenClaw with LiteLLM

Source: https://docs.openclaw.ai/providers/litellm

Use the CLI to configure OpenClaw for LiteLLM authentication.

```bash
openclaw onboard --auth-choice litellm-api-key
```

--------------------------------

### Recommended Starter Openclaw AI Configuration

Source: https://docs.openclaw.ai/gateway/configuration-examples

This recommended configuration includes settings for identity, agent model, and WhatsApp channel preferences like requiring mentions in groups. It provides a more robust starting point for the bot's operation.

```json5
{
  identity: {
    name: "Clawd",
    theme: "helpful assistant",
    emoji: "🦞",
  },
  agent: {
    workspace: "~/.openclaw/workspace",
    model: { primary: "anthropic/claude-sonnet-4-6" },
  },
  channels: {
    whatsapp: {
      allowFrom: ["+15555550123"],
      groups: { "*": { requireMention: true } },
    },
  },
}
```

--------------------------------

### Onboard BlueBubbles via CLI

Source: https://docs.openclaw.ai/channels/bluebubbles

Interactive and direct CLI methods to initialize the BlueBubbles channel.

```bash
openclaw onboard
```

```bash
openclaw channels add bluebubbles --http-url http://192.168.1.100:1234 --password <password>
```

--------------------------------

### Set Prompt Style Override

Source: https://docs.openclaw.ai/concepts/active-memory

Example of explicitly setting the prompt style.

```json5
promptStyle: "preference-only"
```

--------------------------------

### Install Playwright browsers in Docker

Source: https://docs.openclaw.ai/help/faq

Use this command to install required browsers within the Docker container environment.

```bash
node /app/node_modules/playwright-core/cli.js install chromium
```

--------------------------------

### Agent Configuration Migration

Source: https://docs.openclaw.ai/tools/multi-agent-sandbox-tools

Examples showing the transition from a legacy single-agent configuration to a modern multi-agent structure.

```json
{
  "agents": {
    "defaults": {
      "workspace": "~/.openclaw/workspace",
      "sandbox": {
        "mode": "non-main"
      }
    }
  },
  "tools": {
    "sandbox": {
      "tools": {
        "allow": ["read", "write", "apply_patch", "exec"],
        "deny": []
      }
    }
  }
}
```

```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "default": true,
        "workspace": "~/.openclaw/workspace",
        "sandbox": { "mode": "off" }
      }
    ]
  }
}
```

--------------------------------

### Register Example Proxy Provider

Source: https://docs.openclaw.ai/ja-JP/plugins/architecture

Registers a custom provider named 'Example Proxy' for use with OpenClaw AI. This snippet demonstrates how to define authentication, catalog, dynamic model resolution, and usage tracking for the provider.

```typescript
api.registerProvider({
  id: "example-proxy",
  label: "Example Proxy",
  auth: [],
  catalog: {
    order: "simple",
    run: async (ctx) => {
      const apiKey = ctx.resolveProviderApiKey("example-proxy").apiKey;
      if (!apiKey) {
        return null;
      }
      return {
        provider: {
          baseUrl: "https://proxy.example.com/v1",
          apiKey,
          api: "openai-completions",
          models: [{ id: "auto", name: "Auto" }],
        },
      };
    },
  },
  resolveDynamicModel: (ctx) => ({
    id: ctx.modelId,
    name: ctx.modelId,
    provider: "example-proxy",
    api: "openai-completions",
    baseUrl: "https://proxy.example.com/v1",
    reasoning: false,
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 128000,
    maxTokens: 8192,
  }),
  prepareRuntimeAuth: async (ctx) => {
    const exchanged = await exchangeToken(ctx.apiKey);
    return {
      apiKey: exchanged.token,
      baseUrl: exchanged.baseUrl,
      expiresAt: exchanged.expiresAt,
    };
  },
  resolveUsageAuth: async (ctx) => {
    const auth = await ctx.resolveOAuthToken();
    return auth ? { token: auth.token } : null;
  },
  fetchUsageSnapshot: async (ctx) => {
    return await fetchExampleProxyUsage(ctx.token, ctx.timeoutMs, ctx.fetchFn);
  },
});
```

--------------------------------

### Install Openclaw AI (Dry Run)

Source: https://docs.openclaw.ai/install/installer

Perform a dry run of the Openclaw AI installation to see what actions would be taken without actually applying any changes. Useful for verification.

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --dry-run
```

--------------------------------

### Install Lossless Claw (LCM) Plugin

Source: https://docs.openclaw.ai/plugins/community

Install the Lossless Context Management plugin for OpenClaw. This DAG-based plugin offers conversation summarization with incremental compaction, preserving context fidelity while reducing token usage.

```bash
openclaw plugins install @martian-engineering/lossless-claw
```

--------------------------------

### Gmail Webhook Setup

Source: https://docs.openclaw.ai/cli/webhooks

Configure Gmail watch, Pub/Sub, and OpenClaw webhook delivery.

```APIDOC
## `openclaw webhooks gmail setup`

### Description
Configure Gmail watch, Pub/Sub, and OpenClaw webhook delivery.

### Method
CLI Command

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Parameters
#### Required
* `--account <email>` - The email account to configure.

#### Options
* `--project <id>` - The Google Cloud project ID.
* `--topic <name>` - The Pub/Sub topic name.
* `--subscription <name>` - The Pub/Sub subscription name.
* `--label <label>` - The Gmail label to watch.
* `--hook-url <url>` - The URL to send webhook notifications to.
* `--hook-token <token>` - A token for authenticating the webhook.
* `--push-token <token>` - A token for push notifications.
* `--bind <host>` - The host to bind the server to.
* `--port <port>` - The port to bind the server to.
* `--path <path>` - The path for the webhook endpoint.
* `--include-body` - Include the email body in notifications.
* `--max-bytes <n>` - Maximum bytes for email body.
* `--renew-minutes <n>` - Minutes to renew the watch subscription.
* `--tailscale <funnel|serve|off>` - Tailscale mode.
* `--tailscale-path <path>` - Path for Tailscale.
* `--tailscale-target <target>` - Target for Tailscale.
* `--push-endpoint <url>` - Endpoint for push notifications.
* `--json` - Output in JSON format.

### Request Example
```bash
openclaw webhooks gmail setup --account you@example.com
openclaw webhooks gmail setup --account you@example.com --project my-gcp-project --json
openclaw webhooks gmail setup --account you@example.com --hook-url https://gateway.example.com/hooks/gmail
```

### Response
#### Success Response (200)
Indicates successful configuration.

#### Response Example
(CLI output, no specific JSON example provided)
```

--------------------------------

### Build and Launch Gateway

Source: https://docs.openclaw.ai/install/docker-vm-runtime

Commands to build the Docker image and start the gateway service in detached mode.

```bash
docker compose build
docker compose up -d openclaw-gateway
```

--------------------------------

### Inspect Account Example Fields

Source: https://docs.openclaw.ai/tools/capability-cookbook

When implementing `inspectAccount`, include credential source and status fields like `tokenSource`, `tokenStatus`, `botTokenSource`, `botTokenStatus`, `appTokenSource`, `appTokenStatus`, `signingSecretSource`, and `signingSecretStatus`.

```javascript
tokenSource: "...",
tokenStatus: "available"
```

```javascript
botTokenSource: "...",
botTokenStatus: "available"
```

```javascript
appTokenSource: "...",
appTokenStatus: "available"
```

```javascript
signingSecretSource: "...",
signingSecretStatus: "available"
```

--------------------------------

### Verify Venice Setup

Source: https://docs.openclaw.ai/providers/venice

Test the configuration by sending a message to a specific Venice model.

```bash
openclaw agent --model venice/kimi-k2-5 --message "Hello, are you working?"
```

--------------------------------

### Start Ollama Service

Source: https://docs.openclaw.ai/providers/ollama

Command to launch the Ollama server process.

```bash
ollama serve
```

--------------------------------

### Onboard with Moonshot API Key

Source: https://docs.openclaw.ai/start/wizard-cli-automation

Use this command to onboard with Moonshot using an API key. The MOONSHOT_API_KEY environment variable must be set.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice moonshot-api-key \
  --moonshot-api-key "$MOONSHOT_API_KEY" \
  --gateway-port 18789 \
  --gateway-bind loopback
```

--------------------------------

### Run Multiple Gateways

Source: https://docs.openclaw.ai/gateway/configuration-reference

Configure multiple gateway instances on a single host by specifying unique configuration paths, state directories, and ports. Use convenience flags like --dev or --profile for easier setup.

```bash
OPENCLAW_CONFIG_PATH=~/.openclaw/a.json \
OPENCLAW_STATE_DIR=~/.openclaw-a \
openclaw gateway --port 19001
```

--------------------------------

### Start Gmail Watcher with gog CLI

Source: https://docs.openclaw.ai/automation/cron-jobs

Initiates the Gmail watch process using the 'gog' CLI. This command connects to your specified Gmail account, monitors the 'INBOX' label, and sends notifications to the designated Pub/Sub topic.

```bash
gog gmail watch start \
  --account openclaw@gmail.com \
  --label INBOX \
  --topic projects/<project-id>/topics/gog-gmail-watch
```

--------------------------------

### Configure Multi-Platform Channels

Source: https://docs.openclaw.ai/gateway/configuration-examples

Setup for multiple communication channels including WhatsApp, Telegram, and Discord.

```json5
{
  agent: { workspace: "~/.openclaw/workspace" },
  channels: {
    whatsapp: { allowFrom: ["+15555550123"] },
    telegram: {
      enabled: true,
      botToken: "YOUR_TOKEN",
      allowFrom: ["123456789"],
    },
    discord: {
      enabled: true,
      token: "YOUR_TOKEN",
      dm: { allowFrom: ["123456789012345678"] },
    },
  },
}
```

--------------------------------

### Configure Secrets Skipping Provider Setup

Source: https://docs.openclaw.ai/gateway/secrets

Execute the secrets configure command while skipping the initial provider setup phase. This is helpful if your providers are already configured and you only need to manage agent-specific secret mappings.

```bash
openclaw secrets configure --skip-provider-setup
```

--------------------------------

### Manual Compaction with Instructions

Source: https://docs.openclaw.ai/concepts/compaction

Manually trigger compaction in a chat interface by typing `/compact` followed by specific instructions to guide the summarization process.

```bash
/compact Focus on the API design decisions
```

--------------------------------

### Non-Interactive Together AI Onboarding

Source: https://docs.openclaw.ai/providers/together

This command allows for non-interactive setup of Together AI, including setting the API key and a default model. Ensure the TOGETHER_API_KEY environment variable is set.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice together-api-key \
  --together-api-key "$TOGETHER_API_KEY"
```

--------------------------------

### Start local relay and configure channel

Source: https://docs.openclaw.ai/channels/nostr

Commands and configuration to run a local strfry relay and point the Nostr channel to it for testing.

```bash
# Start strfry
docker run -p 7777:7777 ghcr.io/hoytech/strfry
```

```json5
{
  channels: {
    nostr: {
      privateKey: "${NOSTR_PRIVATE_KEY}",
      relays: ["ws://localhost:7777"],
    },
  },
}
```

--------------------------------

### Agent Configuration Sample

Source: https://docs.openclaw.ai/cli/agents

Example structure of the agents list configuration containing identity fields.

```json5
{
  agents: {
    list: [
      {
        id: "main",
        identity: {
          name: "OpenClaw",
          theme: "space lobster",
          emoji: "🦞",
          avatar: "avatars/openclaw.png",
        },
      },
    ],
  },
}
```

--------------------------------

### Example Kilo Gateway Models

Source: https://docs.openclaw.ai/providers/kilocode

This list shows example model references available through Kilo Gateway, including the default smart-routing model and specific provider models. Model references typically follow the 'kilocode/<model-id>' format.

```text
kilocode/kilo/auto              (default - smart routing)
kilocode/anthropic/claude-sonnet-4
kilocode/openai/gpt-5.4
kilocode/google/gemini-3-pro-preview
...and many more
```

--------------------------------

### CLI Onboarding for Xiaomi MiMo

Source: https://docs.openclaw.ai/providers/xiaomi

Use these commands to authenticate the Xiaomi provider via the OpenClaw CLI.

```bash
openclaw onboard --auth-choice xiaomi-api-key
# or non-interactive
openclaw onboard --auth-choice xiaomi-api-key --xiaomi-api-key "$XIAOMI_API_KEY"
```

--------------------------------

### Tail Gateway Logs

Source: https://docs.openclaw.ai/cli/index

Examples of tailing logs with various formatting and filtering options.

```bash
openclaw logs --follow
openclaw logs --limit 200
openclaw logs --plain
openclaw logs --json
openclaw logs --no-color
```

--------------------------------

### Onboard with Anthropic API Key

Source: https://docs.openclaw.ai/start/wizard-cli-automation

Use this command to onboard with Anthropic using an API key. Ensure the ANTHROPIC_API_KEY environment variable is set.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice apiKey \
  --anthropic-api-key "$ANTHROPIC_API_KEY" \
  --gateway-port 18789 \
  --gateway-bind loopback
```

--------------------------------

### Check Node.js Version

Source: https://docs.openclaw.ai/install/node

Verify the currently installed Node.js version.

```bash
node -v
```

--------------------------------

### Build the Control UI

Source: https://docs.openclaw.ai/web

Build the static files for the Control UI from the source.

```bash
pnpm ui:build # auto-installs UI deps on first run
```

--------------------------------

### Common Workflows

Source: https://docs.openclaw.ai/tools/clawhub

Examples of common workflows using the OpenClaw CLI.

```APIDOC
## Common workflows for agents

### Search for skills

```bash
clawhub search "postgres backups"
```

### Download new skills

```bash
clawhub install my-skill-pack
```

### Update installed skills

```bash
clawhub update --all
```

### Back up your skills (publish or sync)

For a single skill folder:

```bash
clawhub skill publish ./my-skill --slug my-skill --name "My Skill" --version 1.0.0 --tags latest
```

To scan and back up many skills at once:

```bash
clawhub sync --all
```
```

--------------------------------

### Manage Gateway service lifecycle

Source: https://docs.openclaw.ai/help/faq

Commands to stop and start the background supervised service.

```bash
openclaw gateway stop
openclaw gateway start
```

--------------------------------

### Registering a Context Engine

Source: https://docs.openclaw.ai/concepts/context-engine

Example of how to register a custom context engine using the OpenClaw plugin SDK.

```APIDOC
## POST /register/contextEngine

### Description
Registers a new context engine with the OpenClaw runtime.

### Method
POST

### Endpoint
`/register/contextEngine`

### Parameters
#### Request Body
- **engineId** (string) - Required - The unique identifier for the context engine.
- **engineDefinition** (object) - Required - An object conforming to the `ContextEngine` interface, defining the engine's behavior.

### Request Example
```json
{
  "engineId": "my-engine",
  "engineDefinition": {
    "info": {
      "id": "my-engine",
      "name": "My Context Engine",
      "ownsCompaction": true
    },
    "ingest": "(params) => { ... }",
    "assemble": "(params) => { ... }",
    "compact": "(params) => { ... }"
  }
}
```

### Response
#### Success Response (200)
- **success** (boolean) - Indicates if the engine was registered successfully.

#### Response Example
```json
{
  "success": true
}
```
```

--------------------------------

### Onboarding Main and Rescue Bots

Source: https://docs.openclaw.ai/gateway/multiple-gateways

Onboard a main bot and a rescue bot, ensuring the rescue bot uses an isolated profile and a sufficiently spaced port.

```bash
# Main bot (existing or fresh, without --profile param)
# Runs on port 18789 + Chrome CDC/Canvas/... Ports
openclaw onboard
openclaw gateway install

# Rescue bot (isolated profile + ports)
openclaw --profile rescue onboard
# Notes:
# - workspace name will be postfixed with -rescue per default
# - Port should be at least 18789 + 20 Ports,
#   better choose completely different base port, like 19789,
# - rest of the onboarding is the same as normal

# To install the service (if not happened automatically during setup)
openclaw --profile rescue gateway install
```

--------------------------------

### Remove OpenClaw CLI Installation

Source: https://docs.openclaw.ai/install/uninstall

Remove the global installation of the OpenClaw CLI using the package manager you originally used.

```bash
npm rm -g openclaw
```

```bash
pnpm remove -g openclaw
```

```bash
bun remove -g openclaw
```

--------------------------------

### defineSetupPluginEntry

Source: https://docs.openclaw.ai/plugins/sdk-entrypoints

Defines a lightweight setup entry for plugins, used when channels are disabled, unconfigured, or deferred loading is enabled.

```APIDOC
## defineSetupPluginEntry

### Description
For the lightweight setup-entry.ts file. Returns just the plugin instance with no runtime or CLI wiring.

### Parameters
#### Request Body
- **plugin** (ChannelPlugin) - Required - The channel plugin instance.

### Request Example
{
  "plugin": "myChannelPlugin"
}
```

--------------------------------

### Create virtual machine

Source: https://docs.openclaw.ai/install/azure

Deploys a VM without a public IP, relying on Bastion for access.

```bash
az vm create \
  -g "${RG}" -n "${VM_NAME}" -l "${LOCATION}" \
  --image "Canonical:ubuntu-24_04-lts:server:latest" \
  --size "${VM_SIZE}" \
  --os-disk-size-gb "${OS_DISK_SIZE_GB}" \
  --storage-sku StandardSSD_LRS \
  --admin-username "${ADMIN_USERNAME}" \
  --ssh-key-values "${SSH_PUB_KEY}" \
  --vnet-name "${VNET_NAME}" \
  --subnet "${VM_SUBNET_NAME}" \
  --public-ip-address "" \
  --nsg ""
```

--------------------------------

### Onboard with Custom Provider (Ref-Mode)

Source: https://docs.openclaw.ai/start/wizard-cli-automation

Onboard with a custom AI provider using reference mode for API key management. The API key is stored as an environment variable reference.

```bash
export CUSTOM_API_KEY="your-key"
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice custom-api-key \
  --custom-base-url "https://llm.example.com/v1" \
  --custom-model-id "foo-large" \
  --secret-input-mode ref \
  --custom-provider-id "my-custom" \
  --custom-compatibility anthropic \
  --gateway-port 18789 \
  --gateway-bind loopback
```

--------------------------------

### Example Chiptune Loop Prompt

Source: https://docs.openclaw.ai/tools/music-generation

Use this prompt to ask the agent to generate an energetic chiptune loop about a specific theme.

```text
Generate an energetic chiptune loop about launching a rocket at sunrise.
```

--------------------------------

### Create virtual network and subnets

Source: https://docs.openclaw.ai/install/azure

Sets up the VNet, attaches the NSG to the VM subnet, and creates the required AzureBastionSubnet.

```bash
az network vnet create \
  -g "${RG}" -n "${VNET_NAME}" -l "${LOCATION}" \
  --address-prefixes "${VNET_PREFIX}" \
  --subnet-name "${VM_SUBNET_NAME}" \
  --subnet-prefixes "${VM_SUBNET_PREFIX}"

# Attach the NSG to the VM subnet
az network vnet subnet update \
  -g "${RG}" --vnet-name "${VNET_NAME}" \
  -n "${VM_SUBNET_NAME}" --nsg "${NSG_NAME}"

# AzureBastionSubnet — name is required by Azure
az network vnet subnet create \
  -g "${RG}" --vnet-name "${VNET_NAME}" \
  -n AzureBastionSubnet \
  --address-prefixes "${BASTION_SUBNET_PREFIX}"
```

--------------------------------

### Install Tlon Plugin via CLI

Source: https://docs.openclaw.ai/channels/tlon

Use these commands to install the Tlon plugin if it is not already bundled in your OpenClaw release.

```bash
openclaw plugins install @openclaw/tlon
```

```bash
openclaw plugins install ./path/to/local/tlon-plugin
```

--------------------------------

### Create Openclaw Backup

Source: https://docs.openclaw.ai/cli/uninstall

Run this command before uninstalling to create a restorable snapshot of your state and workspaces.

```bash
openclaw backup create
```

--------------------------------

### MCP Client Configuration

Source: https://docs.openclaw.ai/cli/mcp

Example stdio client configuration for connecting to an OpenClaw MCP server. Ensure the 'openclaw' command and arguments are correctly set for your environment.

```json
{
  "mcpServers": {
    "openclaw": {
      "command": "openclaw",
      "args": [
        "mcp",
        "serve",
        "--url",
        "wss://gateway-host:18789",
        "--token-file",
        "/path/to/gateway.token"
      ]
    }
  }
}
```

--------------------------------

### Configure multiple gateways

Source: https://docs.openclaw.ai/help/faq

Commands for managing multiple gateway instances using profiles and service installation.

```bash
openclaw --profile <name> ...
openclaw --profile <name> gateway install
```

--------------------------------

### Configure OpenClaw for inferrs

Source: https://docs.openclaw.ai/providers/inferrs

Full configuration example for integrating a local inferrs backend into OpenClaw.

```json5
{
  agents: {
    defaults: {
      model: { primary: "inferrs/google/gemma-4-E2B-it" },
      models: {
        "inferrs/google/gemma-4-E2B-it": {
          alias: "Gemma 4 (inferrs)",
        },
      },
    },
  },
  models: {
    mode: "merge",
    providers: {
      inferrs: {
        baseUrl: "http://127.0.0.1:8080/v1",
        apiKey: "inferrs-local",
        api: "openai-completions",
        models: [
          {
            id: "google/gemma-4-E2B-it",
            name: "Gemma 4 E2B (inferrs)",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 131072,
            maxTokens: 4096,
            compat: {
              requiresStringContent: true,
            },
          },
        ],
      },
    },
  },
}
```

--------------------------------

### Configure Context Engine Plugin

Source: https://docs.openclaw.ai/concepts/context-engine

Enable and select the installed plugin in the openclaw.json configuration file.

```json5
// openclaw.json
{
  plugins: {
    slots: {
      contextEngine: "lossless-claw", // must match the plugin's registered engine id
    },
    entries: {
      "lossless-claw": {
        enabled: true,
        // Plugin-specific config goes here (see the plugin's docs)
      },
    },
  },
}
```

--------------------------------

### ACP Command Examples

Source: https://docs.openclaw.ai/tools/acp-agents

Commonly used ACP commands for managing sessions, configurations, and system health.

```bash
/acp spawn codex --bind here --cwd /repo
```

```bash
/acp cancel agent:codex:acp:<uuid>
```

```bash
/acp steer --session support inbox prioritize failing tests
```

```bash
/acp close
```

```bash
/acp status
```

```bash
/acp set-mode plan
```

```bash
/acp set model openai/gpt-5.4
```

```bash
/acp cwd /Users/user/Projects/repo
```

```bash
/acp permissions strict
```

```bash
/acp timeout 120
```

```bash
/acp model anthropic/claude-opus-4-6
```

```bash
/acp reset-options
```

```bash
/acp sessions
```

```bash
/acp doctor
```

```bash
/acp install
```

--------------------------------

### Example Music Generation Prompt

Source: https://docs.openclaw.ai/tools/music-generation

Use this prompt to ask the agent to generate a cinematic piano track with specific characteristics.

```text
Generate a cinematic piano track with soft strings and no vocals.
```

--------------------------------

### BTW Side Question Example

Source: https://docs.openclaw.ai/tools/slash-commands

The `/btw` command is used for quick side questions within the current session. It runs as a separate, tool-less call and does not affect future context or history.

```text
/btw what are we doing right now?
```

--------------------------------

### Install Ansible Collections

Source: https://docs.openclaw.ai/install/ansible

Installs necessary Ansible collections defined in the requirements.yml file. This ensures all required modules are available for the playbook.

```bash
ansible-galaxy collection install -r requirements.yml
```

--------------------------------

### Execute Common System Commands

Source: https://docs.openclaw.ai/cli/system

Examples of common system operations including event creation, heartbeat management, and presence listing.

```bash
openclaw system event --text "Check for urgent follow-ups" --mode now
openclaw system event --text "Check for urgent follow-ups" --url ws://127.0.0.1:18789 --token "$OPENCLAW_GATEWAY_TOKEN"
openclaw system heartbeat enable
openclaw system heartbeat last
openclaw system presence
```

--------------------------------

### Define SKILL.md metadata and instructions

Source: https://docs.openclaw.ai/tools/creating-skills

Create a SKILL.md file with YAML frontmatter for metadata and markdown for agent instructions.

```markdown
---
name: hello_world
description: A simple skill that says hello.
---

# Hello World Skill

When the user asks for a greeting, use the `echo` tool to say
"Hello from your custom skill!".
```

--------------------------------

### Install Nostr Plugin

Source: https://docs.openclaw.ai/channels/nostr

Commands to install the Nostr plugin via the OpenClaw CLI, either from the registry or a local development path.

```bash
openclaw plugins install @openclaw/nostr
```

```bash
openclaw plugins install --link <path-to-local-nostr-plugin>
```

--------------------------------

### Run OpenClaw MCP Server

Source: https://docs.openclaw.ai/cli/mcp

Commands to start the MCP server with various configurations for local or remote gateways.

```bash
# Local Gateway
openclaw mcp serve

# Remote Gateway
openclaw mcp serve --url wss://gateway-host:18789 --token-file ~/.openclaw/gateway.token

# Remote Gateway with password auth
openclaw mcp serve --url wss://gateway-host:18789 --password-file ~/.openclaw/gateway.password

# Enable verbose bridge logs
openclaw mcp serve --verbose

# Disable Claude-specific push notifications
openclaw mcp serve --claude-channel-mode off
```

--------------------------------

### Send Messages and Cards via CLI

Source: https://docs.openclaw.ai/channels/msteams

Examples for sending text messages to users or conversations, and sending Adaptive Cards to conversations.

```bash
# Send to a user by ID
openclaw message send --channel msteams --target "user:40a1a0ed-..." --message "Hello"

# Send to a user by display name (triggers Graph API lookup)
openclaw message send --channel msteams --target "user:John Smith" --message "Hello"

# Send to a group chat or channel
openclaw message send --channel msteams --target "conversation:19:abc...@thread.tacv2" --message "Hello"

# Send an Adaptive Card to a conversation
openclaw message send --channel msteams --target "conversation:19:abc...@thread.tacv2" \
  --card '{"type":"AdaptiveCard","version":"1.5","body":[{"type":"TextBlock","text":"Hello"}]}'
```

--------------------------------

### Approve and List Openclaw Devices and Nodes

Source: https://docs.openclaw.ai/nodes

On the gateway host, list available devices to get a request ID, then approve the device. Finally, check the status of the nodes.

```bash
openclaw devices list
openclaw devices approve <requestId>
openclaw nodes status
```

--------------------------------

### Non-interactive npm Install (install.sh)

Source: https://docs.openclaw.ai/install/installer

Installs OpenClaw non-interactively using the install.sh script with the npm method. It skips prompts and onboarding steps.

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --no-prompt --no-onboard
```

--------------------------------

### Manage plugins via chat commands

Source: https://docs.openclaw.ai/tools/plugin

Commands for installing, showing, and enabling plugins directly through the chat interface when enabled.

```text
/plugin install clawhub:@openclaw/voice-call
/plugin show voice-call
/plugin enable voice-call
```

--------------------------------

### Non-interactive Onboarding for Arcee AI

Source: https://docs.openclaw.ai/providers/arcee

This command allows for non-interactive setup of Arcee AI access. It requires specifying the API key directly.

```bash
# Direct (Arcee platform)
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice arceeai-api-key \
  --arceeai-api-key "$ARCEEAI_API_KEY"
```

```bash
# Via OpenRouter
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice arceeai-openrouter \
  --openrouter-api-key "$OPENROUTER_API_KEY"
```

--------------------------------

### Switch to Nix Configuration

Source: https://docs.openclaw.ai/install/nix

After configuring secrets and filling in template placeholders, switch to your new Nix configuration.

```bash
home-manager switch
```

--------------------------------

### Get Hook Information

Source: https://docs.openclaw.ai/cli/hooks

Retrieves detailed information about a specific hook by its name or key. Use `--json` to get structured output.

```bash
openclaw hooks info <name>
```

```bash
openclaw hooks info session-memory
```

--------------------------------

### Map input items to tool calls

Source: https://docs.openclaw.ai/tools/lobster

Example of piping search results into an invocation tool to process items individually.

```bash
gog.gmail.search --query 'newer_than:1d' \
  | openclaw.invoke --tool message --action send --each --item-key message --args-json '{"provider":"telegram","to":"..."}'
```

--------------------------------

### Multi-Language Support Configuration

Source: https://docs.openclaw.ai/channels/broadcast-groups

Example configuration for a multi-language translation workflow using sequential broadcast strategy.

```APIDOC
## Example 2: Multi-Language Support

### Description
This configuration demonstrates a sequential workflow for multi-language support. It first detects the language of the input, then translates it to English, and finally to German. The `sequential` strategy ensures agents process messages in the specified order.

### Request Body
```json
{
  "broadcast": {
    "strategy": "sequential",
    "+15555550123": ["detect-language", "translator-en", "translator-de"]
  },
  "agents": {
    "list": [
      { "id": "detect-language", "workspace": "~/agents/lang-detect" },
      { "id": "translator-en", "workspace": "~/agents/translate-en" },
      { "id": "translator-de", "workspace": "~/agents/translate-de" }
    ]
  }
}
```
```

--------------------------------

### Manage Ollama Models

Source: https://docs.openclaw.ai/providers/ollama

Commands to list installed models and pull new ones from the registry.

```bash
ollama list  # See what's installed
ollama pull gemma4
ollama pull gpt-oss:20b
ollama pull llama3.3     # Or another model
```

--------------------------------

### Define UI rendering hints

Source: https://docs.openclaw.ai/plugins/manifest

Configures labels, help text, and sensitivity for specific configuration fields in the UI.

```json
{
  "uiHints": {
    "apiKey": {
      "label": "API key",
      "help": "Used for OpenRouter requests",
      "placeholder": "sk-or-v1-...",
      "sensitive": true
    }
  }
}
```

--------------------------------

### Configure Docker Gateway Setup

Source: https://docs.openclaw.ai/gateway/sandboxing

Enables the Docker sandbox configuration path for Docker gateway deployments. Set `OPENCLAW_SANDBOX=1` to enable this path. The socket location can be overridden with `OPENCLAW_DOCKER_SOCKET`.

```bash
export OPENCLAW_SANDBOX=1
```

--------------------------------

### Onboard with Mistral API Key

Source: https://docs.openclaw.ai/start/wizard-cli-automation

Integrate with Mistral AI by providing your API key. Ensure MISTRAL_API_KEY is set in your environment.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice mistral-api-key \
  --mistral-api-key "$MISTRAL_API_KEY" \
  --gateway-port 18789 \
  --gateway-bind loopback
```

--------------------------------

### Create WSL boot task in Windows

Source: https://docs.openclaw.ai/platforms/windows

Configures a Windows Scheduled Task to automatically start WSL with a specific distribution at system boot. Replace 'Ubuntu' with your distro name.

```powershell
schtasks /create /tn "WSL Boot" /tr "wsl.exe -d Ubuntu --exec /bin/true" /sc onstart /ru SYSTEM
```

--------------------------------

### Manage Browser Lifecycle

Source: https://docs.openclaw.ai/cli/browser

Commands to check status, start, stop, or reset browser profiles.

```bash
openclaw browser status
openclaw browser start
openclaw browser stop
openclaw browser --browser-profile openclaw reset-profile
```

--------------------------------

### Provider Plugin Package Metadata

Source: https://docs.openclaw.ai/plugins/sdk-setup

Example `package.json` for a provider plugin or ClawHub publish baseline, including compatibility and build information.

```APIDOC
## Provider Plugin Package Metadata

### Description
Configuration for a provider plugin or a baseline for publishing to ClawHub, including compatibility and build details.

### Method
N/A (Configuration File)

### Endpoint
N/A

### Parameters
#### Request Body
- **name** (string) - Required - The name of the package.
- **version** (string) - Required - The version of the package.
- **type** (string) - Required - The module type, typically "module".
- **openclaw** (object) - Required - Contains OpenCLAW specific configurations.
  - **extensions** (string[]) - Required - Entry point files for the plugin.
  - **compat** (object) - Required for external publishing - Compatibility information.
    - **pluginApi** (string) - Required - Minimum compatible plugin API version.
    - **minGatewayVersion** (string) - Required - Minimum compatible gateway version.
  - **build** (object) - Required for external publishing - Build information.
    - **openclawVersion** (string) - Required - The OpenCLAW version used for building.
    - **pluginSdkVersion** (string) - Required - The plugin SDK version used for building.

### Request Example
```json
{
  "name": "@myorg/openclaw-my-plugin",
  "version": "1.0.0",
  "type": "module",
  "openclaw": {
    "extensions": ["./index.ts"],
    "compat": {
      "pluginApi": ">=2026.3.24-beta.2",
      "minGatewayVersion": ">=2026.3.24-beta.2"
    },
    "build": {
      "openclawVersion": "2026.3.24-beta.2",
      "pluginSdkVersion": "2026.3.24-beta.2"
    }
  }
}
```

### Response
N/A (Configuration File)
```

--------------------------------

### CLI Setup for OpenAI API Key

Source: https://docs.openclaw.ai/providers/openai

Set up OpenClaw to use an OpenAI API key for authentication. This can be done interactively or non-interactively.

```bash
openclaw onboard --auth-choice openai-api-key
```

```bash
openclaw onboard --openai-api-key "sk-..."
```

--------------------------------

### SSH into VM

Source: https://docs.openclaw.ai/install/macos-vm

Connects to the virtual machine via SSH using the user account created during setup.

```bash
ssh youruser@192.168.64.X
```

--------------------------------

### Channel Configuration Example

Source: https://docs.openclaw.ai/plugins/sdk-setup

This JSON object demonstrates the structure and fields for configuring a channel within the openclaw.channel package. It includes details like ID, labels, documentation paths, and exposure settings.

```json
{
  "openclaw": {
    "channel": {
      "id": "my-channel",
      "label": "My Channel",
      "selectionLabel": "My Channel (self-hosted)",
      "detailLabel": "My Channel Bot",
      "docsPath": "/channels/my-channel",
      "docsLabel": "my-channel",
      "blurb": "Webhook-based self-hosted chat integration.",
      "order": 80,
      "aliases": ["mc"],
      "preferOver": ["my-channel-legacy"],
      "selectionDocsPrefix": "Guide:",
      "selectionExtras": ["Markdown"],
      "markdownCapable": true,
      "exposure": {
        "configured": true,
        "setup": true,
        "docs": true
      },
      "quickstartAllowFrom": true
    }
  }
}
```

--------------------------------

### Perform full configuration replacement with config.apply

Source: https://docs.openclaw.ai/gateway/configuration

Replaces the entire configuration and triggers a gateway restart. Requires a base hash obtained from config.get to ensure consistency.

```bash
openclaw gateway call config.get --params '{}'  # capture payload.hash
openclaw gateway call config.apply --params '{
  "raw": "{ agents: { defaults: { workspace: \"~/.openclaw/workspace\" } } }",
  "baseHash": "<hash>",
  "sessionKey": "agent:main:whatsapp:direct:+15555550123"
}'
```

--------------------------------

### Provider Management Modules

Source: https://docs.openclaw.ai/plugins/sdk-overview

Overview of the plugin-sdk/provider-* modules used for provider entry, setup, and authentication runtime.

```APIDOC
## Provider Management Modules

### Description
Provides utilities for defining provider plugins, setting up local/self-hosted environments, and managing authentication flows.

### Modules
- **plugin-sdk/provider-entry**: Includes `defineSingleProviderPluginEntry`.
- **plugin-sdk/provider-setup**: Local/self-hosted provider setup helpers.
- **plugin-sdk/self-hosted-provider-setup**: OpenAI-compatible self-hosted provider setup helpers.
- **plugin-sdk/cli-backend**: CLI backend defaults and watchdog constants.
- **plugin-sdk/provider-auth-runtime**: Runtime API-key resolution helpers.
- **plugin-sdk/provider-auth-api-key**: API-key onboarding and profile-write helpers (e.g., `upsertApiKeyProfile`).
- **plugin-sdk/provider-auth-result**: Standard OAuth auth-result builder.
- **plugin-sdk/provider-auth-login**: Shared interactive login helpers.
```

--------------------------------

### Non-interactive Gateway Token Onboarding with Secret Reference

Source: https://docs.openclaw.ai/cli/onboard

Example of non-interactive onboarding using a gateway token stored as an environment variable reference. This requires the OPENCLAW_GATEWAY_TOKEN environment variable to be set.

```bash
export OPENCLAW_GATEWAY_TOKEN="your-token"
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice skip \
  --gateway-auth token \
  --gateway-token-ref-env OPENCLAW_GATEWAY_TOKEN \
  --accept-risk
```

--------------------------------

### Non-interactive Deepseek Onboarding

Source: https://docs.openclaw.ai/providers/deepseek

Configure Deepseek API key non-interactively, suitable for automated setups. Ensure the DEEPSEEK_API_KEY environment variable is set.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice deepseek-api-key \
  --deepseek-api-key "$DEEPSEEK_API_KEY" \
  --skip-health \
  --accept-risk
```

--------------------------------

### Image Editing with Reference Image

Source: https://docs.openclaw.ai/tools/image-generation

Example of how to initiate an image editing task by providing a reference image path. Supported by several providers including OpenAI and Google.

```string
"Generate a watercolor version of this photo" + image: "/path/to/photo.jpg"
```

--------------------------------

### Install Playwright Browsers in Container

Source: https://docs.openclaw.ai/install/docker

Installs Playwright browsers (e.g., Chromium) within the Openclaw Docker container. This is part of enabling power-user container options.

```bash
docker compose run --rm openclaw-cli \
  node /app/node_modules/playwright-core/cli.js install chromium
```

--------------------------------

### Install Node.js and OpenClaw on Droplet

Source: https://docs.openclaw.ai/install/digitalocean

Installs Node.js version 24 and the OpenClaw CLI on a DigitalOcean Droplet. Ensure your Droplet is running Ubuntu 24.04 LTS.

```bash
ssh root@YOUR_DROPLET_IP

apt update && apt upgrade -y

# Install Node.js 24
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt install -y nodejs

# Install OpenClaw
curl -fsSL https://openclaw.ai/install.sh | bash
openclaw --version
```

--------------------------------

### Channel-Specific Configuration Schema

Source: https://docs.openclaw.ai/plugins/sdk-setup

Example of channel-specific configuration. Use this section for settings unique to a particular channel.

```json5
{
  channels: {
    "my-channel": {
      token: "bot-token",
      allowFrom: ["user1", "user2"],
    },
  },
}
```

--------------------------------

### Run Node Host in Foreground

Source: https://docs.openclaw.ai/cli/node

Starts the node host process in the foreground, connecting to the specified gateway host and port.

```bash
openclaw node run --host <gateway-host> --port 18789
```

--------------------------------

### Configure NVIDIA via CLI

Source: https://docs.openclaw.ai/providers/nvidia

Export the API key and initialize the model using the OpenClaw CLI.

```bash
export NVIDIA_API_KEY="nvapi-..."
openclaw onboard --auth-choice skip
openclaw models set nvidia/nvidia/nemotron-3-super-120b-a12b
```

--------------------------------

### Onboard with Z.AI Global Endpoint

Source: https://docs.openclaw.ai/cli/onboard

Use this command for non-interactive onboarding with the Z.AI global endpoint. Ensure your ZAI_API_KEY is set in the environment.

```bash
openclaw onboard --non-interactive \
  --auth-choice zai-coding-global \
  --zai-api-key "$ZAI_API_KEY"
```

--------------------------------

### Start Chrome with Remote Debugging Enabled

Source: https://docs.openclaw.ai/tools/browser-wsl2-windows-remote-cdp-troubleshooting

Use this command to start Chrome on Windows with the remote debugging port enabled, allowing external connections for CDP.

```powershell
chrome.exe --remote-debugging-port=9222
```

--------------------------------

### Configure Gateway Authentication

Source: https://docs.openclaw.ai/help/faq

Example configuration for enabling non-loopback gateway access using token-based authentication.

```json5
{
  gateway: {
    bind: "lan",
    auth: {
      mode: "token",
      token: "replace-me",
    },
  },
}
```

--------------------------------

### Initialize gcloud CLI

Source: https://docs.openclaw.ai/install/gcp

Authenticates the local environment with Google Cloud services.

```bash
gcloud init
gcloud auth login
```

--------------------------------

### Clone and Build OpenClaw from Source

Source: https://docs.openclaw.ai/help/faq

Manually clone the OpenClaw repository from GitHub, install dependencies, and build the project. This is useful for local development and testing.

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm build
```

--------------------------------

### Install and manage OpenClaw Gateway on Windows

Source: https://docs.openclaw.ai/platforms/windows

Commands to install, manage, and check the status of the OpenClaw Gateway service on native Windows. This ensures the gateway runs automatically.

```powershell
openclaw gateway install
```

```powershell
openclaw gateway status --json
```

--------------------------------

### Create Persistent Directories

Source: https://docs.openclaw.ai/install/gcp

Sets up host-side directories to ensure data persists across container restarts.

```bash
mkdir -p ~/.openclaw
mkdir -p ~/.openclaw/workspace
```

--------------------------------

### Plugin Configuration Schema

Source: https://docs.openclaw.ai/plugins/sdk-setup

Example of a plugin configuration object. This structure is validated against the JSON Schema in your manifest.

```json5
{
  plugins: {
    entries: {
      "my-plugin": {
        config: {
          webhookSecret: "abc123",
        },
      },
    },
  },
}
```

--------------------------------

### List available music providers and models

Source: https://docs.openclaw.ai/tools/music-generation

Use the list action to inspect available shared providers and models at runtime.

```text
/tool music_generate action=list
```

--------------------------------

### Dry Run Installation (PowerShell)

Source: https://docs.openclaw.ai/install/installer

Performs a dry run of the OpenClaw installation script using PowerShell. This will print the actions that would be taken without actually performing them.

```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -DryRun
```

--------------------------------

### Onboard with Synthetic API Key

Source: https://docs.openclaw.ai/start/wizard-cli-automation

Onboard with a synthetic provider using an API key. Set the SYNTHETIC_API_KEY environment variable.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice synthetic-api-key \
  --synthetic-api-key "$SYNTHETIC_API_KEY" \
  --gateway-port 18789 \
  --gateway-bind loopback
```

--------------------------------

### Define CLI commands for JSON piping

Source: https://docs.openclaw.ai/tools/lobster

Example CLI commands designed to output and accept JSON for use in a Lobster pipeline.

```bash
inbox list --json
inbox categorize --json
inbox apply --json
```

--------------------------------

### HSTS Header Value Example

Source: https://docs.openclaw.ai/gateway/trusted-proxy-auth

Example of a Strict-Transport-Security header value to be set at the TLS termination point. This header instructs browsers to only communicate with the site using HTTPS.

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

--------------------------------

### Non-interactive CLI Setup for StepFun Plan API Key

Source: https://docs.openclaw.ai/providers/stepfun

Sets up the StepFun Plan provider non-interactively using an API key for international regions. Requires the STEPFUN_API_KEY environment variable to be set.

```bash
openclaw onboard --auth-choice stepfun-plan-api-key-intl --stepfun-api-key "$STEPFUN_API_KEY"
```

--------------------------------

### Install OpenClaw CLI only on Windows

Source: https://docs.openclaw.ai/platforms/windows

These commands install only the OpenClaw CLI on native Windows, without setting up the gateway service. Use `--skip-health` if the local gateway is not accessible.

```powershell
openclaw onboard --non-interactive --skip-health
```

```powershell
openclaw gateway run
```

--------------------------------

### Install DingTalk Plugin

Source: https://docs.openclaw.ai/plugins/community

Install the DingTalk plugin for enterprise robot integration using Stream mode. It supports text, images, and file messages via any DingTalk client.

```bash
openclaw plugins install @largezhou/ddingtalk
```

--------------------------------

### Channel Plugin Package Metadata

Source: https://docs.openclaw.ai/plugins/sdk-setup

Example `package.json` for a channel plugin, including the required `openclaw` field with channel-specific metadata.

```APIDOC
## Channel Plugin Package Metadata

### Description
Configuration for a channel plugin within the `package.json` file.

### Method
N/A (Configuration File)

### Endpoint
N/A

### Parameters
#### Request Body
- **name** (string) - Required - The name of the package.
- **version** (string) - Required - The version of the package.
- **type** (string) - Required - The module type, typically "module".
- **openclaw** (object) - Required - Contains OpenCLAW specific configurations.
  - **extensions** (string[]) - Required - Entry point files for the plugin.
  - **setupEntry** (string) - Optional - Lightweight setup-only entry point.
  - **channel** (object) - Required - Channel catalog metadata.
    - **id** (string) - Required - Unique identifier for the channel.
    - **label** (string) - Required - User-friendly label for the channel.
    - **blurb** (string) - Required - A short description of the channel.

### Request Example
```json
{
  "name": "@myorg/openclaw-my-channel",
  "version": "1.0.0",
  "type": "module",
  "openclaw": {
    "extensions": ["./index.ts"],
    "setupEntry": "./setup-entry.ts",
    "channel": {
      "id": "my-channel",
      "label": "My Channel",
      "blurb": "Short description of the channel."
    }
  }
}
```

### Response
N/A (Configuration File)
```

--------------------------------

### Run OpenClaw Gateway

Source: https://docs.openclaw.ai/channels/irc

Start or restart the OpenClaw gateway service after making configuration changes to apply the new settings.

```bash
openclaw gateway run
```

--------------------------------

### Verify OpenClaw Environment

Source: https://docs.openclaw.ai/gateway/troubleshooting

Use these commands to check the installed version, run diagnostic checks, and verify the gateway status during migration or troubleshooting.

```bash
openclaw --version
openclaw doctor
openclaw gateway status
```

--------------------------------

### Start Gateway with File Watcher

Source: https://docs.openclaw.ai/help/debugging

Run the gateway under the file watcher for fast iteration. This command restarts the gateway on changes to relevant source and configuration files.

```bash
pnpm gateway:watch
```

```bash
node scripts/watch-node.mjs gateway --force
```

--------------------------------

### Secure Baseline Configuration

Source: https://docs.openclaw.ai/gateway/security

A recommended starting configuration that restricts the gateway to local loopback, requires authentication, and enforces channel-specific security policies.

```json5
{
  gateway: {
    mode: "local",
    bind: "loopback",
    port: 18789,
    auth: { mode: "token", token: "your-long-random-token" },
  },
  channels: {
    whatsapp: {
      dmPolicy: "pairing",
      groups: { "*": { requireMention: true } },
    },
  },
}
```

--------------------------------

### Start Gateway and Approve Pairing

Source: https://docs.openclaw.ai/channels/telegram

Start the OpenCLAW gateway and then list and approve Telegram pairing codes. Pairing codes expire after 1 hour, so ensure timely approval.

```bash
openclaw gateway
openclaw pairing list telegram
openclaw pairing approve telegram <CODE>
```

--------------------------------

### Login with Provider and Default Setting

Source: https://docs.openclaw.ai/cli/models

Logs into a specific provider and sets it as the default authentication profile.

```bash
openclaw models auth login --provider openai-codex --set-default
```

--------------------------------

### Rich OpenClaw Plugin Manifest Example

Source: https://docs.openclaw.ai/plugins/manifest

A comprehensive `openclaw.plugin.json` includes details like name, description, version, supported providers, model support, CLI backends, authentication environment variables and aliases, channel-specific environment variables, provider authentication choices, and UI hints for configuration fields.

```json
{
  "id": "openrouter",
  "name": "OpenRouter",
  "description": "OpenRouter provider plugin",
  "version": "1.0.0",
  "providers": ["openrouter"],
  "modelSupport": {
    "modelPrefixes": ["router-"]
  },
  "cliBackends": ["openrouter-cli"],
  "providerAuthEnvVars": {
    "openrouter": ["OPENROUTER_API_KEY"]
  },
  "providerAuthAliases": {
    "openrouter-coding": "openrouter"
  },
  "channelEnvVars": {
    "openrouter-chatops": ["OPENROUTER_CHATOPS_TOKEN"]
  },
  "providerAuthChoices": [
    {
      "provider": "openrouter",
      "method": "api-key",
      "choiceId": "openrouter-api-key",
      "choiceLabel": "OpenRouter API key",
      "groupId": "openrouter",
      "groupLabel": "OpenRouter",
      "optionKey": "openrouterApiKey",
      "cliFlag": "--openrouter-api-key",
      "cliOption": "--openrouter-api-key <key>",
      "cliDescription": "OpenRouter API key",
      "onboardingScopes": ["text-inference"]
    }
  ],
  "uiHints": {
    "apiKey": {
      "label": "API key",
      "placeholder": "sk-or-v1-ப்படாத",
      "sensitive": true
    }
  },
  "configSchema": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "apiKey": {
        "type": "string"
      }
    }
  }
}
```

--------------------------------

### Update and Check Openclaw CLI

Source: https://docs.openclaw.ai/install/exe-dev

Install the latest version of the Openclaw CLI, restart the gateway, and check the system's health.

```bash
npm i -g openclaw@latest
```

```bash
openclaw doctor
```

```bash
openclaw gateway restart
```

```bash
openclaw health
```

--------------------------------

### Install WeCom Plugin

Source: https://docs.openclaw.ai/plugins/community

Install the WeCom channel plugin for OpenClaw. This plugin supports direct messages, group chats, streaming replies, proactive messaging, and various media types.

```bash
openclaw plugins install @wecom/wecom-openclaw-plugin
```

--------------------------------

### Onboard OpenAI Codex via CLI

Source: https://docs.openclaw.ai/providers/openai

Initiate the Codex OAuth onboarding process using the OpenClaw CLI to authenticate with ChatGPT/Codex.

```bash
# Run Codex OAuth in the wizard
openclaw onboard --auth-choice openai-codex

# Or run OAuth directly
openclaw models auth login --provider openai-codex
```

--------------------------------

### Configure Synthetic Provider in OpenClaw

Source: https://docs.openclaw.ai/providers/synthetic

This JSON configuration example shows how to set up the Synthetic provider, including environment variables, default agent models, and detailed provider-specific settings like base URL and API type. Ensure the `baseUrl` is correctly set to avoid issues with the Anthropic client appending `/v1`.

```json
{
  env: { SYNTHETIC_API_KEY: "sk-..." },
  agents: {
    defaults: {
      model: { primary: "synthetic/hf:MiniMaxAI/MiniMax-M2.5" },
      models: { "synthetic/hf:MiniMaxAI/MiniMax-M2.5": { alias: "MiniMax M2.5" } },
    },
  },
  models: {
    mode: "merge",
    providers: {
      synthetic: {
        baseUrl: "https://api.synthetic.new/anthropic",
        apiKey: "${SYNTHETIC_API_KEY}",
        api: "anthropic-messages",
        models: [
          {
            id: "hf:MiniMaxAI/MiniMax-M2.5",
            name: "MiniMax M2.5",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 192000,
            maxTokens: 65536,
          },
        ],
      },
    },
  },
}
```

--------------------------------

### Check Xcode and Swift Versions

Source: https://docs.openclaw.ai/platforms/mac/dev-setup

Verifies the installed Xcode and Swift toolchain versions. Essential for ensuring compatibility with the macOS app build process. Requires Xcode and Swift to be installed.

```bash
xcodebuild -version
```

```bash
xcrun swift --version
```

--------------------------------

### Matrix Environment Variables for Specific Account 'ops'

Source: https://docs.openclaw.ai/channels/matrix

Example of using account-scoped environment variables for the 'ops' Matrix account.

```bash
MATRIX_OPS_HOMESERVER
MATRIX_OPS_ACCESS_TOKEN
```

--------------------------------

### Create Local Nix Flake

Source: https://docs.openclaw.ai/install/nix

Use the agent-first template from the nix-openclaw repo to create a local flake for your OpenClaw installation.

```bash
mkdir -p ~/code/openclaw-local
# Copy templates/agent-first/flake.nix from the nix-openclaw repo
```

--------------------------------

### Build OpenClaw Sandbox Image

Source: https://docs.openclaw.ai/install/ansible

Builds the Docker sandbox image if it is missing. This requires navigating to the correct directory and running the setup script as the 'openclaw' user.

```bash
# Build sandbox image if missing
cd /opt/openclaw/openclaw
sudo -u openclaw ./scripts/sandbox-setup.sh
```

--------------------------------

### Optimize Dockerfile for Faster Rebuilds

Source: https://docs.openclaw.ai/install/docker

Optimizes a Dockerfile to leverage layer caching for faster rebuilds. It installs Bun, enables Corepack, and installs dependencies before copying the rest of the application code.

```dockerfile
FROM node:24-bookworm
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY ui/package.json ./ui/package.json
COPY scripts ./scripts
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
RUN pnpm ui:install
RUN pnpm ui:build
ENV NODE_ENV=production
CMD ["node","dist/index.js"]
```

--------------------------------

### Non-interactive CLI Setup for StepFun Standard API Key

Source: https://docs.openclaw.ai/providers/stepfun

Sets up the StepFun provider non-interactively using a standard API key for international regions. Requires the STEPFUN_API_KEY environment variable to be set.

```bash
openclaw onboard --auth-choice stepfun-standard-api-key-intl --stepfun-api-key "$STEPFUN_API_KEY"
```

--------------------------------

### Manage Gateway Container with Host CLI

Source: https://docs.openclaw.ai/install/podman

Examples of OpenClaw CLI commands that will automatically run inside the container once OPENCLAW_CONTAINER is set.

```bash
openclaw dashboard --no-open
```

```bash
openclaw gateway status --deep   # includes extra service scan
```

```bash
openclaw doctor
```

```bash
openclaw channels login
```

--------------------------------

### Channel Selection Example

Source: https://docs.openclaw.ai/cli/message

Specify the target channel using the `--channel` flag. This is required if multiple channels are configured. Supported values include discord, googlechat, imessage, matrix, mattermost, msteams, signal, slack, telegram, and whatsapp.

```bash
openclaw message --channel discord send "Hello, world!"
```

--------------------------------

### Check Current OpenClaw Update Status

Source: https://docs.openclaw.ai/install/development-channels

Run `openclaw update status` to view details about the active release channel, installation type (git or package), current version, and the source of the installation.

```bash
openclaw update status
```

--------------------------------

### Configure Tool Groups in Sandbox Policy

Source: https://docs.openclaw.ai/gateway/sandbox-vs-tool-policy-vs-elevated

Define sandbox tool policies using shorthand group entries. This example allows tools from runtime, file system, sessions, and memory groups.

```json5
{
  tools: {
    sandbox: {
      tools: {
        allow: ["group:runtime", "group:fs", "group:sessions", "group:memory"],
      },
    },
  },
}
```

--------------------------------

### Run Media Live Harness

Source: https://docs.openclaw.ai/help/testing

Executes the shared image, music, and video live suites. This command automatically loads provider environment variables from ~/.profile and narrows each suite to providers that currently have usable authentication by default. It reuses scripts/test-live.mjs for consistent heartbeat and quiet-mode behavior.

```bash
pnpm test:live:media
```

```bash
pnpm test:live:media image video --providers openai,google,minimax
```

```bash
pnpm test:live:media video --video-providers openai,runway --all-providers
```

```bash
pnpm test:live:media music --quiet
```

--------------------------------

### Pomerium Route Configuration Example

Source: https://docs.openclaw.ai/gateway/trusted-proxy-auth

Example Pomerium route configuration to direct traffic to OpenClaw. This snippet shows how to define the source, destination, and access policies, including passing identity headers.

```yaml
routes:
  - from: https://openclaw.example.com
    to: http://openclaw-gateway:18789
    policy:
      - allow:
          or:
            - email:
                is: nick@example.com
    pass_identity_headers: true
```

--------------------------------

### Restart macOS Development Environment

Source: https://docs.openclaw.ai/platforms/mac/xpc

Command to kill existing instances, rebuild the Swift package, and bootstrap the LaunchAgent.

```bash
SIGN_IDENTITY="Apple Development: <Developer Name> (<TEAMID>)" scripts/restart-mac.sh
```

--------------------------------

### Enable and Configure Plugins

Source: https://docs.openclaw.ai/gateway/configuration-reference

Use this JSON structure to enable plugins, specify allowed and denied plugins, define loading paths, and configure individual plugin entries. Configuration changes require a gateway restart.

```json
{
  plugins: {
    enabled: true,
    allow: ["voice-call"],
    deny: [],
    load: {
      paths: ["~/Projects/oss/voice-call-extension"],
    },
    entries: {
      "voice-call": {
        enabled: true,
        hooks: {
          allowPromptInjection: false,
        },
        config: { provider: "twilio" },
      },
    },
  },
}
```

--------------------------------

### Build and test with Bun

Source: https://docs.openclaw.ai/install/bun

Commands to execute build and test scripts using the Bun runtime.

```sh
bun run build
bun run vitest run
```

--------------------------------

### Configure Deferred Loading for Channel Plugins

Source: https://docs.openclaw.ai/plugins/sdk-setup

Enables deferred loading by setting deferConfiguredChannelFullLoadUntilAfterListen to true in the openclaw configuration. Ensure setupEntry registers all necessary gateway capabilities before the gateway starts listening.

```json
{
  "openclaw": {
    "extensions": ["./index.ts"],
    "setupEntry": "./setup-entry.ts",
    "startup": {
      "deferConfiguredChannelFullLoadUntilAfterListen": true
    }
  }
}
```

--------------------------------

### Launch Control Dashboard

Source: https://docs.openclaw.ai/start/getting-started

Open the web-based Control UI in the default browser.

```bash
openclaw dashboard
```

--------------------------------

### OpenClaw Onboard MiniMax API Key

Source: https://docs.openclaw.ai/providers/minimax

Use these commands for interactive onboarding with MiniMax M2.7 via API key. Choose the global or China-specific endpoint.

```bash
openclaw onboard --auth-choice minimax-global-api
# or
openclaw onboard --auth-choice minimax-cn-api
```

--------------------------------

### Create WireGuard Configuration

Source: https://docs.openclaw.ai/install/fly

Generate a WireGuard configuration file. This is a one-time setup step to enable access to your private deployment via a WireGuard VPN.

```bash
fly wireguard create
```

--------------------------------

### Non-Interactive Volcengine Onboarding

Source: https://docs.openclaw.ai/providers/volcengine

Perform Volcengine onboarding without interactive prompts, specifying the API key directly. Ensure the VOLCANO_ENGINE_API_KEY environment variable is set.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice volcengine-api-key \
  --volcengine-api-key "$VOLCANO_ENGINE_API_KEY"
```

--------------------------------

### Build and test plugin

Source: https://docs.openclaw.ai/plugins/sdk-migration

Execute the build and test suite for the plugin.

```bash
pnpm build
pnpm test -- my-plugin/
```

--------------------------------

### OpenClaw CLI Setup for Z.AI Authentication

Source: https://docs.openclaw.ai/providers/glm

Use these commands to onboard OpenClaw with Z.AI authentication. The `zai-api-key` option automatically detects the endpoint, while regional options force specific API surfaces.

```bash
# Generic API-key setup with endpoint auto-detection
openclaw onboard --auth-choice zai-api-key
```

```bash
# Coding Plan Global, recommended for Coding Plan users
openclaw onboard --auth-choice zai-coding-global
```

```bash
# Coding Plan CN (China region), recommended for Coding Plan users
openclaw onboard --auth-choice zai-coding-cn
```

```bash
# General API
openclaw onboard --auth-choice zai-global
```

```bash
# General API CN (China region)
openclaw onboard --auth-choice zai-cn
```

--------------------------------

### Matrix Setup with Password Authentication

Source: https://docs.openclaw.ai/channels/matrix

This configuration enables the Matrix channel using a user ID and password. The token is cached after the initial login. Remember to replace `"replace-me"` with your actual password.

```json5
{
  channels: {
    matrix: {
      enabled: true,
      homeserver: "https://matrix.example.org",
      userId: "@bot:example.org",
      password: "replace-me", // pragma: allowlist secret
      deviceName: "OpenClaw Gateway",
    },
  },
}
```

--------------------------------

### Configure Gateway and Skills

Source: https://docs.openclaw.ai/gateway/configuration-examples

Initial configuration snippet for gateway connectivity and skill management.

```json5
      mode: "token",
      token: "gateway-token",
      allowTailscale: true,
    },
    tailscale: { mode: "serve", resetOnExit: false },
    remote: { url: "ws://gateway.tailnet:18789", token: "remote-token" },
    reload: { mode: "hybrid", debounceMs: 300 },
  },

  skills: {
    allowBundled: ["gemini", "peekaboo"],
    load: {
      extraDirs: ["~/Projects/agent-scripts/skills"],
    },
    install: {
      preferBrew: true,
      nodeManager: "npm", // npm | pnpm | yarn | bun
    },
    entries: {
      "image-lab": {
        enabled: true,
        apiKey: "GEMINI_KEY_HERE",
        env: { GEMINI_API_KEY: "GEMINI_KEY_HERE" },
      },
      peekaboo: { enabled: true },
    },
  },
}
```

--------------------------------

### Sandbox Configuration Example

Source: https://docs.openclaw.ai/cli/sandbox

This JSON configuration defines default sandbox settings, including mode, backend, scope, Docker image, and pruning policies. Per-agent overrides can be set in `agents.list[].sandbox`.

```json
{
  "agents": {
    "defaults": {
      "sandbox": {
        "mode": "all", // off, non-main, all
        "backend": "docker", // docker, ssh, openshell
        "scope": "agent", // session, agent, shared
        "docker": {
          "image": "openclaw-sandbox:bookworm-slim",
          "containerPrefix": "openclaw-sbx-",
          // ... more Docker options
        },
        "prune": {
          "idleHours": 24, // Auto-prune after 24h idle
          "maxAgeDays": 7, // Auto-prune after 7 days
        },
      },
    },
  },
}
```

--------------------------------

### Send Messages and Cards via Agent Tool

Source: https://docs.openclaw.ai/channels/msteams

Examples for sending text messages to users and Adaptive Cards to conversations using the agent tool.

```json5
{
  action: "send",
  channel: "msteams",
  target: "user:John Smith",
  message: "Hello!",
}
```

```json5
{
  action: "send",
  channel: "msteams",
  target: "conversation:19:abc...@thread.tacv2",
  card: {
    type: "AdaptiveCard",
    version: "1.5",
    body: [{ type: "TextBlock", text: "Hello" }],
  },
}
```

--------------------------------

### List WSL distributions

Source: https://docs.openclaw.ai/platforms/windows

Lists all installed WSL distributions on your Windows system. Use this to find the correct name for your distribution when creating boot tasks.

```powershell
wsl --list --verbose
```

--------------------------------

### Configure Command

Source: https://docs.openclaw.ai/cli/index

The `configure` command launches an interactive configuration wizard for models, channels, skills, and the gateway.

```APIDOC
## configure

### Description
Interactive configuration wizard for models, channels, skills, gateway.

### Method
CLI Command

### Endpoint
N/A (CLI Command)

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Options
* `--section <section>`: Repeatable option to limit the wizard to specific sections.
```

--------------------------------

### Configure WebSocket logging verbosity

Source: https://docs.openclaw.ai/logging

Launch the gateway with varying levels of WebSocket protocol logging.

```bash
openclaw gateway
openclaw gateway --verbose --ws-log compact
openclaw gateway --verbose --ws-log full
```

--------------------------------

### Add a New Agent with Specific Configurations

Source: https://docs.openclaw.ai/start/wizard-cli-automation

Use this command to create a new agent with a dedicated workspace, model, and bindings. The `--non-interactive` flag allows for automated setup. Ensure the specified model and binding are correctly configured.

```bash
openclaw agents add work \
  --workspace ~/.openclaw/workspace-work \
  --model openai/gpt-5.4 \
  --bind whatsapp:biz \
  --non-interactive \
  --json
```

--------------------------------

### webhooks gmail

Source: https://docs.openclaw.ai/cli

Manages Gmail Pub/Sub hook setup and execution.

```APIDOC
## `webhooks gmail setup`

### Description
Configures the Gmail watch plus the OpenClaw-facing push path.

### Method
`setup`

### Endpoint
`webhooks gmail setup`

### Parameters
#### Path Parameters
None

#### Query Parameters
- **--account** (string) - Required - The email account to set up.
- **--project** (string) - Optional - The Google Cloud project ID.
- **--topic** (string) - Optional - The Pub/Sub topic name.
- **--subscription** (string) - Optional - The Pub/Sub subscription name.
- **--label** (string) - Optional - The Gmail label to watch.
- **--hook-url** (string) - Optional - The URL for the webhook.
- **--hook-token** (string) - Optional - Token for webhook authentication.
- **--push-token** (string) - Optional - Token for push notifications.
- **--bind** (string) - Optional - Binding specification.
- **--port** (integer) - Optional - Port number for the webhook server.
- **--path** (string) - Optional - Path for the webhook endpoint.
- **--include-body** (boolean) - Optional - Whether to include the message body.
- **--max-bytes** (integer) - Optional - Maximum message size in bytes.
- **--renew-minutes** (integer) - Optional - Renewal period in minutes.
- **--tailscale** (boolean) - Optional - Use Tailscale for networking.
- **--tailscale-path** (string) - Optional - Path to Tailscale executable.
- **--tailscale-target** (string) - Optional - Tailscale target.
- **--push-endpoint** (string) - Optional - Push notification endpoint.
- **--json** (boolean) - Optional - Output in JSON format.

### Request Example
```bash
openclaw webhooks gmail setup --account user@example.com --hook-url https://example.com/webhook
```

### Response
None explicitly defined, typically indicates success or failure via exit code.
```

```APIDOC
## `webhooks gmail run`

### Description
Starts the local Gmail watcher/renew loop with optional runtime overrides.

### Method
`run`

### Endpoint
`webhooks gmail run`

### Parameters
#### Path Parameters
None

#### Query Parameters
- **--account** (string) - Required - The email account to watch.
- **--project** (string) - Optional - The Google Cloud project ID.
- **--topic** (string) - Optional - The Pub/Sub topic name.
- **--subscription** (string) - Optional - The Pub/Sub subscription name.
- **--label** (string) - Optional - The Gmail label to watch.
- **--hook-url** (string) - Optional - The URL for the webhook.
- **--hook-token** (string) - Optional - Token for webhook authentication.
- **--push-token** (string) - Optional - Token for push notifications.
- **--bind** (string) - Optional - Binding specification.
- **--port** (integer) - Optional - Port number for the webhook server.
- **--path** (string) - Optional - Path for the webhook endpoint.
- **--include-body** (boolean) - Optional - Whether to include the message body.
- **--max-bytes** (integer) - Optional - Maximum message size in bytes.
- **--renew-minutes** (integer) - Optional - Renewal period in minutes.
- **--tailscale** (boolean) - Optional - Use Tailscale for networking.
- **--tailscale-path** (string) - Optional - Path to Tailscale executable.
- **--tailscale-target** (string) - Optional - Tailscale target.
- **--push-endpoint** (string) - Optional - Push notification endpoint.
- **--json** (boolean) - Optional - Output in JSON format.

### Request Example
```bash
openclaw webhooks gmail run --account user@example.com --renew-minutes 60
```

### Response
None explicitly defined, typically indicates success or failure via exit code.
```

--------------------------------

### Configure Swap Memory

Source: https://docs.openclaw.ai/install/raspberry-pi

Create and enable a 2GB swap file to improve stability on low-RAM devices.

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Reduce swappiness for low-RAM devices
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

--------------------------------

### Onboard with Z.AI API Key

Source: https://docs.openclaw.ai/start/wizard-cli-automation

Integrate with Z.AI by providing your API key. The ZAI_API_KEY environment variable should be configured.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice zai-api-key \
  --zai-api-key "$ZAI_API_KEY" \
  --gateway-port 18789 \
  --gateway-bind loopback
```

--------------------------------

### POST /v1/responses (Non-streaming)

Source: https://docs.openclaw.ai/gateway/openresponses-http-api

Example of making a non-streaming request to the /v1/responses endpoint.

```APIDOC
## POST /v1/responses (Non-streaming)

### Description

Submits a request to generate a response without streaming.

### Method

POST

### Endpoint

`/v1/responses`

### Request Body

- **model** (string) - Required - The model to use for generation.
- **input** (string) - Required - The input prompt or query.

### Request Example

```bash
curl -sS http://127.0.0.1:18789/v1/responses \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'x-openclaw-agent-id: main' \
  -d '{
    "model": "openclaw",
    "input": "hi"
  }'
```
```

--------------------------------

### View project file structure

Source: https://docs.openclaw.ai/install/kubernetes

Overview of the scripts and manifest files located in the k8s directory.

```text
scripts/k8s/
├── deploy.sh                   # Creates namespace + secret, deploys via kustomize
├── create-kind.sh              # Local Kind cluster (auto-detects docker/podman)
└── manifests/
    ├── kustomization.yaml      # Kustomize base
    ├── configmap.yaml          # openclaw.json + AGENTS.md
    ├── deployment.yaml         # Pod spec with security hardening
    ├── pvc.yaml                # 10Gi persistent storage
    └── service.yaml            # ClusterIP on 18789
```

--------------------------------

### System Event Timestamp

Source: https://docs.openclaw.ai/date-time

Example of a system event line prefixed with a timestamp.

```text
System: [2026-01-12 12:19:17 PST] Model switched.
```

--------------------------------

### List VM image versions

Source: https://docs.openclaw.ai/install/azure

Retrieves available image versions for pinning specific releases.

```bash
az vm image list \
  --publisher Canonical --offer ubuntu-24_04-lts \
  --sku server --all -o table
```

--------------------------------

### Start ngrok Tunnel for Local Development

Source: https://docs.openclaw.ai/channels/msteams

Use ngrok to create a tunnel to your local development environment, allowing Teams to reach your webhook. Replace 3978 with your local server port if different.

```bash
ngrok http 3978
# Copy the https URL, e.g., https://abc123.ngrok.io
```

--------------------------------

### Configure Custom Control UI

Source: https://docs.openclaw.ai/start/getting-started

Commands and configuration for mounting a custom dashboard build.

```bash
mkdir -p "$HOME/.openclaw/control-ui-custom"
# Copy your built static files into that directory.
```

```json
{
  "gateway": {
    "controlUi": {
      "enabled": true,
      "root": "$HOME/.openclaw/control-ui-custom"
    }
  }
}
```

```bash
openclaw gateway restart
openclaw dashboard
```

--------------------------------

### Load macOS Launch Agent

Source: https://docs.openclaw.ai/gateway/remote-gateway-readme

Use the launchctl command to load the created PLIST file, registering it as a Launch Agent. This will start the tunnel automatically on login and restart it if it fails.

```bash
launchctl bootstrap gui/$UID ~/Library/LaunchAgents/ai.openclaw.ssh-tunnel.plist
```

--------------------------------

### approvals get

Source: https://docs.openclaw.ai/cli/index

Fetches the current execution approvals snapshot and effective policy.

```APIDOC
## approvals get

### Description
Fetch the exec approvals snapshot and effective policy.

### Parameters
#### Options
- **--node** (node) - Optional - Target node
- **--gateway** (flag) - Optional - Target gateway
- **--json** (flag) - Optional - Output as JSON
```

--------------------------------

### Generate Mobile Pairing QR and Setup Codes

Source: https://docs.openclaw.ai/cli/qr

Use these commands to generate pairing information for mobile devices. The output can be customized using flags for JSON format, remote URLs, or setup-code-only output.

```bash
openclaw qr
openclaw qr --setup-code-only
openclaw qr --json
openclaw qr --remote
openclaw qr --url wss://gateway.example/ws
```

--------------------------------

### Initialize a new Git repository for the workspace

Source: https://docs.openclaw.ai/concepts/agent-workspace

Run these commands within the workspace directory to initialize Git and commit the initial set of configuration files.

```bash
cd ~/.openclaw/workspace
git init
git add AGENTS.md SOUL.md TOOLS.md IDENTITY.md USER.md HEARTBEAT.md memory/
git commit -m "Add agent workspace"
```

--------------------------------

### Manage OpenClaw Plugins

Source: https://docs.openclaw.ai/tools/clawhub

Commands for installing and updating plugins from ClawHub or npm-safe sources.

```bash
openclaw plugins install clawhub:<package>
openclaw plugins update --all
```

```bash
openclaw plugins install openclaw-codex-app-server
```

--------------------------------

### Manage OpenClaw skills

Source: https://docs.openclaw.ai/help/faq

Commands to install or update skills within the active workspace.

```bash
openclaw skills install <skill-slug>
openclaw skills update --all
```

--------------------------------

### POST config.apply

Source: https://docs.openclaw.ai/gateway/configuration

Replaces the entire configuration and restarts the Gateway.

```APIDOC
## POST config.apply

### Description
Validates and writes the full configuration and restarts the Gateway in one step. Note that this replaces the entire configuration.

### Method
POST

### Endpoint
config.apply

### Parameters
#### Request Body
- **raw** (string) - Required - JSON5 payload for the entire config
- **baseHash** (string) - Optional - Config hash from config.get (required when config exists)
- **sessionKey** (string) - Optional - Session key for the post-restart wake-up ping
- **note** (string) - Optional - Note for the restart sentinel
- **restartDelayMs** (integer) - Optional - Delay before restart (default 2000)

### Request Example
{
  "raw": "{ agents: { defaults: { workspace: \"~/.openclaw/workspace\" } } }",
  "baseHash": "<hash>",
  "sessionKey": "agent:main:whatsapp:direct:+15555550123"
}
```

--------------------------------

### Rollback via Source Commit

Source: https://docs.openclaw.ai/install/updating

Pin to a specific git commit for source-based installations.

```bash
git fetch origin
git checkout "$(git rev-list -n 1 --before=\"2026-01-01\" origin/main)"
pnpm install && pnpm build
openclaw gateway restart
```

--------------------------------

### Increase VM Memory in fly.toml

Source: https://docs.openclaw.ai/install/fly

Example of how to increase the VM memory allocation in `fly.toml` to address OOM (Out Of Memory) errors. 2GB is recommended for stable operation.

```toml
[[vm]]
  memory = "2048mb"
```

--------------------------------

### Session Management for Docker

Source: https://docs.openclaw.ai/install/gcp

Commands to refresh the shell session and verify Docker installation.

```bash
exit
```

```bash
gcloud compute ssh openclaw-gateway --zone=us-central1-a
```

```bash
docker --version
docker compose version
```

--------------------------------

### Skills Management API

Source: https://docs.openclaw.ai/cli

Endpoints for searching, installing, updating, and inspecting skills from ClawHub.

```APIDOC
## skills

### Description
List and inspect available skills plus readiness info.

### Subcommands
- **skills search [query...]**: search ClawHub skills.
- **skills install <slug>**: install a skill from ClawHub into the active workspace.
- **skills update <slug|--all>**: update tracked ClawHub skills.
- **skills list**: list skills.
- **skills info <name>**: show details for one skill.
- **skills check**: summary of ready vs missing requirements.
```

--------------------------------

### Onboard with Gemini API Key

Source: https://docs.openclaw.ai/start/wizard-cli-automation

Onboard with Gemini using its API key. Set the GEMINI_API_KEY environment variable before running this command.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice gemini-api-key \
  --gemini-api-key "$GEMINI_API_KEY" \
  --gateway-port 18789 \
  --gateway-bind loopback
```

--------------------------------

### Plugins Management API

Source: https://docs.openclaw.ai/cli

Commands for discovering, inspecting, installing, managing, and troubleshooting plugins.

```APIDOC
## Plugins Management

Manage extensions and their configuration.

### List Plugins

Discover available plugins.

**Command:** `openclaw plugins list [--json]`

### Inspect Plugin

Show detailed information for a specific plugin.

**Command:** `openclaw plugins inspect <id>`

### Install Plugin

Install a plugin from a local path, a .tgz archive, an npm specification, or a marketplace.

**Command:** `openclaw plugins install <path|.tgz|npm-spec|plugin@marketplace> [--force]`

### List Marketplace Plugins

List entries available in a specific marketplace before installation.

**Command:** `openclaw plugins marketplace list <marketplace>`

### Enable/Disable Plugin

Toggle the enabled status of a plugin.

**Command:** `openclaw plugins enable <id>` or `openclaw plugins disable <id>`

### Doctor Plugin

Report any errors encountered during plugin loading.

**Command:** `openclaw plugins doctor`

**Note:** Most plugin changes require a gateway restart. Refer to [/tools/plugin](/tools/plugin) for more details.
```

--------------------------------

### Create Nextcloud Talk Bot

Source: https://docs.openclaw.ai/channels/nextcloud-talk

Command to install a bot on your Nextcloud server. Replace placeholders with your bot name, shared secret, and webhook URL. The `--feature reaction` flag enables reaction support.

```bash
./occ talk:bot:install "OpenClaw" "<shared-secret>" "<webhook-url>" --feature reaction
```

--------------------------------

### Render Location with Caption

Source: https://docs.openclaw.ai/channels/location

Example of how a location pin is rendered when accompanied by a user caption.

```text
📍 48.858844, 2.294351 ±12m
Meet here
```

--------------------------------

### List Available Models

Source: https://docs.openclaw.ai/help/testing

Commands to display the available models and their provider IDs for testing.

```bash
openclaw models list
openclaw models list --json
```

--------------------------------

### List Available Models

Source: https://docs.openclaw.ai/cli

List available models with options to filter by provider, local availability, or display format.

```bash
openclaw models list
```

```bash
openclaw models list --all
```

```bash
openclaw models list --local
```

```bash
openclaw models list --provider <name>
```

```bash
openclaw models list --json
```

```bash
openclaw models list --plain
```

--------------------------------

### Configure Web Search and Fetch Tools

Source: https://docs.openclaw.ai/gateway/configuration-reference

Set up `tools.web` for search and fetch operations. Configure API keys, result limits, timeouts, caching, and character/byte limits for fetching content.

```json5
{
  tools: {
    web: {
      search: {
        enabled: true,
        apiKey: "brave_api_key", // or BRAVE_API_KEY env
        maxResults: 5,
        timeoutSeconds: 30,
        cacheTtlMinutes: 15,
      },
      fetch: {
        enabled: true,
        provider: "firecrawl", // optional; omit for auto-detect
        maxChars: 50000,
        maxCharsCap: 50000,
        maxResponseBytes: 2000000,
        timeoutSeconds: 30,
        cacheTtlMinutes: 15,
        maxRedirects: 3,
        readability: true,
        userAgent: "custom-ua",
      },
    },
  },
}
```

--------------------------------

### Systemd Service for Auto-Starting OpenClaw Browser

Source: https://docs.openclaw.ai/tools/browser-linux-troubleshooting

Create a systemd user service to automatically start the Chromium browser for OpenClaw. This ensures the browser is running when needed, especially with attach-only mode.

```ini
# ~/.config/systemd/user/openclaw-browser.service
[Unit]
Description=OpenClaw Browser (Chrome CDP)
After=network.target

[Service]
ExecStart=/snap/bin/chromium --headless --no-sandbox --disable-gpu --remote-debugging-port=18800 --user-data-dir=%h/.openclaw/browser/openclaw/user-data about:blank
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
```

--------------------------------

### Webhooks API

Source: https://docs.openclaw.ai/cli

Endpoints for webhook helpers, specifically Gmail Pub/Sub setup and runner.

```APIDOC
## webhooks

### Description
Webhook helpers for Gmail Pub/Sub setup and runner.

### Subcommands
- **webhooks gmail setup**: Setup Gmail webhooks.
- **webhooks gmail run**: Run Gmail webhooks.
```

--------------------------------

### Launch WebChat for Testing

Source: https://docs.openclaw.ai/platforms/mac/webchat

Execute the application binary with the --webchat flag to trigger auto-open for testing purposes.

```bash
dist/OpenClaw.app/Contents/MacOS/OpenClaw --webchat
```

--------------------------------

### Configure Web Search and Fetch Providers

Source: https://docs.openclaw.ai/help/faq

Configure web search and fetch providers within the tools section. Legacy paths are supported for compatibility but new configurations should use the `plugins.entries` structure.

```json
tools: {
  web: {
    search: {
      enabled: true,
      provider: "brave",
      maxResults: 5,
    },
    fetch: {
      enabled: true,
      provider: "firecrawl", // optional; omit for auto-detect
    },
  },
}
```

--------------------------------

### Common Openclaw Follow-up Commands

Source: https://docs.openclaw.ai/cli/onboard

These commands are typically used after initial onboarding for configuration and agent management.

```bash
openclaw configure
```

```bash
openclaw agents add <name>
```

--------------------------------

### Configure Exa Plugin

Source: https://docs.openclaw.ai/tools/exa-search

Define the Exa API key and set the web search provider in the configuration file.

```json5
{
  plugins: {
    entries: {
      exa: {
        config: {
          webSearch: {
            apiKey: "exa-...", // optional if EXA_API_KEY is set
          },
        },
      },
    },
  },
  tools: {
    web: {
      search: {
        provider: "exa",
      },
    },
  },
}
```

--------------------------------

### Manage OpenClaw Skills

Source: https://docs.openclaw.ai/tools/clawhub

Commands for searching, installing, and updating skills within an OpenClaw workspace.

```bash
openclaw skills search "calendar"
openclaw skills install <skill-slug>
openclaw skills update --all
```

--------------------------------

### Configure Control UI settings

Source: https://docs.openclaw.ai/web

Enable the Control UI and optionally set a custom base path in the gateway configuration.

```json5
{
  gateway: {
    controlUi: { enabled: true, basePath: "/openclaw" }, // basePath optional
  },
}
```

--------------------------------

### Create macOS LaunchAgent for Auto-Start

Source: https://docs.openclaw.ai/providers/claude-max-api-proxy

This script creates a LaunchAgent plist file in the user's Library directory and then bootstraps it to ensure the claude-max-api proxy runs automatically on login.

```bash
cat > ~/Library/LaunchAgents/com.claude-max-api.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.claude-max-api</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/node</string>
    <string>/usr/local/lib/node_modules/claude-max-api-proxy/dist/server/standalone.js</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>/usr/local/bin:/opt/homebrew/bin:~/.local/bin:/usr/bin:/bin</string>
  </dict>
</dict>
</plist>
EOF

launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.claude-max-api.plist
```

--------------------------------

### Voice Call API

Source: https://docs.openclaw.ai/cli/index

Utilities for managing voice calls, available when the voice-call plugin is installed.

```APIDOC
## voicecall call

### Description
Initiate a voice call to a phone number.

### Parameters
#### Query Parameters
- **--to** (string) - Required - Phone number
- **--message** (string) - Required - Message text
- **--mode** (string) - Optional - Mode (notify or conversation)
```

--------------------------------

### OpenClaw Update Commands

Source: https://docs.openclaw.ai/cli/index

Update the installed OpenClaw CLI to the latest version or a specific channel/tag.

```APIDOC
## `update`

Update the installed CLI.

### Root options:

* `--json`
* `--no-restart`
* `--dry-run`
* `--channel <stable|beta|dev>`
* `--tag <dist-tag|version|spec>`
* `--timeout <seconds>`
* `--yes`

### Subcommands:

* `update status`
* `update wizard`

`update status` options:

* `--json`
* `--timeout <seconds>`

`update wizard` options:

* `--timeout <seconds>`

### Notes:

* `openclaw --update` rewrites to `openclaw update`.
```

--------------------------------

### Create configuration file via SSH

Source: https://docs.openclaw.ai/install/fly

Accesses the remote machine to initialize the application configuration file.

```bash
fly ssh console
```

```bash
mkdir -p /data
cat > /data/openclaw.json << 'EOF'
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-opus-4-6",
        "fallbacks": ["anthropic/claude-sonnet-4-6", "openai/gpt-5.4"]
      },
      "maxConcurrent": 4
    },
    "list": [
      {
        "id": "main",
        "default": true
      }
    ]
  },
  "auth": {
    "profiles": {
      "anthropic:default": { "mode": "token", "provider": "anthropic" },
```

--------------------------------

### Reproduce Crash with Node and tsx

Source: https://docs.openclaw.ai/debug/node-issue

Commands to install dependencies and trigger the crash in the repository root.

```bash
# in repo root
node --version
pnpm install
node --import tsx src/entry.ts status
```

--------------------------------

### Run Command Ladder for Channel Troubleshooting

Source: https://docs.openclaw.ai/channels/troubleshooting

Execute these commands in order to establish a healthy baseline and identify common issues. Ensure 'Runtime: running' and 'RPC probe: ok' are observed.

```bash
openclaw status
```

```bash
openclaw gateway status
```

```bash
openclaw logs --follow
```

```bash
openclaw doctor
```

```bash
openclaw channels status --probe
```

--------------------------------

### List Available Image Generation Providers

Source: https://docs.openclaw.ai/tools/image-generation

Use the `action: "list"` parameter with the `image_generate` tool to discover available providers and models at runtime.

```bash
/tool image_generate action=list
```

--------------------------------

### Run Single-Provider Docker Recipes

Source: https://docs.openclaw.ai/help/testing

Execute Dockerized live CLI backend smoke tests for a specific provider. Choose from Claude, Codex, or Gemini.

```bash
pnpm test:docker:live-cli-backend:claude
```

```bash
pnpm test:docker:live-cli-backend:codex
```

```bash
pnpm test:docker:live-cli-backend:gemini
```

--------------------------------

### Manage Node Host Service

Source: https://docs.openclaw.ai/cli/node

Commands for managing the lifecycle of an installed node host service.

```bash
openclaw node status
openclaw node stop
openclaw node restart
openclaw node uninstall
```

--------------------------------

### Start Gateway with Dev Profile via Environment Variable

Source: https://docs.openclaw.ai/help/debugging

If the global `--dev` flag is consumed by a runner, use the `OPENCLAW_PROFILE` environment variable to specify the dev profile and apply the `--reset` flag.

```bash
OPENCLAW_PROFILE=dev openclaw gateway --dev --reset
```

--------------------------------

### Enable QMD Backend

Source: https://docs.openclaw.ai/concepts/memory-qmd

Configure the memory backend to use QMD in the OpenClaw configuration.

```json5
{
  memory: {
    backend: "qmd",
  },
}
```

--------------------------------

### Handle string content errors

Source: https://docs.openclaw.ai/providers/inferrs

Example of the error message and the corresponding compatibility setting to resolve it.

```text
messages[1].content: invalid type: sequence, expected a string
```

```json5
compat: {
  requiresStringContent: true
}
```

--------------------------------

### Configure Routing and Broadcast Bindings

Source: https://docs.openclaw.ai/channels/broadcast-groups

Demonstrates how to combine standard routing bindings with broadcast group configurations.

```json
{
  "bindings": [
    {
      "match": { "channel": "whatsapp", "peer": { "kind": "group", "id": "GROUP_A" } },
      "agentId": "alfred"
    }
  ],
  "broadcast": {
    "GROUP_B": ["agent1", "agent2"]
  }
}
```

--------------------------------

### Example Validation Error

Source: https://docs.openclaw.ai/gateway/secrets-plan-contract

The error message format returned when a target path fails validation.

```text
Invalid plan target path for models.providers.apiKey: models.providers.openai.baseUrl
```

--------------------------------

### Configure viewport and emulation

Source: https://docs.openclaw.ai/cli/browser

Adjust browser environment settings including dimensions, network state, and device emulation.

```bash
openclaw browser resize 1280 720
openclaw browser set viewport 1280 720
openclaw browser set offline on
openclaw browser set media dark
openclaw browser set timezone Europe/London
openclaw browser set locale en-GB
openclaw browser set geo 51.5074 -0.1278 --accuracy 25
openclaw browser set device "iPhone 14"
openclaw browser set headers '{"x-test":"1"}'
openclaw browser set credentials myuser mypass
```

--------------------------------

### System Prompt Time Zone

Source: https://docs.openclaw.ai/date-time

Example of the time zone entry within the system prompt.

```text
Time zone: America/Chicago
```

--------------------------------

### SSE/HTTP Transport Configuration

Source: https://docs.openclaw.ai/cli/mcp

Example configuration for an MCP server using the SSE/HTTP transport protocol.

```json
{
  "mcp": {
    "servers": {
      "remote-tools": {
        "url": "https://mcp.example.com",
        "headers": {
          "Authorization": "Bearer <token>"
        }
      }
    }
  }
}
```

--------------------------------

### Run OpenClaw Status Diagnostics

Source: https://docs.openclaw.ai/cli/status

Execute the basic `openclaw status` command to get diagnostics for channels and sessions. Use `--all` for a comprehensive overview including secrets, `--deep` for live probes on various platforms, and `--usage` to view normalized provider usage percentages.

```bash
openclaw status
```

```bash
openclaw status --all
```

```bash
openclaw status --deep
```

```bash
openclaw status --usage
```

--------------------------------

### Configure OpenClaw gateway

Source: https://docs.openclaw.ai/install/oracle

Set up the gateway to use token authentication and Tailscale Serve.

```bash
openclaw config set gateway.bind loopback
openclaw config set gateway.auth.mode token
openclaw doctor --generate-gateway-token
openclaw config set gateway.tailscale.mode serve
openclaw config set gateway.trustedProxies '["127.0.0.1"]'

systemctl --user restart openclaw-gateway.service
```

--------------------------------

### Run Gmail Webhook Service

Source: https://docs.openclaw.ai/cli/webhooks

Starts the watch service and the auto-renew loop for Gmail webhooks.

```bash
openclaw webhooks gmail run --account you@example.com
```

--------------------------------

### Validate configuration schema

Source: https://docs.openclaw.ai/cli/config

Validate the current configuration against the active schema without starting the gateway.

```bash
openclaw config validate
openclaw config validate --json
```

--------------------------------

### Authentication Command Overview

Source: https://docs.openclaw.ai/cli/models

Basic commands for managing authentication profiles and provider login flows.

```bash
openclaw models auth add
openclaw models auth login --provider <id>
openclaw models auth setup-token --provider <id>
openclaw models auth paste-token
```

--------------------------------

### QR Generation API

Source: https://docs.openclaw.ai/cli

Endpoints for generating mobile pairing QR codes and setup codes.

```APIDOC
## qr

### Description
Generate a mobile pairing QR and setup code from the current Gateway config.
```

--------------------------------

### Configure OpenCode Provider

Source: https://docs.openclaw.ai/gateway/configuration-reference

Set up the OpenCode provider for models like `opencode/claude-opus-4-6`. Ensure `OPENCODE_API_KEY` or `OPENCODE_ZEN_API_KEY` is set. Use `opencode/...` for Zen catalog or `opencode-go/...` for Go catalog.

```json5
{
  agents: {
    defaults: {
      model: { primary: "opencode/claude-opus-4-6" },
      models: { "opencode/claude-opus-4-6": { alias: "Opus" } },
    },
  },
}
```

--------------------------------

### Configure Default Video Generation Model

Source: https://docs.openclaw.ai/tools/video-generation

Set the primary and fallback video generation models via configuration file or CLI.

```json5
{
  agents: {
    defaults: {
      videoGenerationModel: {
        primary: "qwen/wan2.6-t2v",
        fallbacks: ["qwen/wan2.6-r2v-flash"],
      },
    },
  },
}
```

```bash
openclaw config set agents.defaults.videoGenerationModel.primary "qwen/wan2.6-t2v"
```

--------------------------------

### Provider + CLI Fallback Configuration

Source: https://docs.openclaw.ai/nodes/audio

Configure audio processing to use OpenAI for transcription, with Whisper CLI as a fallback. This setup allows for a primary provider and a local CLI option if the provider fails or is unavailable. The `maxBytes` setting limits the audio file size.

```json
{
  tools: {
    media: {
      audio: {
        enabled: true,
        maxBytes: 20971520,
        models: [
          { provider: "openai", model: "gpt-4o-mini-transcribe" },
          {
            type: "cli",
            command: "whisper",
            args: ["--model", "base", "{{MediaPath}}"],
            timeoutSeconds: 45,
          },
        ],
      },
    },
  },
}
```

--------------------------------

### Onboard Mistral via CLI

Source: https://docs.openclaw.ai/providers/mistral

Use these commands to authenticate with Mistral. The non-interactive version requires the MISTRAL_API_KEY environment variable.

```bash
openclaw onboard --auth-choice mistral-api-key
# or non-interactive
openclaw onboard --mistral-api-key "$MISTRAL_API_KEY"
```

--------------------------------

### Disable telemetry

Source: https://docs.openclaw.ai/tools/clawhub

Set this environment variable to prevent the CLI from sending installation snapshots during sync operations.

```bash
export CLAWHUB_DISABLE_TELEMETRY=1
```

--------------------------------

### Skill Management CLI Commands

Source: https://docs.openclaw.ai/tools/clawhub

Commands for managing skills, including searching, installing, updating, and publishing.

```APIDOC
## CLI Commands and Parameters

Global options (apply to all commands):

* `--workdir <dir>`: Working directory (default: current dir; falls back to OpenClaw workspace).
* `--dir <dir>`: Skills directory, relative to workdir (default: `skills`).
* `--site <url>`: Site base URL (browser login).
* `--registry <url>`: Registry API base URL.
* `--no-input`: Disable prompts (non-interactive).
* `-V, --cli-version`: Print CLI version.

Auth:

* `clawhub login` (browser flow) or `clawhub login --token <token>`
* `clawhub logout`
* `clawhub whoami`

Options:

* `--token <token>`: Paste an API token.
* `--label <label>`: Label stored for browser login tokens (default: `CLI token`).
* `--no-browser`: Do not open a browser (requires `--token`).

Search:

* `clawhub search "query"`
* `--limit <n>`: Max results.

Install:

* `clawhub install <slug>`
* `--version <version>`: Install a specific version.
* `--force`: Overwrite if the folder already exists.

Update:

* `clawhub update <slug>`
* `clawhub update --all`
* `--version <version>`: Update to a specific version (single slug only).
* `--force`: Overwrite when local files do not match any published version.

List:

* `clawhub list` (reads `.clawhub/lock.json`)

Publish skills:

* `clawhub skill publish <path>`
* `--slug <slug>`: Skill slug.
* `--name <name>`: Display name.
* `--version <version>`: Semver version.
* `--changelog <text>`: Changelog text (can be empty).
* `--tags <tags>`: Comma-separated tags (default: `latest`).

Publish plugins:

* `clawhub package publish <source>`
* `<source>` can be a local folder, `owner/repo`, `owner/repo@ref`, or a GitHub URL.
* `--dry-run`: Build the exact publish plan without uploading anything.
* `--json`: Emit machine-readable output for CI.
* `--source-repo`, `--source-commit`, `--source-ref`: Optional overrides when auto-detection is not enough.

Delete/undelete (owner/admin only):

* `clawhub delete <slug> --yes`
* `clawhub undelete <slug> --yes`

Sync (scan local skills + publish new/updated):

* `clawhub sync`
* `--root <dir...>`: Extra scan roots.
* `--all`: Upload everything without prompts.
* `--dry-run`: Show what would be uploaded.
* `--bump <type>`: `patch|minor|major` for updates (default: `patch`).
* `--changelog <text>`: Changelog for non-interactive updates.
* `--tags <tags>`: Comma-separated tags (default: `latest`).
* `--concurrency <n>`: Registry checks (default: 4).
```

--------------------------------

### Configure Software Update Settings

Source: https://docs.openclaw.ai/gateway/configuration-reference

Specify the release channel (stable, beta, dev), enable checking for updates on startup, and configure automatic update behavior with delays and intervals.

```json5
{
  update: {
    channel: "stable", // stable | beta | dev
    checkOnStart: true,

    auto: {
      enabled: false,
      stableDelayHours: 6,
      stableJitterHours: 12,
      betaCheckIntervalHours: 1,
    },
  },
}
```

--------------------------------

### Build Control UI with Custom Base Path

Source: https://docs.openclaw.ai/web/control-ui

Compiles static files with a fixed absolute base path for asset URLs.

```bash
OPENCLAW_CONTROL_UI_BASE_PATH=/openclaw/ pnpm ui:build
```

--------------------------------

### Add Feishu Channel via CLI

Source: https://docs.openclaw.ai/channels/feishu

Manually add the Feishu channel to an existing OpenClaw installation.

```bash
openclaw channels add
```

--------------------------------

### Browse Bonjour instances on macOS

Source: https://docs.openclaw.ai/gateway/bonjour

Use the dns-sd utility to list available OpenClaw gateway instances on the local network.

```bash
dns-sd -B _openclaw-gw._tcp local.
```

--------------------------------

### Run Troubleshooting Commands

Source: https://docs.openclaw.ai/channels/tlon

Execute these commands in sequence to diagnose connectivity and plugin status issues.

```bash
openclaw status
openclaw gateway status
openclaw logs --follow
openclaw doctor
```

--------------------------------

### Configure OpenCode Go in JSON5

Source: https://docs.openclaw.ai/providers/opencode-go

Set the API key and default model in the configuration file.

```json5
{
  env: { OPENCODE_API_KEY: "YOUR_API_KEY_HERE" }, // pragma: allowlist secret
  agents: { defaults: { model: { primary: "opencode-go/kimi-k2.5" } } },
}
```

--------------------------------

### Define Telegram Message Action

Source: https://docs.openclaw.ai/channels/telegram

Example structure for sending a message with inline buttons to a Telegram channel.

```json5
{
  action: "send",
  channel: "telegram",
  to: "123456789",
  message: "Choose an option:",
  buttons: [
    [
      { text: "Yes", callback_data: "yes" },
      { text: "No", callback_data: "no" },
    ],
    [{ text: "Cancel", callback_data: "cancel" }],
  ],
}
```

--------------------------------

### Web Fetch Tool Usage

Source: https://docs.openclaw.ai/tools/web-fetch

Demonstrates how to use the web_fetch tool to retrieve content from a given URL.

```APIDOC
## Use web_fetch Tool

### Description
Fetch readable content from a URL using a plain HTTP GET request. This tool does not execute JavaScript.

### Method
`web_fetch` function call

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **url** (string) - Required - The URL to fetch content from (http/https only).
- **extractMode** (string) - Optional - The extraction mode. Can be `"markdown"` (default) or `"text"`.
- **maxChars** (number) - Optional - Truncates the output to this many characters.

### Request Example
```json
{
  "url": "https://example.com/article"
}
```

### Response
#### Success Response (200)
- **content** (string) - The extracted readable content from the URL.

#### Response Example
```json
{
  "content": "This is the extracted content from the article."
}
```
```

--------------------------------

### Apply Gateway Configuration Changes

Source: https://docs.openclaw.ai/cli

Validate and write a full Gateway configuration, then restart and wake the system using the `config.apply` RPC. Use `baseHash` from `config.get` for optimistic concurrency.

```bash
gateway call config.apply
```

--------------------------------

### Run Live Provider Tests

Source: https://docs.openclaw.ai/tools/video-generation

Execute live integration tests for video generation providers using the specified test runners.

```bash
OPENCLAW_LIVE_TEST=1 pnpm test:live -- extensions/video-generation-providers.live.test.ts
```

```bash
pnpm test:live:media video
```

--------------------------------

### Manage Device Pairing and Command Approvals

Source: https://docs.openclaw.ai/nodes/troubleshooting

List devices and configure specific command allowlists for node execution.

```bash
openclaw devices list
openclaw nodes status
openclaw approvals get --node <idOrNameOrIp>
openclaw approvals allowlist add --node <idOrNameOrIp> "/usr/bin/uname"
```

--------------------------------

### Define Channel Catalog Metadata

Source: https://docs.openclaw.ai/plugins/architecture

Use the openclaw field in package.json to advertise channel discovery and installation hints.

```json
{
  "name": "@openclaw/nextcloud-talk",
  "openclaw": {
    "extensions": ["./index.ts"],
    "channel": {
      "id": "nextcloud-talk",
      "label": "Nextcloud Talk",
      "selectionLabel": "Nextcloud Talk (self-hosted)",
      "docsPath": "/channels/nextcloud-talk",
      "docsLabel": "nextcloud-talk",
      "blurb": "Self-hosted chat via Nextcloud Talk webhook bots.",
      "order": 65,
      "aliases": ["nc-talk", "nc"]
    },
    "install": {
      "npmSpec": "@openclaw/nextcloud-talk",
      "localPath": "<bundled-plugin-local-path>",
      "defaultChoice": "npm"
    }
  }
}
```

--------------------------------

### Remove OpenClaw macOS Application

Source: https://docs.openclaw.ai/install/uninstall

If you installed OpenClaw as a macOS application, delete the application file from the Applications folder.

```bash
rm -rf /Applications/OpenClaw.app
```

--------------------------------

### Create Pub/Sub Topic and Grant Access

Source: https://docs.openclaw.ai/automation/cron-jobs

This command creates a Google Cloud Pub/Sub topic named 'gog-gmail-watch' and grants the 'gmail-api-push' service account the necessary role to publish messages to it, enabling Gmail push notifications.

```bash
gcloud pubsub topics create gog-gmail-watch
gcloud pubsub topics add-iam-policy-binding gog-gmail-watch \
  --member=serviceAccount:gmail-api-push@system.gserviceaccount.com \
  --role=roles/pubsub.publisher
```

--------------------------------

### Clone OpenClaw Ansible Repository

Source: https://docs.openclaw.ai/install/ansible

Clones the openclaw-ansible repository and navigates into the directory. This is the first step after installing prerequisites.

```bash
git clone https://github.com/openclaw/openclaw-ansible.git
cd openclaw-ansible
```

--------------------------------

### Request code_execution analysis

Source: https://docs.openclaw.ai/tools/code-execution

Examples of natural language prompts for triggering the code_execution tool for various analytical tasks.

```text
Use code_execution to calculate the 7-day moving average for these numbers: ...
```

```text
Use x_search to find posts mentioning OpenClaw this week, then use code_execution to count them by day.
```

```text
Use web_search to gather the latest AI benchmark numbers, then use code_execution to compare percent changes.
```

--------------------------------

### Media Status Output Format

Source: https://docs.openclaw.ai/nodes/media-understanding

Example of the status summary line displayed when media understanding processes are executed.

```text
📎 Media: image ok (openai/gpt-5.4-mini) · audio skipped (maxBytes)
```

--------------------------------

### Run Live Vydra Video Generation Test

Source: https://docs.openclaw.ai/providers/vydra

Execute live tests for Vydra video generation, covering text-to-video and image-to-video.

```bash
OPENCLAW_LIVE_TEST=1 \
OPENCLAW_LIVE_VYDRA_VIDEO=1 \
pnpm test:live -- extensions/vydra/vydra.live.test.ts
```

--------------------------------

### Invoke Tool via cURL

Source: https://docs.openclaw.ai/gateway/tools-invoke-http-api

Example of calling a tool through the HTTP endpoint using a bearer token for authentication.

```bash
curl -sS http://127.0.0.1:18789/tools/invoke \
  -H 'Authorization: Bearer secret' \
  -H 'Content-Type: application/json' \
  -d '{
    "tool": "sessions_list",
    "action": "json",
    "args": {}
  }'
```

--------------------------------

### POST /v1/responses (Streaming)

Source: https://docs.openclaw.ai/gateway/openresponses-http-api

Example of making a streaming request to the /v1/responses endpoint using Server-Sent Events (SSE).

```APIDOC
## POST /v1/responses (Streaming)

### Description

Submits a request to generate a response with streaming enabled via Server-Sent Events (SSE).

### Method

POST

### Endpoint

`/v1/responses`

### Request Body

- **model** (string) - Required - The model to use for generation.
- **stream** (boolean) - Required - Set to `true` to enable streaming.
- **input** (string) - Required - The input prompt or query.

### Request Example

```bash
curl -N http://127.0.0.1:18789/v1/responses \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'x-openclaw-agent-id: main' \
  -d '{
    "model": "openclaw",
    "stream": true,
    "input": "hi"
  }'
```
```

--------------------------------

### Message Envelope Examples

Source: https://docs.openclaw.ai/concepts/timezone

Visual representations of how different timezone and elapsed time settings appear in message headers.

```text
[Signal Alice +1555 2026-01-18 00:19 PST] hello
```

```text
[Signal Alice +1555 2026-01-18 06:19 GMT+1] hello
```

```text
[Signal Alice +1555 +2m 2026-01-18T05:19Z] follow-up
```

--------------------------------

### Full conversation context format

Source: https://docs.openclaw.ai/concepts/active-memory

Example structure of the full conversation context sent to the blocking memory sub-agent.

```text
Full conversation context:
user: ...
assistant: ...
user: ...
...
```

--------------------------------

### Configure Open Group Access

Source: https://docs.openclaw.ai/channels/telegram

Example configuration to allow any member of a specific Telegram group to interact with the bot.

```json5
{
  channels: {
    telegram: {
      groups: {
        "-1001234567890": {
          groupPolicy: "open",
          requireMention: false,
        },
      },
    },
  },
}
```

--------------------------------

### Code Review Team Configuration

Source: https://docs.openclaw.ai/channels/broadcast-groups

Example configuration for a code review team using parallel broadcast strategy.

```APIDOC
## Example 1: Code Review Team

### Description
This configuration sets up a team of agents for code review, including a code formatter, security scanner, test coverage checker, and documentation checker. The `parallel` strategy ensures all agents process the input simultaneously.

### Request Body
```json
{
  "broadcast": {
    "strategy": "parallel",
    "120363403215116621@g.us": [
      "code-formatter",
      "security-scanner",
      "test-coverage",
      "docs-checker"
    ]
  },
  "agents": {
    "list": [
      {
        "id": "code-formatter",
        "workspace": "~/agents/formatter",
        "tools": { "allow": ["read", "write"] }
      },
      {
        "id": "security-scanner",
        "workspace": "~/agents/security",
        "tools": { "allow": ["read", "exec"] }
      },
      {
        "id": "test-coverage",
        "workspace": "~/agents/testing",
        "tools": { "allow": ["read", "exec"] }
      },
      { "id": "docs-checker", "workspace": "~/agents/docs", "tools": { "allow": ["read"] } }
    ]
  }
}
```

### User Input Example
`Code snippet`

### Agent Responses Example
* code-formatter: "Fixed indentation and added type hints"
* security-scanner: "⚠️ SQL injection vulnerability in line 12"
* test-coverage: "Coverage is 45%, missing tests for error cases"
* docs-checker: "Missing docstring for function `process_data`"
```

--------------------------------

### Open the TUI

Source: https://docs.openclaw.ai/web/tui

Launch the Terminal UI after starting the Gateway. This command opens the interactive interface for agent communication.

```bash
openclaw tui
```

--------------------------------

### Web Fetch Configuration

Source: https://docs.openclaw.ai/tools/web-fetch

Configuration options for the web_fetch tool, including default settings and fallback provider setup.

```APIDOC
## Web Fetch Configuration Options

### Description
Configure the behavior and fallback mechanisms for the `web_fetch` tool.

### Method
Configuration object

### Endpoint
N/A

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **tools.web.fetch.enabled** (boolean) - Optional - Enables or disables the web fetch tool. Defaults to `true`.
- **tools.web.fetch.provider** (string) - Optional - Specifies the fallback provider. Omit for auto-detection. Example: `"firecrawl"`.
- **tools.web.fetch.maxChars** (number) - Optional - Sets the maximum number of characters for the output. Defaults to `50000`.
- **tools.web.fetch.maxCharsCap** (number) - Optional - Hard cap for the `maxChars` parameter.
- **tools.web.fetch.maxResponseBytes** (number) - Optional - Maximum download size in bytes before truncation. Defaults to `2000000`.
- **tools.web.fetch.timeoutSeconds** (number) - Optional - Timeout for fetch operations in seconds. Defaults to `30`.
- **tools.web.fetch.cacheTtlMinutes** (number) - Optional - Cache time-to-live in minutes. Defaults to `15`.
- **tools.web.fetch.maxRedirects** (number) - Optional - Maximum number of redirects to follow. Defaults to `3`.
- **tools.web.fetch.readability** (boolean) - Optional - Whether to use Readability for extraction. Defaults to `true`.
- **tools.web.fetch.userAgent** (string) - Optional - Override the User-Agent string.
- **tools.web.fetch.firecrawl.apiKey** (string) - Optional - Firecrawl API key. Supports SecretRef objects. Can be omitted if `FIRECRAWL_API_KEY` environment variable is set.
- **tools.web.fetch.firecrawl.baseUrl** (string) - Optional - Base URL for the Firecrawl API. Must use `https://` and `api.firecrawl.dev`.
- **tools.web.fetch.firecrawl.onlyMainContent** (boolean) - Optional - If true, extracts only the main content.
- **tools.web.fetch.firecrawl.maxAgeMs** (number) - Optional - Cache duration in milliseconds for Firecrawl. Defaults to `86400000` (1 day).
- **tools.web.fetch.firecrawl.timeoutSeconds** (number) - Optional - Timeout for Firecrawl operations in seconds. Defaults to `60`.

### Request Example
```json
{
  "tools": {
    "web": {
      "fetch": {
        "enabled": true,
        "provider": "firecrawl",
        "maxChars": 10000,
        "readability": false
      }
    }
  }
}
```

### Response
#### Success Response (200)
Configuration applied.

#### Response Example
N/A
```

--------------------------------

### View Wizard metadata

Source: https://docs.openclaw.ai/gateway/configuration-reference

Represents metadata generated by CLI setup flows like onboard, configure, and doctor.

```json5
{
  wizard: {
    lastRunAt: "2026-01-01T00:00:00.000Z",
    lastRunVersion: "2026.1.4",
    lastRunCommit: "abc1234",
    lastRunCommand: "configure",
    lastRunMode: "local",
  },
}
```

--------------------------------

### Run REM Reflection Harness

Source: https://docs.openclaw.ai/cli/memory

Preview REM reflections and deep promotion output without modifying memory files.

```bash
openclaw memory rem-harness [--agent <id>] [--include-promoted] [--json]
```

--------------------------------

### Webhooks Helpers API

Source: https://docs.openclaw.ai/cli/index

Provides helper functions for managing webhooks, specifically for Gmail Pub/Sub setup and running.

```APIDOC
## Webhooks Helpers

Webhook helpers. Current built-in surface is Gmail Pub/Sub setup + runner:

* `webhooks gmail setup`: Set up Gmail Pub/Sub.
* `webhooks gmail run`: Run the Gmail Pub/Sub listener.
```

--------------------------------

### Configure Prompt Append

Source: https://docs.openclaw.ai/concepts/active-memory

Adds extra operator instructions after the default prompt.

```json5
promptAppend: "Prefer stable long-term preferences over one-off events."
```

--------------------------------

### CLI Command: openclaw qr

Source: https://docs.openclaw.ai/cli/qr

Generate a mobile pairing QR and setup code from your current Gateway configuration.

```APIDOC
## openclaw qr

### Description
Generate a mobile pairing QR and setup code from your current Gateway configuration.

### Parameters
#### Options
- **--remote** (flag) - Optional - Prefer gateway.remote.url or tailscale mode.
- **--url** (string) - Optional - Override gateway URL used in payload.
- **--public-url** (string) - Optional - Override public URL used in payload.
- **--token** (string) - Optional - Override gateway token.
- **--password** (string) - Optional - Override gateway password.
- **--setup-code-only** (flag) - Optional - Print only setup code.
- **--no-ascii** (flag) - Optional - Skip ASCII QR rendering.
- **--json** (flag) - Optional - Emit JSON output.

### Response
#### Success Response (JSON output)
- **setupCode** (string) - The generated setup code.
- **gatewayUrl** (string) - The gateway URL.
- **auth** (string) - Authentication details.
- **urlSource** (string) - The source of the URL.
```

--------------------------------

### Get Current Gateway Configuration

Source: https://docs.openclaw.ai/cli

Retrieve a snapshot of the current Gateway configuration and its hash using the `config.get` RPC.

```bash
gateway call config.get
```

--------------------------------

### Troubleshooting: Check Hook Eligibility

Source: https://docs.openclaw.ai/automation/hooks

Use the CLI to get detailed information about a hook to diagnose eligibility issues.

```bash
openclaw hooks info my-hook
```

--------------------------------

### List Web Providers

Source: https://docs.openclaw.ai/cli/infer

Display available web providers. Use --json for machine-readable output. This command helps in inspecting configured and selected providers.

```bash
openclaw infer web providers --json
```

--------------------------------

### Enable PowerShell script tracing for diagnostics

Source: https://docs.openclaw.ai/install/installer

To obtain verbose output and detailed diagnostics when running the PowerShell installer script, enable PowerShell's script tracing feature using `Set-PSDebug -Trace 1`. Remember to disable tracing with `Set-PSDebug -Trace 0` after troubleshooting. This command allows you to see the execution flow of the script, which can be helpful for identifying the root cause of installation failures.

```powershell
Set-PSDebug -Trace 1
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -NoOnboard
Set-PSDebug -Trace 0
```

--------------------------------

### Minimal Openclaw AI Configuration

Source: https://docs.openclaw.ai/help/faq

Sets the default agent workspace and restricts channel access. Useful for a first-time installation.

```json5
{
  agents: { defaults: { workspace: "~/.openclaw/workspace" } },
  channels: { whatsapp: { allowFrom: ["+15555550123"] } },
}
```

--------------------------------

### Include Multiple Config Files

Source: https://docs.openclaw.ai/gateway/configuration-reference

Demonstrates how to use the $include directive to incorporate multiple configuration files into a main configuration. Paths are resolved relative to the including file.

```json5
// ~/.openclaw/openclaw.json
{
  gateway: { port: 18789 },
  agents: { $include: "./agents.json5" },
  broadcast: {
    $include: ["./clients/mueller.json5", "./clients/schmidt.json5"],
  },
}
```

--------------------------------

### Update OpenClaw via CLI

Source: https://docs.openclaw.ai/install/updating

The recommended method for updating OpenClaw, which automatically detects the installation type and restarts the gateway.

```bash
openclaw update
```

```bash
openclaw update --channel beta
openclaw update --tag main
openclaw update --dry-run   # preview without applying
```

--------------------------------

### Configure Browserless CDP connection

Source: https://docs.openclaw.ai/tools/browser

Example configuration for connecting to a Browserless hosted Chromium instance using a WebSocket URL.

```json5
{
  browser: {
    enabled: true,
    defaultProfile: "browserless",
    remoteCdpTimeoutMs: 2000,
    remoteCdpHandshakeTimeoutMs: 4000,
    profiles: {
      browserless: {
        cdpUrl: "wss://production-sfo.browserless.io?token=<BROWSERLESS_API_KEY>",
        color: "#00AA00",
      },
    },
  },
}
```

--------------------------------

### Configure GCP Project and Enable APIs

Source: https://docs.openclaw.ai/automation/cron-jobs

These gcloud commands set up your Google Cloud project for Gmail Pub/Sub integration. They log you in, set the active project, and enable the necessary Gmail and Pub/Sub APIs.

```bash
gcloud auth login
gcloud config set project <project-id>
gcloud services enable gmail.googleapis.com pubsub.googleapis.com
```

--------------------------------

### Sign in to Ollama

Source: https://docs.openclaw.ai/tools/ollama-search

Run this command to sign in to your Ollama instance. This is a prerequisite for using Ollama Web Search.

```bash
ollama signin
```

--------------------------------

### Set Default Model for Volcengine

Source: https://docs.openclaw.ai/providers/volcengine

Configure the default primary model to be used. This example sets a coding model as the default.

```json5
{
  agents: {
    defaults: {
      model: { primary: "volcengine-plan/ark-code-latest" },
    },
  },
}
```

--------------------------------

### Configure Chutes Models in OpenClaw

Source: https://docs.openclaw.ai/providers/chutes

Example configuration for defining primary models and aliases within the OpenClaw agent settings.

```json5
{
  agents: {
    defaults: {
      model: { primary: "chutes/zai-org/GLM-4.7-TEE" },
      models: {
        "chutes/zai-org/GLM-4.7-TEE": { alias: "Chutes GLM 4.7" },
        "chutes/deepseek-ai/DeepSeek-V3.2-TEE": { alias: "Chutes DeepSeek V3.2" },
      },
    },
  },
}
```

--------------------------------

### Exec Provider Protocol Payloads

Source: https://docs.openclaw.ai/gateway/secrets

Examples of the stdin request format and stdout response formats for custom executable resolvers.

```json
{ "protocolVersion": 1, "provider": "vault", "ids": ["providers/openai/apiKey"] }
```

```jsonc
{ "protocolVersion": 1, "values": { "providers/openai/apiKey": "<openai-api-key>" } } // pragma: allowlist secret
```

```json
{
  "protocolVersion": 1,
  "values": {},
  "errors": { "providers/openai/apiKey": { "message": "not found" } }
}
```

--------------------------------

### Apply Sandbox Configuration Changes

Source: https://docs.openclaw.ai/cli/sandbox

Recreate all containers after modifying sandbox configuration settings.

```bash
# Edit config: agents.defaults.sandbox.* (or agents.list[].sandbox.*)

# Recreate to apply new config
openclaw sandbox recreate --all
```

--------------------------------

### Onboard with AI Gateway API Key

Source: https://docs.openclaw.ai/providers/vercel-ai-gateway

Use this command to onboard with the Vercel AI Gateway, selecting the API key authentication method. It's recommended to store the API key securely.

```bash
openclaw onboard --auth-choice ai-gateway-api-key
```

--------------------------------

### MCP Server Configuration Shape

Source: https://docs.openclaw.ai/cli/mcp

Example JSON structure for defining MCP servers within the OpenClaw configuration file.

```json
{
  "mcp": {
    "servers": {
      "context7": {
        "command": "uvx",
        "args": ["context7-mcp"]
      },
      "docs": {
        "url": "https://mcp.example.com"
      }
    }
  }
}
```

--------------------------------

### Configure Restricted Group Access

Source: https://docs.openclaw.ai/channels/telegram

Example configuration to restrict bot interaction to specific users within a designated group.

```json5
{
  channels: {
    telegram: {
      groups: {
        "-1001234567890": {
          requireMention: true,
          allowFrom: ["8734062810", "745123456"],
        },
      },
    },
  },
}
```

--------------------------------

### List WhatsApp Groups from Configuration

Source: https://docs.openclaw.ai/help/faq

If groups are already configured and allowlisted, use the `openclaw directory groups list --channel whatsapp` command to retrieve a list of configured groups.

```bash
openclaw directory groups list --channel whatsapp
```

--------------------------------

### Configure Tool Allow and Deny Lists

Source: https://docs.openclaw.ai/tools

Define specific tools to permit or restrict for the agent. Deny rules take precedence over allow rules.

```json5
{
  tools: {
    allow: ["group:fs", "browser", "web_search"],
    deny: ["exec"],
  },
}
```

--------------------------------

### Create OpenClaw Backup Archive

Source: https://docs.openclaw.ai/cli/backup

Use `openclaw backup create` to generate a local backup archive. Specify an output path with `--output` or perform a dry run with `--dry-run`. The `--verify` flag runs validation immediately after creation. Use `--no-include-workspace` to exclude workspaces or `--only-config` to back up only the active config file.

```bash
openclaw backup create
```

```bash
openclaw backup create --output ~/Backups
```

```bash
openclaw backup create --dry-run --json
```

```bash
openclaw backup create --verify
```

```bash
openclaw backup create --no-include-workspace
```

```bash
openclaw backup create --only-config
```

--------------------------------

### Inspect OpenClaw Plugins

Source: https://docs.openclaw.ai/tools/plugin

Get detailed information about specific plugins or all plugins. Supports JSON output for machine readability.

```bash
openclaw plugins inspect <id>              # deep detail
```

```bash
openclaw plugins inspect <id> --json       # machine-readable
```

```bash
openclaw plugins inspect --all             # fleet-wide table
```

```bash
openclaw plugins info <id>                 # inspect alias
```

```bash
openclaw plugins doctor                    # diagnostics
```

--------------------------------

### List and Select Models

Source: https://docs.openclaw.ai/providers/ollama

Commands to view available models and set the active model for the current session.

```bash
openclaw models list
openclaw models set ollama/gemma4
```

--------------------------------

### GET /models

Source: https://docs.openclaw.ai/providers/venice

Retrieve the list of available AI models, including their IDs, names, context limits, and specific features.

```APIDOC
## GET /models

### Description
Returns a list of all 41 available models, categorized by their privacy features and capabilities.

### Method
GET

### Endpoint
/models

### Response
#### Success Response (200)
- **models** (array) - List of available model objects
- **model_id** (string) - Unique identifier for the model
- **name** (string) - Human-readable name of the model
- **context** (string) - Maximum context window size
- **features** (string) - Key capabilities (e.g., Reasoning, Vision, Coding)

#### Response Example
{
  "models": [
    {
      "model_id": "kimi-k2-5",
      "name": "Kimi K2.5",
      "context": "256k",
      "features": "Default, reasoning, vision"
    }
  ]
}
```

--------------------------------

### Register CLI Subcommand

Source: https://docs.openclaw.ai/plugins/building-plugins

Use `api.registerCli(...)` to register CLI subcommands. See the Entry Points guide for more information.

```javascript
api.registerCli(...)
```

--------------------------------

### List Available VM SKUs in Region

Source: https://docs.openclaw.ai/install/azure

Lists all available virtual machine sizes (SKUs) in the specified Azure region. Use this to select an appropriate VM size if the default is unavailable.

```bash
az vm list-skus --location "${LOCATION}" --resource-type virtualMachines -o table
```

--------------------------------

### Register Custom Command

Source: https://docs.openclaw.ai/plugins/building-plugins

Use `api.registerCommand(...)` to register custom commands. Refer to the Entry Points guide for more information.

```javascript
api.registerCommand(...)
```

--------------------------------

### List Agents with Bindings

Source: https://docs.openclaw.ai/concepts/multi-agent

Verify the agents configured in the system and their associated bindings. This command is useful for checking routing configurations.

```bash
openclaw agents list --bindings
```

--------------------------------

### Run live tests for music generation

Source: https://docs.openclaw.ai/tools/music-generation

Execute live tests for shared bundled providers or specific ComfyUI workflows.

```bash
OPENCLAW_LIVE_TEST=1 pnpm test:live -- extensions/music-generation-providers.live.test.ts
```

```bash
pnpm test:live:media music
```

```bash
OPENCLAW_LIVE_TEST=1 COMFY_LIVE_TEST=1 pnpm test:live -- extensions/comfy/comfy.live.test.ts
```

--------------------------------

### Use Real Home Directory for Live Tests

Source: https://docs.openclaw.ai/help/testing

Intentionally configures live tests to use the user's real home directory. Use with caution, as this can potentially mutate real configuration files.

```bash
OPENCLAW_LIVE_USE_REAL_HOME=1
```

--------------------------------

### List Sandbox Runtimes

Source: https://docs.openclaw.ai/cli/sandbox

Display all active sandbox runtimes with their status and configuration details.

```bash
openclaw sandbox list
openclaw sandbox list --browser  # List only browser containers
openclaw sandbox list --json     # JSON output
```

--------------------------------

### Verify OpenClaw Gateway Status

Source: https://docs.openclaw.ai/install/azure

Check the status of the OpenClaw gateway after installation and onboarding. This command confirms that the gateway is running correctly.

```bash
openclaw gateway status
```

--------------------------------

### Run Provider OAuth Login

Source: https://docs.openclaw.ai/concepts/oauth

Use this command to initiate the OAuth login flow for a specific provider. Replace `<id>` with the actual provider identifier.

```bash
openclaw models auth login --provider <id>
```

--------------------------------

### Configure Dockerfile for Binaries

Source: https://docs.openclaw.ai/install/docker-vm-runtime

Install required external binaries during the image build process to ensure persistence across container restarts.

```dockerfile
FROM node:24-bookworm

RUN apt-get update && apt-get install -y socat && rm -rf /var/lib/apt/lists/*

# Example binary 1: Gmail CLI
RUN curl -L https://github.com/steipete/gog/releases/latest/download/gog_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/gog

# Example binary 2: Google Places CLI
RUN curl -L https://github.com/steipete/goplaces/releases/latest/download/goplaces_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/goplaces

# Example binary 3: WhatsApp CLI
RUN curl -L https://github.com/steipete/wacli/releases/latest/download/wacli_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/wacli

# Add more binaries below using the same pattern

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY ui/package.json ./ui/package.json
COPY scripts ./scripts

RUN corepack enable
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build
RUN pnpm ui:install
RUN pnpm ui:build

ENV NODE_ENV=production

CMD ["node","dist/index.js"]
```

--------------------------------

### Validate iMessage RPC and Channel Status

Source: https://docs.openclaw.ai/channels/imessage

Use these commands to verify that the imsg binary is correctly installed and that the RPC interface is responsive.

```bash
imsg rpc --help
openclaw channels status --probe
```

--------------------------------

### Onboard Moonshot API Key

Source: https://docs.openclaw.ai/providers/moonshot

Use this command to onboard the Moonshot API with your API key. Alternatively, use the `--auth-choice moonshot-api-key-cn` for China-specific endpoints.

```bash
openclaw onboard --auth-choice moonshot-api-key
```

```bash
openclaw onboard --auth-choice moonshot-api-key-cn
```

--------------------------------

### Configure apply_patch Tool

Source: https://docs.openclaw.ai/tools/exec

Configure the 'apply_patch' tool for multi-file edits. This example restricts its use to workspace-only operations and specific models.

```json5
{
  tools: {
    exec: {
      applyPatch: { workspaceOnly: true, allowModels: ["gpt-5.4"] },
    },
  },
}
```

--------------------------------

### Integrate 1Password CLI as Exec Provider

Source: https://docs.openclaw.ai/gateway/secrets

Example configuration for using the 1Password CLI to resolve an API key for an OpenAI model.

```json5
{
  secrets: {
    providers: {
      onepassword_openai: {
        source: "exec",
        command: "/opt/homebrew/bin/op",
        allowSymlinkCommand: true, // required for Homebrew symlinked binaries
        trustedDirs: ["/opt/homebrew"],
        args: ["read", "op://Personal/OpenClaw QA API Key/password"],
        passEnv: ["HOME"],
        jsonOnly: false,
      },
    },
  },
  models: {
    providers: {
      openai: {
        baseUrl: "https://api.openai.com/v1",
        models: [{ id: "gpt-5", name: "gpt-5" }],
        apiKey: { source: "exec", provider: "onepassword_openai", id: "value" },
      },
    },
  },
}
```

--------------------------------

### Focus on a Matrix Room/DM and Create Thread Binding

Source: https://docs.openclaw.ai/channels/matrix

Running `/focus` in a top-level Matrix room or DM creates a new Matrix thread and binds it to the target session when `threadBindings.spawnSubagentSessions` is true.

```bash
/focus
```

--------------------------------

### Enable Compute Engine API

Source: https://docs.openclaw.ai/install/gcp

Required to provision virtual machines within the project.

```bash
gcloud services enable compute.googleapis.com
```

--------------------------------

### Manage Configuration Settings

Source: https://docs.openclaw.ai/cli/config

Perform various configuration operations such as viewing the file path, setting values, and validating the current configuration.

```bash
openclaw config file
openclaw config --section model
openclaw config --section gateway --section daemon
openclaw config schema
openclaw config get browser.executablePath
openclaw config set browser.executablePath "/usr/bin/google-chrome"
openclaw config set agents.defaults.heartbeat.every "2h"
openclaw config set agents.list[0].tools.exec.node "node-id-or-name"
openclaw config set channels.discord.token --ref-provider default --ref-source env --ref-id DISCORD_BOT_TOKEN
openclaw config set secrets.providers.vaultfile --provider-source file --provider-path /etc/openclaw/secrets.json --provider-mode json
openclaw config unset plugins.entries.brave.config.webSearch.apiKey
openclaw config set channels.discord.token --ref-provider default --ref-source env --ref-id DISCORD_BOT_TOKEN --dry-run
openclaw config validate
openclaw config validate --json
```

--------------------------------

### Run Gateway in Dev Mode

Source: https://docs.openclaw.ai/pi-dev

Start the OpenClaw gateway in development mode. This is a prerequisite for triggering agents directly for manual testing.

```bash
pnpm gateway:dev
```

--------------------------------

### Execute OpenClaw CLI commands

Source: https://docs.openclaw.ai/concepts/model-providers

Common CLI operations for onboarding, setting models, and listing available configurations.

```bash
openclaw onboard --auth-choice opencode-zen
openclaw models set opencode/claude-opus-4-6
openclaw models list
```

--------------------------------

### Back up skills

Source: https://docs.openclaw.ai/tools/clawhub

Commands for publishing individual skills or syncing multiple skills to the registry.

```bash
clawhub skill publish ./my-skill --slug my-skill --name "My Skill" --version 1.0.0 --tags latest
```

```bash
clawhub sync --all
```

--------------------------------

### Register Event Hook

Source: https://docs.openclaw.ai/plugins/building-plugins

Use `api.registerHook(...)` to register event hooks. Detailed instructions can be found in the Entry Points guide.

```javascript
api.registerHook(...)
```

--------------------------------

### Register Realtime Transcription Provider

Source: https://docs.openclaw.ai/plugins/building-plugins

Use `api.registerRealtimeTranscriptionProvider(...)` for realtime transcription capabilities. Refer to the Provider Plugins guide for more information.

```javascript
api.registerRealtimeTranscriptionProvider(...)
```

--------------------------------

### Update to Development Channel

Source: https://docs.openclaw.ai/help/faq

Switch your OpenClaw installation to the development channel ('dev') using the CLI. This updates from the main branch and compiles from source.

```bash
openclaw update --channel dev
```

--------------------------------

### Clone and run formal models

Source: https://docs.openclaw.ai/security/formal-verification

Instructions for cloning the formal models repository and executing model checks using the provided Makefile targets. Requires Java 11+.

```bash
git clone https://github.com/vignesh07/openclaw-formal-models
cd openclaw-formal-models

# Java 11+ required (TLC runs on the JVM).
# The repo vendors a pinned `tla2tools.jar` (TLA+ tools) and provides `bin/tlc` + Make targets.

make <target>
```

--------------------------------

### Log in to GitHub Copilot

Source: https://docs.openclaw.ai/providers/github-copilot

Use this command to initiate the GitHub device flow for authentication. It saves an auth profile and updates your configuration to use the Copilot provider.

```bash
openclaw models auth login-github-copilot
```

--------------------------------

### Troubleshoot 'openclaw' Not Found

Source: https://docs.openclaw.ai/install

Check Node.js installation, global npm package location, and if the global bin directory is in your system's PATH.

```bash
node -v           # Node installed?
npm prefix -g     # Where are global packages?
echo "$PATH"      # Is the global bin dir in PATH?
```

--------------------------------

### Run the Gateway CLI

Source: https://docs.openclaw.ai/cli/gateway

Execute the Gateway process locally. Ensure `gateway.mode=local` is set in `~/.openclaw/openclaw.json` or use `--allow-unconfigured` for development runs. Binding beyond loopback requires authentication.

```bash
openclaw gateway
```

```bash
openclaw gateway run
```

--------------------------------

### Configure Default Groq Model

Source: https://docs.openclaw.ai/providers/groq

Set the default primary model for agents in the OpenClaw configuration. This example uses a Llama 3.3 model.

```json5
{
  agents: {
    defaults: {
      model: { primary: "groq/llama-3.3-70b-versatile" },
    },
  },
}
```

--------------------------------

### Bridge Instances via CLI

Source: https://docs.openclaw.ai/help/faq

Example command to send a message from one agent to another via the CLI, useful for inter-instance communication.

```bash
openclaw agent --message "Hello from local bot" --deliver --channel telegram --reply-to <chat-id>
```

--------------------------------

### Configure Bedrock Discovery Settings

Source: https://docs.openclaw.ai/providers/bedrock

Set Bedrock discovery to enabled, specify the region, filter providers, and configure refresh interval and default context window/max tokens.

```json
{
  plugins: {
    entries: {
      "amazon-bedrock": {
        config: {
          discovery: {
            enabled: true,
            region: "us-east-1",
            providerFilter: ["anthropic", "amazon"],
            refreshInterval: 3600,
            defaultContextWindow: 32000,
            defaultMaxTokens: 4096,
          },
        },
      },
    },
  },
}
```

--------------------------------

### List Model Aliases and Fallbacks

Source: https://docs.openclaw.ai/cli/models

Commands to view currently configured model aliases and fallback configurations.

```bash
openclaw models aliases list
openclaw models fallbacks list
```

--------------------------------

### Configure fly.toml

Source: https://docs.openclaw.ai/install/fly

Defines the application runtime environment, processes, and storage mounts.

```toml
app = "my-openclaw"  # Your app name
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  OPENCLAW_PREFER_PNPM = "1"
  OPENCLAW_STATE_DIR = "/data"
  NODE_OPTIONS = "--max-old-space-size=1536"

[processes]
  app = "node dist/index.js gateway --allow-unconfigured --port 3000 --bind lan"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

[[vm]]
  size = "shared-cpu-2x"
  memory = "2048mb"

[mounts]
  source = "openclaw_data"
  destination = "/data"
```

--------------------------------

### Node Command Gating (2026.3.31+)

Source: https://docs.openclaw.ai/gateway/pairing

Information on the breaking change starting with version 2026.3.31 where node commands are disabled until node pairing is approved.

```APIDOC
## Node command gating (2026.3.31+)

<Warning>
  **Breaking change:** Starting with `2026.3.31`, node commands are disabled until node pairing is approved. Device pairing alone is no longer enough to expose declared node commands.
</Warning>

When a node connects for the first time, pairing is requested automatically. Until the pairing request is approved, all pending node commands from that node are filtered and will not execute. Once trust is established through pairing approval, the node's declared commands become available subject to the normal command policy.

This means:

* Nodes that were previously relying on device pairing alone to expose commands must now complete node pairing.
* Commands queued before pairing approval are dropped, not deferred.
```

--------------------------------

### Configure RunAtLoad

Source: https://docs.openclaw.ai/gateway/remote-gateway-readme

Configures the tunnel to initiate automatically when the agent loads.

```text
RunAtLoad
```

--------------------------------

### Minimal Gateway Connection Flow

Source: https://docs.openclaw.ai/concepts/typebox

Illustrates the essential sequence of messages for establishing and interacting with the Gateway WebSocket connection, starting with a 'connect' request.

```text
Client                    Gateway
  |---- req:connect -------->|
  |<---- res:hello-ok --------|
  |<---- event:tick ----------|
  |---- req:health ---------->|
  |<---- res:health ----------|
```

--------------------------------

### Split Configuration with $include

Source: https://docs.openclaw.ai/gateway/configuration

Organize large configuration files by using the '$include' directive. This allows for modularity, with support for single files, arrays of files for merging, and nested includes.

```json5
// ~/.openclaw/openclaw.json
{
  gateway: { port: 18789 },
  agents: { $include: "./agents.json5" },
  broadcast: {
    $include: ["./clients/a.json5", "./clients/b.json5"],
  },
}
```

--------------------------------

### Configure Default Image Generation Model

Source: https://docs.openclaw.ai/tools/image-generation

Sets the primary and fallback models for image generation. Ensure these models are compatible with your OpenClaw setup.

```json5
{
  agents: {
    defaults: {
      imageGenerationModel: {
        primary: "openai/gpt-image-1",
        fallbacks: ["google/gemini-3.1-flash-image-preview", "fal/fal-ai/flux/dev"],
      },
    },
  },
}
```

--------------------------------

### Run OpenClaw via Node.js

Source: https://docs.openclaw.ai/cli/acp

Use the direct CLI entrypoint for repo-local checkouts to maintain a clean ACP stream.

```bash
env OPENCLAW_HIDE_BANNER=1 OPENCLAW_SUPPRESS_NOTES=1 node openclaw.mjs acp ...
```

--------------------------------

### List All Hooks

Source: https://docs.openclaw.ai/cli/hooks

Lists all discovered hooks from various directories. Use `--verbose` for detailed information including missing requirements, or `--json` for programmatic use.

```bash
openclaw hooks list
```

```bash
openclaw hooks list --verbose
```

```bash
openclaw hooks list --json
```

--------------------------------

### Non-interactive Custom Provider Onboarding

Source: https://docs.openclaw.ai/cli/onboard

Configures onboarding for a custom provider using a custom API key and base URL in non-interactive mode. Ensure the OPENCLAW_ALLOW_INSECURE_PRIVATE_WS environment variable is set for plaintext private-network ws:// targets.

```bash
openclaw onboard --non-interactive \
  --auth-choice custom-api-key \
  --custom-base-url "https://llm.example.com/v1" \
  --custom-model-id "foo-large" \
  --custom-api-key "$CUSTOM_API_KEY" \
  --secret-input-mode plaintext \
  --custom-compatibility openai
```

--------------------------------

### Fetch a Specific Model

Source: https://docs.openclaw.ai/gateway/openai-http-api

Get details for a single model. The model ID in the URL should be URL-encoded if it contains special characters like '/'.

```bash
curl -sS http://127.0.0.1:18789/v1/models/openclaw%2Fdefault \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

--------------------------------

### Get Skill Information

Source: https://docs.openclaw.ai/cli/skills

Retrieves information about a specific local skill by its name. The --json flag outputs machine-readable JSON to stdout.

```bash
openclaw skills info <name>
```

```bash
openclaw skills info <name> --json
```

--------------------------------

### Get Current Gateway Token

Source: https://docs.openclaw.ai/cli/devices

Retrieve the current gateway authentication token. Use this to confirm the token source when experiencing authentication issues.

```bash
openclaw config get gateway.auth.token
```

--------------------------------

### Enable Ollama via Environment Variable

Source: https://docs.openclaw.ai/providers/ollama

The simplest method to enable implicit model discovery by setting the API key.

```bash
export OLLAMA_API_KEY="ollama-local"
```

--------------------------------

### Register Web Search Provider

Source: https://docs.openclaw.ai/plugins/building-plugins

Use `api.registerWebSearchProvider(...)` to register web search capabilities. The Provider Plugins guide provides more information.

```javascript
api.registerWebSearchProvider(...)
```

--------------------------------

### Register Web Fetch Provider

Source: https://docs.openclaw.ai/plugins/building-plugins

Use `api.registerWebFetchProvider(...)` to register web fetch capabilities. Refer to the Provider Plugins guide for further details.

```javascript
api.registerWebFetchProvider(...)
```

--------------------------------

### Configure user and hostname

Source: https://docs.openclaw.ai/install/oracle

Set the system hostname and enable user linger to keep services running after logout.

```bash
sudo hostnamectl set-hostname openclaw
sudo passwd ubuntu
sudo loginctl enable-linger ubuntu
```

--------------------------------

### Register Music Generation Provider

Source: https://docs.openclaw.ai/plugins/building-plugins

Use `api.registerMusicGenerationProvider(...)` to register music generation capabilities. The Provider Plugins guide offers more information.

```javascript
api.registerMusicGenerationProvider(...)
```

--------------------------------

### Register Media Understanding Provider

Source: https://docs.openclaw.ai/plugins/building-plugins

Use `api.registerMediaUnderstandingProvider(...)` to register media understanding capabilities. The Provider Plugins guide contains further details.

```javascript
api.registerMediaUnderstandingProvider(...)
```

--------------------------------

### Configure Media Understanding Settings

Source: https://docs.openclaw.ai/nodes/media-understanding

Set up shared models, per-capability overrides, and provider-specific options for media understanding. This includes defaults for prompts, character/byte limits, timeouts, and provider details.

```json
{
  tools: {
    media: {
      models: [
        /* shared list */
      ],
      image: {
        /* optional overrides */
      },
      audio: {
        /* optional overrides */
        echoTranscript: true,
        echoFormat: '📝 "{transcript}"',
      },
      video: {
        /* optional overrides */
      },
    },
  },
}
```

--------------------------------

### Register Speech Provider

Source: https://docs.openclaw.ai/plugins/building-plugins

Use `api.registerSpeechProvider(...)` to register Speech (TTS/STT) capabilities. Additional details can be found in the Provider Plugins guide.

```javascript
api.registerSpeechProvider(...)
```

--------------------------------

### Run Non-Interactive Onboarding

Source: https://docs.openclaw.ai/providers/google

Performs onboarding without user prompts, useful for automated environments.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice gemini-api-key \
  --gemini-api-key "$GEMINI_API_KEY"
```

--------------------------------

### Register Channel Plugin

Source: https://docs.openclaw.ai/plugins/building-plugins

Use `api.registerChannel(...)` to register a channel or messaging capability. Detailed instructions are available in the Channel Plugins guide.

```javascript
api.registerChannel(...)
```

--------------------------------

### Launch Openclaw with Podman

Source: https://docs.openclaw.ai/install/podman

Use this script to launch Openclaw with Podman. It respects environment variables for configuration.

```bash
./scripts/run-openclaw-podman.sh
```

--------------------------------

### Register CLI Inference Backend

Source: https://docs.openclaw.ai/plugins/building-plugins

Use `api.registerCliBackend(...)` to register a CLI inference backend. See the CLI Backends guide for more information.

```javascript
api.registerCliBackend(...)
```

--------------------------------

### Enabling Optional Tools in Configuration

Source: https://docs.openclaw.ai/plugins/building-plugins

Shows how to configure which optional tools are enabled by listing their names in the `tools.allow` array within the plugin's configuration.

```json5
{
  tools: { allow: ["workflow_tool"] },
}
```

--------------------------------

### Manage Voice Calls with OpenClaw

Source: https://docs.openclaw.ai/cli/voicecall

Commands for checking status, initiating, continuing, and ending voice calls. Requires the voice-call plugin to be installed and enabled.

```bash
openclaw voicecall status --call-id <id>
openclaw voicecall call --to "+15555550123" --message "Hello" --mode notify
openclaw voicecall continue --call-id <id> --message "Any questions?"
openclaw voicecall end --call-id <id>
```

--------------------------------

### Example TTS Reply Payload

Source: https://docs.openclaw.ai/tools/tts

Demonstrates how to use TTS directives within a reply to override voice settings and provide expressive text tags.

```text
Here you go.

[[tts:voiceId=pMsXgVXv3BLzUgSXRplE model=eleven_v3 speed=1.1]]
[[tts:text]](laughs) Read the song once more.[[/tts:text]]
```

--------------------------------

### Performance and Profiling Commands

Source: https://docs.openclaw.ai/reference/test

Commands for benchmarking test performance and generating CPU/heap profiles.

```bash
pnpm test:perf:imports
```

```bash
pnpm test:perf:imports:changed
```

```bash
pnpm test:perf:changed:bench -- --ref <git-ref>
```

```bash
pnpm test:perf:changed:bench -- --worktree
```

```bash
pnpm test:perf:profile:main
```

```bash
pnpm test:perf:profile:runner
```

--------------------------------

### Configure Default Agent Model for SGLang

Source: https://docs.openclaw.ai/providers/sglang

Configure the default agent model to use a model served by SGLang. This is an example of an OpenClaw configuration file.

```json
{
  "agents": {
    "defaults": {
      "model": { "primary": "sglang/your-model-id" },
    },
  },
}
```

--------------------------------

### Non-Streaming API Request

Source: https://docs.openclaw.ai/gateway/openresponses-http-api

Example cURL command to send a non-streaming request to the OpenClaw API. Ensure to replace YOUR_TOKEN with your actual authentication token.

```bash
curl -sS http://127.0.0.1:18789/v1/responses \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'x-openclaw-agent-id: main' \
  -d '{
    "model": "openclaw",
    "input": "hi"
  }'
```

--------------------------------

### OpenClaw Multi-Agent Routing Configuration

Source: https://docs.openclaw.ai/concepts/delegate-architecture

Configure bindings to route specific channels and accounts to a delegate agent. This example shows routing for WhatsApp and Discord.

```json5
{
  agents: {
    list: [
      { id: "main", workspace: "~/.openclaw/workspace" },
      {
        id: "delegate",
        workspace: "~/.openclaw/workspace-delegate",
        tools: {
          deny: ["browser", "canvas"],
        },
      },
    ],
  },
  bindings: [
    // Route a specific channel account to the delegate
    {
      agentId: "delegate",
      match: { channel: "whatsapp", accountId: "org" },
    },
    // Route a Discord guild to the delegate
    {
      agentId: "delegate",
      match: { channel: "discord", guildId: "123456789012345678" },
    },
    // Everything else goes to the main personal agent
    { agentId: "main", match: { channel: "whatsapp" } },
  ],
}
```

--------------------------------

### Provision Compute Engine VM

Source: https://docs.openclaw.ai/install/gcp

Creates a Debian 12 instance with the specified machine type and disk size.

```bash
gcloud compute instances create openclaw-gateway \
  --zone=us-central1-a \
  --machine-type=e2-small \
  --boot-disk-size=20GB \
  --image-family=debian-12 \
  --image-project=debian-cloud
```

--------------------------------

### Configure Telegram Error Policies

Source: https://docs.openclaw.ai/channels/telegram

Example configuration for setting global error policies and cooldowns, with a specific override to suppress errors in a designated group.

```json5
{
  channels: {
    telegram: {
      errorPolicy: "reply",
      errorCooldownMs: 120000,
      groups: {
        "-1001234567890": {
          errorPolicy: "silent", // suppress errors in this group
        },
      },
    },
  },
}
```

--------------------------------

### Import Plugin SDK Entry Points

Source: https://docs.openclaw.ai/plugins/sdk-overview

Use specific subpaths for importing plugin SDK modules to maintain fast startup and prevent circular dependencies. Prefer `openclaw/plugin-sdk/channel-core` for channel-specific helpers.

```typescript
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { defineChannelPluginEntry } from "openclaw/plugin-sdk/channel-core";
```

--------------------------------

### Onboard with Vercel AI Gateway API Key

Source: https://docs.openclaw.ai/start/wizard-cli-automation

Connect to Vercel AI Gateway using its API key. Ensure AI_GATEWAY_API_KEY is set in your environment.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice ai-gateway-api-key \
  --ai-gateway-api-key "$AI_GATEWAY_API_KEY" \
  --gateway-port 18789 \
  --gateway-bind loopback
```

--------------------------------

### Configure Group Reply Behavior

Source: https://docs.openclaw.ai/channels/groups

Set group policies to control agent replies. This example allows all groups but requires a mention to trigger a reply.

```json
groups: { "*": { requireMention: true } }
```

--------------------------------

### Configure Exec Approvals (system.run)

Source: https://docs.openclaw.ai/platforms/macos

Defines security policies and allowlists for command execution. Use this JSON to configure default security levels and specific patterns for allowed binaries.

```json
{
  "version": 1,
  "defaults": {
    "security": "deny",
    "ask": "on-miss"
  },
  "agents": {
    "main": {
      "security": "allowlist",
      "ask": "on-miss",
      "allowlist": [{ "pattern": "/opt/homebrew/bin/rg" }]
    }
  }
}
```

--------------------------------

### Onboard Arcee AI API Key

Source: https://docs.openclaw.ai/providers/arcee

Use this command to set up your Arcee AI API key for direct access. Ensure you have obtained an API key from the Arcee AI platform.

```bash
openclaw onboard --auth-choice arceeai-api-key
```

--------------------------------

### Trigger Agent Directly

Source: https://docs.openclaw.ai/pi-dev

Manually trigger an OpenClaw agent with a specific message and thinking level. This is part of the manual testing flow after starting the gateway.

```bash
pnpm openclaw agent --message "Hello" --thinking low
```

--------------------------------

### Reset Matrix Backup Baseline

Source: https://docs.openclaw.ai/channels/matrix

Resets the room-key backup to start a new baseline. Use this when accepting the loss of unrecoverable old encrypted history.

```bash
openclaw matrix verify backup reset --yes
openclaw matrix verify backup status --verbose
openclaw matrix verify status
```

--------------------------------

### Device Auth v2 Migration and Troubleshooting

Source: https://docs.openclaw.ai/gateway/troubleshooting

Commands and logic for verifying device authentication and handling nonce/signature errors.

```APIDOC
## Device Auth v2 Migration

### Description
Verify system status and troubleshoot nonce/signature errors during the connection handshake.

### Verification Commands
```bash
openclaw --version
openclaw doctor
openclaw gateway status
```

### Connection Handshake Logic
1. Wait for `connect.challenge`
2. Sign the challenge-bound payload
3. Send `connect.params.device.nonce` with the same challenge nonce
```

--------------------------------

### Run Main-Thread CPU Profile for Vitest/Vite Startup

Source: https://docs.openclaw.ai/help/testing

Executes a performance profile focusing on the main thread during Vitest/Vite startup and transformation overhead. Useful for identifying performance bottlenecks in the build process.

```bash
pnpm test:perf:profile:main
```

--------------------------------

### Openclaw CLI: List and Info Hooks

Source: https://docs.openclaw.ai/automation/hooks

Use the CLI to list all hooks or show detailed information about a specific hook.

```bash
# List all hooks (add --eligible, --verbose, or --json)
openclaw hooks list

# Show detailed info about a hook
openclaw hooks info <hook-name>
```

--------------------------------

### Run Ansible Playbook Directly

Source: https://docs.openclaw.ai/install/ansible

Executes the Ansible playbook directly and prompts for the become password. After playbook execution, manually run the setup script.

```bash
ansible-playbook playbook.yml --ask-become-pass
# Then run: /tmp/openclaw-setup.sh
```

--------------------------------

### Create Kind Kubernetes Cluster

Source: https://docs.openclaw.ai/install/kubernetes

Use this script to create a local Kubernetes cluster with Kind. It auto-detects Docker or Podman. Use the --delete flag to tear down the cluster.

```bash
./scripts/k8s/create-kind.sh
./scripts/k8s/create-kind.sh --delete
```

--------------------------------

### Logging API

Source: https://docs.openclaw.ai/plugins/sdk-runtime

Provides utilities for logging within the Openclaw runtime. You can check if verbose logging is enabled or get a child logger for specific components.

```APIDOC
## Logging API

### Description
Provides utilities for logging within the Openclaw runtime. You can check if verbose logging is enabled or get a child logger for specific components.

### Methods
- `shouldLogVerbose()`: Checks if verbose logging is enabled.
- `getChildLogger(options)`: Returns a child logger instance.

### Example
```typescript
const verbose = api.runtime.logging.shouldLogVerbose();
const childLogger = api.runtime.logging.getChildLogger({ plugin: "my-plugin" }, { level: "debug" });
```
```

--------------------------------

### Deploy OpenClaw on Kubernetes

Source: https://docs.openclaw.ai/install/kubernetes

Replace `<PROVIDER>` with your model provider (e.g., ANTHROPIC, GEMINI, OPENAI, OPENROUTER). This script handles setting up secrets and deploying OpenClaw.

```bash
export <PROVIDER>_API_KEY="..."
./scripts/k8s/deploy.sh
```

--------------------------------

### Add Copilot GitHub Token to .env File

Source: https://docs.openclaw.ai/help/faq

Place your Copilot GitHub token in the `~/.openclaw/.env` file to ensure it's loaded when the Gateway runs as a service and doesn't inherit your shell environment.

```text
COPILOT_GITHUB_TOKEN=...
```

--------------------------------

### OpenClaw Config Commands

Source: https://docs.openclaw.ai/cli/index

Manage OpenClaw configuration settings interactively or non-interactively. Supports getting, setting, unsetting, and validating configuration values and schemas.

```APIDOC
## `config`

Non-interactive config helpers (get/set/unset/file/schema/validate). Running `openclaw config` with no subcommand launches the wizard.

### Subcommands:

* `config get <path>`: print a config value (dot/bracket path).
* `config set`: supports four assignment modes:
  * value mode: `config set <path> <value>` (JSON5-or-string parsing)
  * SecretRef builder mode: `config set <path> --ref-provider <provider> --ref-source <source> --ref-id <id>`
  * provider builder mode: `config set secrets.providers.<alias> --provider-source <env|file|exec> ...`
  * batch mode: `config set --batch-json '<json>'` or `config set --batch-file <path>`
* `config set --dry-run`: validate assignments without writing `openclaw.json` (exec SecretRef checks are skipped by default).
* `config set --allow-exec --dry-run`: opt in to exec SecretRef dry-run checks (may execute provider commands).
* `config set --dry-run --json`: emit machine-readable dry-run output (checks + completeness signal, operations, refs checked/skipped, errors).
* `config set --strict-json`: require JSON5 parsing for path/value input. `--json` remains a legacy alias for strict parsing outside dry-run output mode.
* `config unset <path>`: remove a value.
* `config file`: print the active config file path.
* `config schema`: print the generated JSON schema for `openclaw.json`, including propagated field `title` / `description` docs metadata across nested object, wildcard, array-item, and composition branches, plus best-effort live plugin/channel schema metadata.
* `config validate`: validate the current config against the schema without starting the gateway.
* `config validate --json`: emit machine-readable JSON output.
```

--------------------------------

### Get TTS Status

Source: https://docs.openclaw.ai/cli/infer

Check the status of the Text-to-Speech service. Defaults to gateway as it reflects gateway-managed state. Use --json for structured output.

```bash
openclaw infer tts status --json
```

--------------------------------

### Register Video Generation Provider

Source: https://docs.openclaw.ai/plugins/building-plugins

Use `api.registerVideoGenerationProvider(...)` to register video generation capabilities. See the Provider Plugins guide for detailed instructions.

```javascript
api.registerVideoGenerationProvider(...)
```

--------------------------------

### Register Image Generation Provider

Source: https://docs.openclaw.ai/plugins/building-plugins

Use `api.registerImageGenerationProvider(...)` to register image generation capabilities. Refer to the Provider Plugins guide for implementation details.

```javascript
api.registerImageGenerationProvider(...)
```

--------------------------------

### Initialize Memory Tools

Source: https://docs.openclaw.ai/plugins/sdk-runtime

Create memory-related tools and register CLI commands for the plugin.

```typescript
const getTool = api.runtime.tools.createMemoryGetTool(/* ... */);
const searchTool = api.runtime.tools.createMemorySearchTool(/* ... */);
api.runtime.tools.registerMemoryCli(/* ... */);
```

--------------------------------

### Register Realtime Voice Provider

Source: https://docs.openclaw.ai/plugins/building-plugins

Use `api.registerRealtimeVoiceProvider(...)` to register realtime voice capabilities. See the Provider Plugins guide for detailed steps.

```javascript
api.registerRealtimeVoiceProvider(...)
```

--------------------------------

### plugin-sdk/run-command

Source: https://docs.openclaw.ai/plugins/sdk-migration

Utilities for executing system commands with normalized output.

```APIDOC
## plugin-sdk/run-command

### Description
Provides a timed command runner that captures and normalizes stdout and stderr streams.
```

--------------------------------

### Register Text Inference Provider

Source: https://docs.openclaw.ai/plugins/building-plugins

Use `api.registerProvider(...)` to register a text inference (LLM) capability. Refer to the Provider Plugins guide for details.

```javascript
api.registerProvider(...)
```

--------------------------------

### Verify OpenClaw Service Status

Source: https://docs.openclaw.ai/install/ansible

Check the current status of the OpenClaw systemd service to ensure it is running correctly. This is a fundamental step in verifying a successful installation.

```bash
sudo systemctl status openclaw
```

--------------------------------

### Disable Read-Only Root Filesystem

Source: https://docs.openclaw.ai/gateway/sandboxing

Disables the read-only root filesystem for the sandbox container. This is required if the `setupCommand` needs to write to the root directory, such as for package installations.

```yaml
agents.defaults.sandbox.docker.readOnlyRoot: false
```

--------------------------------

### Verify Gateway Configuration After Upgrade

Source: https://docs.openclaw.ai/gateway/troubleshooting

Check gateway mode, remote URL, and authentication settings to resolve issues caused by configuration drift or changed defaults.

```bash
openclaw gateway status
openclaw config get gateway.mode
openclaw config get gateway.remote.url
openclaw config get gateway.auth.mode
```

--------------------------------

### Run OpenClaw Doctor

Source: https://docs.openclaw.ai/gateway/doctor

Execute the `openclaw doctor` command to initiate the repair and migration process. This command checks for and applies necessary fixes to your OpenClaw installation.

```bash
openclaw doctor
```

--------------------------------

### Skills Management API

Source: https://docs.openclaw.ai/cli/index

Manage and inspect AI skills, including searching, installing, updating, and listing them. Supports various options for filtering and output formatting.

```APIDOC
## Skills Management

List and inspect available skills plus readiness info.

### Subcommands

* `skills search [query...]`: search ClawHub skills.
* `skills search --limit <n> --json`: cap search results or emit machine-readable output.
* `skills install <slug>`: install a skill from ClawHub into the active workspace.
* `skills install <slug> --version <version>`: install a specific ClawHub version.
* `skills install <slug> --force`: overwrite an existing workspace skill folder.
* `skills update <slug|--all>`: update tracked ClawHub skills.
* `skills list`: list skills (default when no subcommand).
* `skills list --json`: emit machine-readable skill inventory on stdout.
* `skills list --verbose`: include missing requirements in the table.
* `skills info <name>`: show details for one skill.
* `skills info <name> --json`: emit machine-readable details on stdout.
* `skills check`: summary of ready vs missing requirements.
* `skills check --json`: emit machine-readable readiness output on stdout.

### Options

* `--eligible`: show only ready skills.
* `--json`: output JSON (no styling).
* `-v`, `--verbose`: include missing requirements detail.

### Tip

Use `openclaw skills search`, `openclaw skills install`, and `openclaw skills update` for ClawHub-backed skills.
```

--------------------------------

### Create and use custom browser profiles

Source: https://docs.openclaw.ai/help/faq

Commands to define a custom browser profile and execute commands using that specific profile.

```bash
openclaw browser create-profile --name chrome-live --driver existing-session
openclaw browser --browser-profile chrome-live tabs
```

--------------------------------

### Update Skills

Source: https://docs.openclaw.ai/cli/skills

Updates skills. The --all flag updates all tracked ClawHub installs in the active workspace. Individual skills can also be updated by providing their slug.

```bash
openclaw skills update <slug>
```

```bash
openclaw skills update --all
```

--------------------------------

### SKILL.md Frontmatter Example

Source: https://docs.openclaw.ai/tools/skills

This markdown snippet shows the required frontmatter for a `SKILL.md` file, including name and description. The parser supports single-line frontmatter keys only.

```markdown
---
name: image-lab
description: Generate or edit images via a provider-backed image workflow
---
```

--------------------------------

### Configure Video Generation Model

Source: https://docs.openclaw.ai/providers/xai

Set the default video generation model to xAI's Grok Imagine Video.

```json5
{
  agents: {
    defaults: {
      videoGenerationModel: {
        primary: "xai/grok-imagine-video",
      },
    },
  },
}
```

--------------------------------

### Deploy with Private Configuration

Source: https://docs.openclaw.ai/install/fly

Deploy your application using a private configuration file. This is essential for hardened deployments with no public exposure.

```bash
fly deploy -c fly.private.toml
```

--------------------------------

### Configure QQ Bot with File-backed Secret

Source: https://docs.openclaw.ai/channels/qqbot

Uses a file path to provide the client secret instead of plaintext in the configuration.

```json5
{
  channels: {
    qqbot: {
      enabled: true,
      appId: "YOUR_APP_ID",
      clientSecretFile: "/path/to/qqbot-secret.txt",
    },
  },
}
```

--------------------------------

### Set Default Together AI Model

Source: https://docs.openclaw.ai/providers/together

Configure the default primary model for agents using a JSON configuration. This example sets Kimi K2.5 as the default.

```json5
{
  agents: {
    defaults: {
      model: { primary: "together/moonshotai/Kimi-K2.5" },
    },
  },
}
```

--------------------------------

### Copy Workspace Templates

Source: https://docs.openclaw.ai/reference/AGENTS.default

Populates the workspace with default configuration templates.

```bash
cp docs/reference/templates/AGENTS.md ~/.openclaw/workspace/AGENTS.md
cp docs/reference/templates/SOUL.md ~/.openclaw/workspace/SOUL.md
cp docs/reference/templates/TOOLS.md ~/.openclaw/workspace/TOOLS.md
```

--------------------------------

### Set Default Arcee AI Model

Source: https://docs.openclaw.ai/providers/arcee

Configure Openclaw to use a specific Arcee AI model as the default. This example sets 'arcee/trinity-large-thinking' as the primary model.

```json
{
  agents: {
    defaults: {
      model: { primary: "arcee/trinity-large-thinking" },
    },
  },
}
```

--------------------------------

### Streaming API Request

Source: https://docs.openclaw.ai/gateway/openresponses-http-api

Example cURL command to initiate a streaming request for Server-Sent Events (SSE) from the OpenClaw API. The '-N' flag prevents buffering.

```bash
curl -N http://127.0.0.1:18789/v1/responses \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'x-openclaw-agent-id: main' \
  -d '{
    "model": "openclaw",
    "stream": true,
    "input": "hi"
  }'
```

--------------------------------

### Enable partial streaming previews

Source: https://docs.openclaw.ai/channels/matrix

Configures the Matrix channel to use partial streaming for live preview updates during generation.

```json5
{
  channels: {
    matrix: {
      streaming: "partial",
    },
  },
}
```

--------------------------------

### Interactive Model Selection via Command

Source: https://docs.openclaw.ai/help/faq

Use the `/model` command without arguments or with `list` to display a numbered picker for selecting models.

```bash
/model
```

```bash
/model list
```

```bash
/model 3
```

--------------------------------

### Enable Delivery in TUI

Source: https://docs.openclaw.ai/web/tui

To enable message delivery to providers within the TUI, use the `/deliver on` slash command or start the TUI with the `--deliver` flag.

```bash
openclaw tui --deliver
```

--------------------------------

### Basic ClawDock Operations

Source: https://docs.openclaw.ai/install/clawdock

These commands manage the OpenClaw gateway service running in Docker. Use them to start, stop, restart, check status, and view logs.

```bash
clawdock-start
```

```bash
clawdock-stop
```

```bash
clawdock-restart
```

```bash
clawdock-status
```

```bash
clawdock-logs
```

--------------------------------

### Configure exec pathPrepend

Source: https://docs.openclaw.ai/tools/exec

Sets directories to prepend to the PATH for exec runs in gateway and sandbox environments. Ensure paths are correctly formatted.

```json
{
  tools: {
    exec: {
      pathPrepend: ["~/bin", "/opt/oss/bin"],
    },
  },
}
```

--------------------------------

### Non-Interactive Fireworks Onboarding

Source: https://docs.openclaw.ai/providers/fireworks

This command performs non-interactive onboarding for the Fireworks provider, suitable for automated setups. It requires specifying the API key and accepting risks.

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice fireworks-api-key \
  --fireworks-api-key "$FIREWORKS_API_KEY" \
  --skip-health \
  --accept-risk
```

--------------------------------

### Configure Ollama API Key

Source: https://docs.openclaw.ai/providers/ollama

Enable Ollama integration by setting the required API key via environment variables or the OpenClaw configuration CLI.

```bash
# Set environment variable
export OLLAMA_API_KEY="ollama-local"

# Or configure in your config file
openclaw config set models.providers.ollama.apiKey "ollama-local"
```

--------------------------------

### Reduce Memory Usage for Headless Setups

Source: https://docs.openclaw.ai/install/raspberry-pi

Frees GPU memory and disables unused services for headless OpenClaw deployments. This is particularly useful on resource-constrained devices.

```bash
echo 'gpu_mem=16' | sudo tee -a /boot/config.txt
sudo systemctl disable bluetooth
```

--------------------------------

### Load Existing SSH Public Key

Source: https://docs.openclaw.ai/install/azure

Loads your existing SSH public key from the default location into a variable. Ensure the path `~/.ssh/id_ed25519.pub` is correct for your setup.

```bash
SSH_PUB_KEY="$(cat ~/.ssh/id_ed25519.pub)"
```

--------------------------------

### Inspect Gateway Configuration Schema

Source: https://docs.openclaw.ai/cli

Use the `config.schema.lookup` RPC to inspect a configuration subtree with a shallow schema node, matched hint metadata, and immediate child summaries.

```bash
gateway call config.schema.lookup
```

--------------------------------

### Gateway and System Status Checks

Source: https://docs.openclaw.ai/gateway/multiple-gateways

Perform deep status checks on Gateway instances and probe for connectivity, useful for diagnosing issues and confirming multi-gateway setups.

```bash
openclaw --profile main gateway status --deep
openclaw --profile rescue gateway status --deep
openclaw --profile rescue gateway probe
openclaw --profile main status
openclaw --profile rescue status
openclaw --profile rescue browser status
```