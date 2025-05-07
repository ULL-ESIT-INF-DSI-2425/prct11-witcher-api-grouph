import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 15000,
    hookTimeout: 15000,
    coverage: {
      include: ["src/**/*"],
      exclude: ["docs/**/*", "src/inquirer/*"],
    },
  },
});
