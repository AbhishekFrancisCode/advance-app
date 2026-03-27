import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDLQEventById, getDLQEvents, replayDLQEvent } from "./dlq.service";

export const useDLQEvents = () => {
  return useQuery({
    queryKey: ["dlq"],
    queryFn: getDLQEvents,
  });
};

export const useDLQEvent = (id: string) => {
  return useQuery({
    queryKey: ["dlq", id],
    queryFn: () => getDLQEventById(id),
    enabled: !!id,
  });
};

export const useReplayDLQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: replayDLQEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dlq"] });
    },
  });
};
