import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmModal } from "@presentation/components/molecules/ConfirmModal";

function renderModal(overrides: Partial<React.ComponentProps<typeof ConfirmModal>> = {}) {
  const defaults = {
    isOpen: true,
    title: "Delete book?",
    description: "This cannot be undone.",
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };
  return render(<ConfirmModal {...defaults} {...overrides} />);
}

describe("ConfirmModal molecule", () => {
  it("is not rendered when isOpen=false", () => {
    renderModal({ isOpen: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders title and description when open", () => {
    renderModal();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Delete book?")).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    renderModal({ onConfirm });
    await user.click(screen.getByRole("button", { name: /confirm/i }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderModal({ onCancel });
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("calls onCancel when Escape key is pressed", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderModal({ onCancel });
    await user.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("does not call onCancel on Escape when isLoading=true", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderModal({ onCancel, isLoading: true });
    await user.keyboard("{Escape}");
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("disables confirm and cancel buttons when isLoading=true", () => {
    renderModal({ isLoading: true });
    const buttons = screen.getAllByRole("button");
    const disabledButtons = buttons.filter((b) => b.hasAttribute("disabled"));
    expect(disabledButtons.length).toBeGreaterThanOrEqual(2);
  });

  it("renders custom confirmLabel and cancelLabel", () => {
    renderModal({ confirmLabel: "Destroy", cancelLabel: "Keep" });
    expect(screen.getByRole("button", { name: "Destroy" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Keep" })).toBeInTheDocument();
  });
});
