import { useCallback, useEffect, useMemo, useState } from "react";
import { GotvVoter, gotvService } from "../services/gotv-service";
import { Totals } from "../types";

const getTotals = (voters: GotvVoter[]): Totals => {
  const total = voters.length;
  const voted = voters.filter((voter) => voter.hasVoted).length;
  const highPriority = voters.filter((voter) => voter.priority === "high" && !voter.hasVoted).length;

  return {
    total,
    voted,
    remaining: total - voted,
    highPriority,
  };
};

export const useGotv = () => {
  const [voters, setVoters] = useState<GotvVoter[]>([]);

  useEffect(() => {
    const load = async () => {
      const items = await gotvService.list();
      setVoters(items);
    };

    load();
  }, []);

  const markVoted = useCallback(async (id: string, hasVoted: boolean) => {
    const updated = await gotvService.markVoted(id, hasVoted);
    if (!updated) return;
    setVoters((prev) => prev.map((voter) => (voter.id === id ? updated : voter)));
  }, []);

  const totals = useMemo(() => getTotals(voters), [voters]);

  return {
    voters,
    totals,
    markVoted,
  };
};
