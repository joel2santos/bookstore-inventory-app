import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiFetch, ApiError } from "@data/api/fetchClient";

function makeFetchMock(response: Partial<Response>): typeof fetch {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ results: [] }),
    ...response,
  } as Response);
}

describe("apiFetch", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("calls fetch with the correct URL and JSON headers", async () => {
    const mockFetch = makeFetchMock({ json: async () => ({ ok: true }) });
    globalThis.fetch = mockFetch;

    await apiFetch("/books/");

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, init] = (mockFetch as ReturnType<typeof vi.fn>).mock.calls[0] as [
      string,
      RequestInit,
    ];
    expect(url).toContain("/books/");
    expect((init.headers as Record<string, string>)["Accept"]).toBe("application/json");
  });

  it("sends JSON body for POST requests", async () => {
    const mockFetch = makeFetchMock({ status: 201, json: async () => ({ id: 1 }) });
    globalThis.fetch = mockFetch;

    await apiFetch("/books/", { method: "POST", body: { title: "Test" } });

    const [, init] = (mockFetch as ReturnType<typeof vi.fn>).mock.calls[0] as [
      string,
      RequestInit,
    ];
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ title: "Test" });
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe(
      "application/json",
    );
  });

  it("resolves undefined for 204 No Content", async () => {
    globalThis.fetch = makeFetchMock({ ok: true, status: 204 });
    const result = await apiFetch("/books/1/");
    expect(result).toBeUndefined();
  });

  it("throws ApiError with the detail message on non-ok response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ detail: "Book not found" }),
    } as Response);

    await expect(apiFetch("/books/999/")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      message: "Book not found",
    });
  });

  it("throws ApiError with field errors mapped correctly", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        isbn: ["Invalid ISBN-13 check digit"],
        cost_usd: ["cost_usd must be greater than 0"],
      }),
    } as Response);

    let caughtError: ApiError | undefined;
    try {
      await apiFetch("/books/", { method: "POST", body: {} });
    } catch (err) {
      caughtError = err as ApiError;
    }

    expect(caughtError).toBeInstanceOf(ApiError);
    expect(caughtError?.fieldErrors).toMatchObject({
      isbn: ["Invalid ISBN-13 check digit"],
      cost_usd: ["cost_usd must be greater than 0"],
    });
  });

  it("throws ApiError with a generic message when body is not parseable JSON", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => { throw new SyntaxError("bad json"); },
    } as unknown as Response);

    await expect(apiFetch("/books/")).rejects.toMatchObject({
      name: "ApiError",
      status: 500,
    });
  });

  it("appends query params to the URL", async () => {
    const mockFetch = makeFetchMock({ json: async () => ({}) });
    globalThis.fetch = mockFetch;

    await apiFetch("/books/", { params: { page: 2, category: "Fantasy" } });

    const [url] = (mockFetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string];
    expect(url).toContain("page=2");
    expect(url).toContain("category=Fantasy");
  });

  it("omits undefined params from the URL", async () => {
    const mockFetch = makeFetchMock({ json: async () => ({}) });
    globalThis.fetch = mockFetch;

    await apiFetch("/books/", { params: { page: 1, category: undefined } });

    const [url] = (mockFetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string];
    expect(url).not.toContain("category");
  });
});
