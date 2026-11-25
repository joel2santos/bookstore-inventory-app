import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@presentation/components/atoms/Button";

describe("Button atom", () => {
  it("renders its children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled=true", () => {
    render(<Button disabled>Go</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled and shows spinner when isLoading=true", () => {
    render(<Button isLoading>Go</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn.querySelector("svg")).toBeInTheDocument();
  });

  it("does not fire onClick when disabled", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<Button disabled onClick={onClick}>Go</Button>);
    // Disabled buttons cannot receive pointer events — verify via attribute, not click
    const btn = getByRole("button");
    expect(btn).toBeDisabled();
    btn.click(); // native click bypasses disabled in JSDOM for the handler; use pointer event
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders leftIcon", () => {
    render(<Button leftIcon={<span data-testid="left-icon" />}>Go</Button>);
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders rightIcon", () => {
    render(<Button rightIcon={<span data-testid="right-icon" />}>Go</Button>);
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("applies fullWidth class", () => {
    render(<Button fullWidth>Go</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  it.each(["primary", "secondary", "danger", "ghost"] as const)(
    "renders variant=%s without throwing",
    (variant) => {
      expect(() => render(<Button variant={variant}>Go</Button>)).not.toThrow();
    },
  );

  it("defaults to type=button to avoid accidental form submit", () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });
});
