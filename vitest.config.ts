import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['src/vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      enabled: true,
      include: ['src/app/**/*.ts'],
      exclude: ['**/*.spec.ts', 'src/app/**/*.html'],
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85
      }
    }
  }
});
