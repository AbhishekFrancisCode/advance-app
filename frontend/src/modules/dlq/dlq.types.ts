export interface DLQEvent {
  id: string;
  topic: string;
  error: string;
  createdAt: string;
  status: "PENDING" | "REPLAYED";
}

type DLQPayload =
  | Record<string, unknown>
  | string
  | null;
export interface DLQEventById {
  id: string;
  topic: string;
  error: string;
  createdAt: string;
  payload?: DLQPayload;
  status: "PENDING" | "REPLAYED";
}

export const parsePayload = (
  payload: DLQPayload
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, unknown> | any[] | null => {
  if (!payload) return null;

  if (typeof payload === "object") return payload as Record<string, unknown>;

  if (typeof payload === "string") {
    try {
      const parsed = JSON.parse(payload);
      
      if (typeof parsed === "object" && parsed !== null) {
        return parsed;
      }

      return null;
    } catch {
      return null; 
    }
  }

  return null;
}