const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  pagination?: { page: number; pageSize: number; total: number };
}

async function serverFetch<T = unknown>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const url = `${BACKEND_URL}${path}`;
  const res = await fetch(url, { next: { revalidate: 60 }, ...options });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `请求失败: ${res.status}`);
  }

  return res.json();
}

export default serverFetch;
