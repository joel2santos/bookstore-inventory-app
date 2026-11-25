import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "@presentation/components/molecules/Pagination";

function renderPagination(
  overrides: Partial<React.ComponentProps<typeof Pagination>> = {},
) {
  const onPageChange = vi.fn();
  render(
    <Pagination
      page={1}
      totalCount={30}
      pageSize={10}
      hasNext={true}
      hasPrevious={false}
      onPageChange={onPageChange}
      {...overrides}
    />,
  );
  return { onPageChange };
}

describe("Pagination molecule", () => {
  it("renders nothing when totalCount=0", () => {
    const { container } = render(
      <Pagination
        page={1}
        totalCount={0}
        hasNext={false}
        hasPrevious={false}
        onPageChange={vi.fn()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("displays the current range and total", () => {
    renderPagination({ page: 1, totalCount: 30, pageSize: 10 });
    // "1" appears as both startItem and page number — use getAllByText
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("disables Previous button on the first page", () => {
    renderPagination({ page: 1, hasPrevious: false });
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  it("disables Next button on the last page", () => {
    renderPagination({ page: 3, totalCount: 30, pageSize: 10, hasNext: false, hasPrevious: true });
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("calls onPageChange with page-1 when Previous is clicked", async () => {
    const user = userEvent.setup();
    const { onPageChange } = renderPagination({
      page: 2,
      hasPrevious: true,
      hasNext: true,
    });
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange with page+1 when Next is clicked", async () => {
    const user = userEvent.setup();
    const { onPageChange } = renderPagination({ page: 1, hasNext: true });
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables both buttons when isLoading=true", () => {
    renderPagination({ isLoading: true, page: 2, hasPrevious: true, hasNext: true });
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });
});
