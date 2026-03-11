import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Track matchMedia mock so we can change it per test
let prefersDark = false;
Object.defineProperty(window, "matchMedia", {
  value: (query: string) => ({
    matches: query === "(prefers-color-scheme: dark)" ? prefersDark : false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

// @req SCD-UI-006
describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorageMock.clear();
    prefersDark = false;
    document.documentElement.classList.remove("dark");
  });

  it("toggles between dark and light", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Dark");
    fireEvent.click(button);
    expect(button).toHaveTextContent("Light");
  });

  it("persists selection in localStorage", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(localStorageMock.getItem("theme")).toBe("dark");
  });

  it("respects prefers-color-scheme dark on first visit", () => {
    prefersDark = true;
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    // When prefers-color-scheme is dark and no localStorage, button should show "Light" (meaning we're in dark mode)
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Light");
  });
});
