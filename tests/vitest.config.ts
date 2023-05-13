import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    watch: false,
    threads: false, // tests use a real DB, so parallel runs are a no-go
    setupFiles: "tests/setup-tests.ts",
    coverage: {
      provider: "c8",
      include: ["src/**"],
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
    },
  },
});
