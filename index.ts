/**
 * opencode plugin that hides disabled MCP servers from UI surfaces backed by
 * the merged runtime config, including the sidebar and `/status`.
 *
 * Install this file as a plugin or place a copy in an opencode `plugins/`
 * directory for auto-discovery. MCP servers are hidden only when their config
 * explicitly sets `enabled: false`.
 */

export interface McpServerConfig {
  /** Whether opencode should enable this MCP server. `false` means hidden. */
  enabled?: boolean;
  [key: string]: unknown;
}

export interface RuntimeConfig {
  /** Merged opencode MCP server config keyed by server name. */
  mcp?: Record<string, McpServerConfig | undefined>;
  [key: string]: unknown;
}

interface Hooks {
  config?: (config: RuntimeConfig) => void | Promise<void>;
}

type Plugin = (input: unknown, options?: unknown) => Hooks | Promise<Hooks>;

/**
 * Removes MCP servers that are explicitly disabled from an opencode runtime
 * config object.
 *
 * opencode treats omitted `enabled` as enabled, so only `enabled: false` is
 * filtered out. The config object is mutated in place to match plugin hook
 * behavior and is also returned for easier testing/composition.
 */
export const removeDisabledMcps = <TConfig extends RuntimeConfig>(
  config: TConfig
): TConfig => {
  if (!config.mcp) {
    return config;
  }

  config.mcp = Object.fromEntries(
    Object.entries(config.mcp).filter(([, server]) => server?.enabled !== false)
  );

  return config;
};

/** opencode plugin entrypoint that hides disabled MCPs during config loading. */
const plugin = (() => ({
  config(config) {
    removeDisabledMcps(config);
  },
})) satisfies Plugin;

export default plugin;
