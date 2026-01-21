# Better-Commit

AI-powered git commit message generator with a beautiful TUI (Terminal User Interface).

## Features

- **AI-Powered**: Uses Groq AI to generate intelligent, context-aware commit messages
- **Beautiful TUI**: Modern, interactive terminal interface with keyboard navigation
- **Smart**: Analyzes staged files, diffs, and recent commit history
- **Fast**: Built with Bun and optimized for speed
- **Configurable**: Personalized styles (Conventional, Simple, Detailed) and prompts
- **Iterative**: "Try again" option and manual editing

## Installation

### Prerequisites

- Node.js 18+ or Bun
- A Groq API key (get one free at [console.groq.com](https://console.groq.com))

### Quick Start

```bash
# Clone the repository
git clone https://github.com/snvshal/better-commit.git
cd better-commit

# Install dependencies
bun install

# Build the project
bun run build

# Link globally (optional)
npm link
```

## Usage

### 1. Setup

First, configure your API key:

```bash
better-commit config
```

Use the arrow keys to navigate and **Enter** to edit settings.

### 2. Generate Commits

Run the tool in any git repository:

```bash
# Run on currently staged files
better-commit

# Or stage all files and run (like git commit -am)
better-commit -a

# Push to remote after committing
better-commit -p

# Stage all files, commit, and push (like git commit -am && git push)
better-commit -ap
```

### Alias

You can use the short alias `bc` instead of typing `better-commit`:

```bash
bc          # Generate commit
bc -a       # Stage all and commit
bc -p       # Commit and push
bc -ap      # Stage all, commit, and push
bc config   # Open configuration
```

### 3. Workflow

1.  **Select**: App shows 4 AI-generated suggestions based on your changes.
2.  **Navigate**: Use `↑` / `↓` to choose a message.
3.  **Confirm**: Press `Enter` to commit with the selected message.
4.  **Refine**: Choose "Custom input" to write your own, or "Try again" for new ideas.
5.  **Cancel**: Press `Esc` or `Ctrl+C` to exit.

## Configuration

Run `better-commit config` to modify:

| Setting           | Description                             | Default                |
| :---------------- | :-------------------------------------- | :--------------------- |
| **Groq API Key**  | Your secret API key                     | Required               |
| **Model**         | AI model (Llama 3, GPT-OSS, etc.)       | `llama-3.1-8b-instant` |
| **Commit Style**  | `conventional`, `simple`, or `detailed` | `conventional`         |
| **Custom Prompt** | Extra instructions for the AI           | _None_                 |

## Development

```bash
# Install dependencies
bun install

# Run in development mode
bun run dev

# Build for production
bun run build

# Run production build
bun run start

# Run linting
bun run lint

# Type checking
bun run type-check

# Format code
bun run format
```

## License

MIT
