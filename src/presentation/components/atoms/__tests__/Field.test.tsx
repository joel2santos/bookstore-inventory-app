import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Field } from "@presentation/components/atoms/Field";

describe("Field atom", () => {
  it("renders a text input with label", () => {
    render(
      <Field
        label="Title"
        type="text"
        value=""
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  it("displays the placeholder", () => {
    render(
      <Field
        label="Author"
        placeholder="e.g. Cervantes"
        value=""
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByPlaceholderText(/cervantes/i)).toBeInTheDocument();
  });

  it("calls onChange when value changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field label="Title" value="" onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "a");
    expect(onChange).toHaveBeenCalled();
  });

  it("renders an error message and sets aria-invalid", () => {
    render(
      <Field
        label="ISBN"
        value="bad"
        onChange={vi.fn()}
        error="Invalid ISBN"
      />,
    );
    expect(screen.getByText("Invalid ISBN")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("renders a hint when no error is present", () => {
    render(
      <Field
        label="ISBN"
        value=""
        onChange={vi.fn()}
        hint="Hyphens allowed"
      />,
    );
    expect(screen.getByText("Hyphens allowed")).toBeInTheDocument();
  });

  it("error overrides hint (shows error only)", () => {
    render(
      <Field
        label="ISBN"
        value=""
        onChange={vi.fn()}
        hint="Hyphens allowed"
        error="Invalid ISBN"
      />,
    );
    expect(screen.getByText("Invalid ISBN")).toBeInTheDocument();
    expect(screen.queryByText("Hyphens allowed")).not.toBeInTheDocument();
  });

  it("is disabled when disabled=true", () => {
    render(<Field label="X" value="" onChange={vi.fn()} disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("renders a select with options", () => {
    render(
      <Field
        type="select"
        label="Category"
        value=""
        onChange={vi.fn()}
        options={[
          { label: "All", value: "" },
          { label: "Fantasy", value: "Fantasy" },
        ]}
      />,
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Fantasy" })).toBeInTheDocument();
  });

  it("renders a textarea for type=textarea", () => {
    render(
      <Field
        type="textarea"
        label="Notes"
        value=""
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("requires the input when required=true", () => {
    render(<Field label="X" value="" onChange={vi.fn()} required />);
    expect(screen.getByRole("textbox")).toBeRequired();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders left icon", () => {
    render(
      <Field
        label="X"
        value=""
        onChange={vi.fn()}
        leftIcon={<span data-testid="left-icon" />}
      />,
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders password toggle for type=password", async () => {
    const user = userEvent.setup();
    render(<Field type="password" label="Pass" value="secret" onChange={vi.fn()} />);
    const input = screen.getByLabelText("Pass");
    expect(input).toHaveAttribute("type", "password");
    // The toggle button has aria-label="Show password"
    const toggleBtn = screen.getByRole("button", { name: /show password/i });
    await user.click(toggleBtn);
    expect(input).toHaveAttribute("type", "text");
  });
});
