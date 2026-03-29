import apiClient from "@/services/apiClient";
import { DLQEvent, DLQEventById, parsePayload } from "./dlq.types";

export const getDLQEvents = async (): Promise<DLQEvent[]> => {
  const res = await apiClient.get("notification/dlq");
  return res.data;
};
export const getDLQEventById = async (id: string): Promise<DLQEventById> => {
  const res = await apiClient.get(`notification/dlq/${id}`);
  console.log("res data", res, parsePayload(res.data.payload),)
  return {
    ...res,
    payload: parsePayload(res.data.payload) ?? {},
  };
};

export const replayDLQEvent = async (id: string) => {
  return apiClient.post(`notification/dlq/${id}/replay`, {});
};
