import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "@/shared/contexts/notification-context";
import { useRealtime } from "@/shared/hooks";
import { GotvStreamPayload } from "@/shared/api/dtos";
import { GotvVoter, gotvService } from "../services/gotv-service";
import { Totals } from "../types";

const computeTotals = (voters: GotvVoter[]): Totals => {
  const total = voters.length;
  const voted = voters.filter((voter) => voter.hasVoted).length;
  const highPriority = voters.filter(
    (voter) => voter.priority === "high" && !voter.hasVoted,
  ).length;

  return {
    total,
    voted,
    remaining: total - voted,
    highPriority,
  };
};

export const useGotv = () => {
  const queryClient = useQueryClient();
  const { push } = useNotifications();

  const { data: voters = [], isLoading } = useQuery({
    queryKey: ["gotv", "report"],
    queryFn: () => gotvService.list(),
    staleTime: 15_000,
  });

  const mutation = useMutation({
    mutationFn: ({ id, hasVoted }: { id: string; hasVoted: boolean }) =>
      gotvService.markVoted(id, hasVoted),
    onSuccess: (updated) => {
      if (!updated) return;
      queryClient.setQueryData<GotvVoter[]>(["gotv", "report"], (previous = []) =>
        previous.map((voter) => (voter.id === updated.id ? updated : voter)),
      );
    },
  });

  useRealtime<GotvStreamPayload>("gotv.attendance", {
    namespace: "gotv",
    onMessage: (payload) => {
      queryClient.setQueryData<GotvVoter[]>(["gotv", "report"], (previous = []) => {
        const next = [...previous];
        const index = next.findIndex((item) => item.id === String(payload.voter.id));
        const mapped = gotvService.mapFromDto(payload.voter);
        if (index >= 0) {
          next[index] = mapped;
        } else {
          next.unshift(mapped);
        }

        return next;
      });

      if (payload.turnout.attendance_rate < 0.5) {
        push(gotvService.createAlertFromPayload(payload));
      }
    },
  });

  const markVoted = useCallback(
    async (id: string, hasVoted: boolean) => {
      await mutation.mutateAsync({ id, hasVoted });
    },
    [mutation],
  );

  const totals = useMemo(() => computeTotals(voters), [voters]);

  return {
    voters,
    totals,
    markVoted,
    isLoading,
  };
};
