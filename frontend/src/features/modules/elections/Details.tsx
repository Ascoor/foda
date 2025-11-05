import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/infrastructure/shared/ui/button";
import { fetchElection, deleteElection, updateElection } from "./api";
import { ElectionForm } from "./Form";

export const ElectionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: election } = useQuery({
    queryKey: ["election", id],
    queryFn: () => fetchElection(id!),
  });

  const deleteMut = useMutation({
    mutationFn: deleteElection,
    onSuccess: () => navigate("/elections"),
  });

  if (!election) return null;

  return (
    <div className="space-y-4">
      {editing ? (
        <ElectionForm
          defaultValues={election}
          onSubmit={async (data) => {
            await updateElection(id!, data);
            setEditing(false);
            queryClient.invalidateQueries({ queryKey: ["election", id] });
            queryClient.invalidateQueries({ queryKey: ["elections"] });
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="space-y-4 glass-card p-4">
          <h1 className="text-3xl font-bold text-gradient-primary">
            {election.name}
          </h1>
          <p>{t(`elections.types.${election.type}`)}</p>
          <p>
            {election.start_date} - {election.end_date}
          </p>
          {election.description && <p>{election.description}</p>}
          <div className="flex gap-2 pt-4">
            <Button onClick={() => setEditing(true)}>{t("common.edit")}</Button>
            <Button variant="destructive" onClick={() => deleteMut.mutate(id!)}>
              {t("common.delete")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
