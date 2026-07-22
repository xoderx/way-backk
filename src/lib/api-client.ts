import { ApiResponse } from "../../shared/types"
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(path, {
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {})
      },
      ...init
    })
    const json = (await res.json()) as ApiResponse<T>
    if (!res.ok || !json.success || json.data === undefined) {
      console.error(`[API ERROR] ${path}:`, json.error || 'Request failed');
      throw new Error(json.error || 'Request failed');
    }
    return json.data;
  } catch (err: any) {
    console.error(`[FETCH FAILURE] ${path}:`, err.message);
    throw err;
  }
}
/**
 * Generic patch helper for CRM updates with Auth support
 */
export async function patch<T>(path: string, body: any, headers?: Record<string, string>): Promise<T> {
  return api<T>(path, {
    method: 'PATCH',
    headers: {
      ...headers
    },
    body: JSON.stringify(body)
  });
}