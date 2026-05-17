type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  token?: string | null;
  headers?: Record<string, string>; // Changed from HeadersInit for easier manipulation
};

const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiRequest<T = any>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { method = "GET", body, token, headers } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
    method,
    headers: finalHeaders,
    body: method !== "GET" && body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));

    const error = new Error(errorBody.message || `API Error: ${res.status}`);

    (error as any).validationErrors =
      errorBody.error?.issues || errorBody.issues || null;
    (error as any).status = res.status;

    throw error;
  }

  if (res.status === 204) return {} as T;

  return res.json();
}

export const api = {
  get: <T,>(path: string) => apiRequest<T>(path),

  post: <T,>(path: string, body?: any) =>
    apiRequest<T>(path, { method: "POST", body }),

  put: <T,>(path: string, body?: any) =>
    apiRequest<T>(path, { method: "PUT", body }),

  delete: <T,>(path: string) => apiRequest<T>(path, { method: "DELETE" }),

  getAuth: <T,>(path: string) =>
    apiRequest<T>(path, {
      token: localStorage.getItem("token"),
    }),

  postAuth: <T,>(path: string, body?: any) =>
    apiRequest<T>(path, {
      method: "POST",
      body,
      token: localStorage.getItem("token"),
    }),

  putAuth: <T,>(path: string, body?: any) =>
    apiRequest<T>(path, {
      method: "PUT",
      body,
      token: localStorage.getItem("token"),
    }),
  deleteAuth: <T,>(path: string, body?: any) =>
    apiRequest<T>(path, {
      method: "DELETE",
      body,
      token: localStorage.getItem("token"),
    }),
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const isLogin = () => {
  if (localStorage.getItem("token")) return true;
  else return false;
};
