import apiClient from "@/services/apiClient";
import { DLQEvent, DLQEventById, parsePayload } from "./dlq.types";

export const getDLQEvents = async (): Promise<DLQEvent[]> => {
  return apiClient.get("notification/dlq");
};

export const getDLQEventById = async (id: string): Promise<DLQEventById> => {
  const res = await apiClient.get(`notification/dlq/${id}`);
  console.log("res data", res, parsePayload(res.payload),)
  return {
    ...res,
    payload: parsePayload(res.payload),
  };
};

export const replayDLQEvent = async (id: string) => {
  return apiClient.post(`notification/dlq/${id}/replay`, {});
};
