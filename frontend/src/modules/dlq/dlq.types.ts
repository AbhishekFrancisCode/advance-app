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

export const parsePayload = (payload: DLQPayload) => {
  if (!payload) return null;

  if (typeof payload === "object") return payload;

  if (typeof payload === "string") {
    try {
      return JSON.parse(payload);
    } catch {
      return payload;
    }
  }

  return payload;
};