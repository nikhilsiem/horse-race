// Test setup file for Vitest
import { vi } from 'vitest'

// Mock global objects if needed
global.console = {
  ...console,
  // Uncomment to ignore specific console methods in tests
  // log: vi.fn(),
  // warn: vi.fn(),
  // error: vi.fn(),
}