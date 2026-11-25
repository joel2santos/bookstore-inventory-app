export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    fieldErrors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

function buildUrl(
  path: string,
  params?: Record<string, string | number | undefined>,
): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const fullPath = `${BASE_URL}${normalizedPath}`;
  if (!params) return fullPath;

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  }
  const query = searchParams.toString();
  return query ? `${fullPath}?${query}` : fullPath;
}

function extractApiError(status: number, payload: unknown): ApiError {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (typeof record.detail === "string") {
      return new ApiError(record.detail, status);
    }

    const fieldErrors: Record<string, string[]> = {};
    for (const [key, val] of Object.entries(record)) {
      if (Array.isArray(val)) {
        fieldErrors[key] = val.map(String);
      } else if (typeof val === "string") {
        fieldErrors[key] = [val];
      }
    }

    const firstMessage = Object.entries(fieldErrors)[0];
    if (firstMessage) {
      return new ApiError(
        `${firstMessage[0]}: ${firstMessage[1].join(", ")}`,
        status,
        fieldErrors,
      );
    }
  }

  return new ApiError(`Request failed with status ${status}`, status);
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, params, signal } = options;
  const url = buildUrl(path, params);

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!response.ok) {
    let errorPayload: unknown = null;
    try {
      errorPayload = await response.json();
    } catch {
      errorPayload = null;
    }
    throw extractApiError(response.status, errorPayload);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
