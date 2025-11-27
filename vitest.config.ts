import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vitest Configuration
 *
 * This configuration uses vmThreads pool for reliable test execution on Windows.
 * The pool setting and sequential execution (maxConcurrency: 1, fileParallelism: false)
 * prevent intermittent "Timeout starting forks/threads runner" errors.
 *
 * See docs/VITEST_TIMEOUT_FIX.md for more details.
 *
 * DO NOT change pool setting without understanding the implications and testing thoroughly.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist", ".astro", "e2e"],
    // Use vmThreads for better reliability on Windows
    pool: "vmThreads",
    // Increased timeouts to handle slower test environments
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    // Prevent test isolation issues
    isolate: true,
    // Single thread execution for reliability
    maxConcurrency: 1,
    // Disable file parallelism
    fileParallelism: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "json-summary", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData",
        "**/*.spec.{ts,tsx}",
        "**/*.test.{ts,tsx}",
        "dist/",
        ".astro/",
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
