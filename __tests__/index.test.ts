import { describe, expect, test } from "bun:test";

import { removeDisabledMcps } from "../index";
import type { RuntimeConfig } from "../index";

describe("removeDisabledMcps", () => {
  test("removes MCPs with enabled set to false", () => {
    const config: RuntimeConfig = {
      mcp: {
        disabled: { enabled: false, type: "local" },
        enabled: { enabled: true, type: "local" },
      },
    };

    removeDisabledMcps(config);

    expect(config.mcp).toEqual({
      enabled: { enabled: true, type: "local" },
    });
  });

  test("keeps MCPs with enabled omitted", () => {
    const config: RuntimeConfig = {
      mcp: {
        defaultEnabled: { type: "remote", url: "https://example.com/mcp" },
      },
    };

    removeDisabledMcps(config);

    expect(config.mcp).toEqual({
      defaultEnabled: { type: "remote", url: "https://example.com/mcp" },
    });
  });

  test("keeps MCPs with enabled set to true", () => {
    const config: RuntimeConfig = {
      mcp: {
        enabled: { enabled: true, type: "local" },
      },
    };

    removeDisabledMcps(config);

    expect(config.mcp).toEqual({
      enabled: { enabled: true, type: "local" },
    });
  });

  test("handles missing MCP config", () => {
    const config: RuntimeConfig = { username: "tito" };

    const result = removeDisabledMcps(config);

    expect(result).toBe(config);
    expect(config).toEqual({ username: "tito" });
  });

  test("handles empty MCP config", () => {
    const config: RuntimeConfig = { mcp: {} };

    removeDisabledMcps(config);

    expect(config.mcp).toEqual({});
  });

  test("removes multiple disabled MCPs while preserving visible MCPs", () => {
    const config: RuntimeConfig = {
      mcp: {
        disabledLocal: { enabled: false, type: "local" },
        disabledRemote: { enabled: false, type: "remote" },
        enabledLocal: { command: ["bunx", "@playwright/mcp"], type: "local" },
        enabledRemote: {
          enabled: true,
          type: "remote",
          url: "https://example.com/mcp",
        },
      },
    };

    removeDisabledMcps(config);

    expect(config.mcp).toEqual({
      enabledLocal: { command: ["bunx", "@playwright/mcp"], type: "local" },
      enabledRemote: {
        enabled: true,
        type: "remote",
        url: "https://example.com/mcp",
      },
    });
  });

  test("mutates the passed config object", () => {
    const config: RuntimeConfig = {
      mcp: {
        disabled: { enabled: false },
      },
    };

    const result = removeDisabledMcps(config);

    expect(result).toBe(config);
    expect(config.mcp).toEqual({});
  });
});
