# oc-custom-mcp-plugin

An opencode plugin that removes disabled MCP servers from the merged runtime
config so they do not appear in the sidebar or `/status`.

MCP entries are removed only when `enabled` is explicitly `false`. Entries with
`enabled: true` or no `enabled` field are preserved.

## Usage

Add the plugin to your opencode config:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["./path/to/oc-custom-mcp-plugin/index.ts"]
}
```

Then configure MCP servers normally:

```json
{
  "mcp": {
    "old-server": {
      "enabled": false,
      "type": "remote",
      "url": "https://example.com/mcp"
    },
    "playwright": {
      "type": "local",
      "command": ["bunx", "@playwright/mcp"]
    }
  }
}
```

After changing plugin or MCP config, restart opencode. Config is loaded once at
startup.

## Development

Install dependencies:

```bash
bun install
```

Run tests:

```bash
bun test
```

Run checks:

```bash
bun run typecheck
bun run check
```
