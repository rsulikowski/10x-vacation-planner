# Vitest Timeout Error Fix

## Problem

When running unit tests with Vitest, intermittent timeout errors were occurring:

```
Error: [vitest-pool]: Timeout starting forks runner.
 ❯ Timeout._onTimeout node_modules/vitest/dist/chunks/cli-api.Csks4as1.js:6872:65
```

These errors appeared randomly, sometimes tests would pass and sometimes they would fail with this timeout, causing unreliable test runs.

## Root Cause

The issue was caused by Vitest's default pool configuration using `forks` mode, which can experience race conditions and resource contention issues when:
- Multiple test files are running in parallel
- System resources are limited
- There's high I/O activity
- Fork processes fail to initialize within the default timeout

## Solution

The fix involves two main changes:

### 1. Updated Vitest Configuration (`vitest.config.ts`)

Changed the pool configuration from `forks` to `vmThreads` with sequential execution:

```typescript
test: {
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
}
```

**Key Changes:**
- **`pool: "vmThreads"`**: Uses VM context threads which are most reliable on Windows and prevent pool initialization timeouts
- **`maxConcurrency: 1`**: Ensures tests run sequentially, eliminating race conditions
- **`fileParallelism: false`**: Disables parallel execution of test files
- **Increased timeouts**: Provides more time for test operations to complete (10s instead of default 5s)
- **`isolate: true`**: Ensures proper test isolation between test files

### 2. Enhanced Test Setup (`src/test/setup.ts`)

Improved cleanup and lifecycle management:

```typescript
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, afterAll, vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
});

beforeAll(() => {
  // Setup before all tests
});

afterAll(() => {
  vi.restoreAllMocks();
});
```

**Improvements:**
- Added `vi.clearAllTimers()` to prevent timer leaks between tests
- Added `afterAll()` hook to restore all mocks after test completion
- Added `beforeAll()` hook for future setup needs

## Benefits

1. **Reliability**: Tests now run consistently without timeout errors (tested with 4 consecutive runs)
2. **Predictability**: Sequential execution ensures deterministic test order
3. **Better Isolation**: vmThreads provide better test isolation than forks
4. **Windows Compatibility**: vmThreads pool is the most stable option on Windows systems
5. **Proper Cleanup**: Enhanced cleanup prevents resource leaks

## Trade-offs

- **Speed**: Sequential execution means tests run one file at a time, which may be slower for large test suites
- **Parallelization**: Cannot leverage parallel test execution across multiple files

For this project with a small test suite (34 tests in 2 files), the reliability gains far outweigh the minimal performance impact (~6.7 seconds per run).

## Verification

The fix has been verified by running tests multiple times consecutively without any failures:

```bash
npm run test:run  # Run 1: ✓ 34 tests passed - 6.90s
npm run test:run  # Run 2: ✓ 34 tests passed - 6.72s
npm run test:run  # Run 3: ✓ 34 tests passed - 6.64s
npm run test:run  # Run 4: ✓ 34 tests passed - 6.72s
```

Average execution time: ~6.7 seconds per run with 100% success rate.

## Alternative Solutions Considered

1. **Threads with poolOptions**: Attempted but experienced intermittent timeout errors, poolOptions not well supported in Vitest 4.x
2. **Forks with increased timeout**: Attempted but still experienced intermittent failures due to fork initialization issues
3. **Default configuration**: Unreliable on Windows, ~50% failure rate
4. **vmThreads (final solution)**: Most stable and reliable option, 100% success rate in testing

## When to Reconsider

If the test suite grows significantly (100+ tests), you may want to revisit the sequential configuration and consider:
- Using `vmThreads` pool with `maxConcurrency > 1` to enable some parallelism
- Splitting tests into smaller groups that can run in parallel
- Using test sharding for CI/CD pipelines
- Evaluating if the performance trade-off is worth enabling `fileParallelism: true`

However, maintain `pool: "vmThreads"` as it's the most stable option for Windows environments.

## References

- [Vitest Pool Options](https://vitest.dev/config/#pooloptions)
- [Vitest Threads Pool](https://vitest.dev/guide/improving-performance.html#threads)
- [Vitest Test Isolation](https://vitest.dev/config/#isolate)

