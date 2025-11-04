import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/infrastructure/shared/ui/button";
import { fetchCandidate, deleteCandidate, updateCandidate } from "./api";
import { CandidateForm } from "./Form";
import { CandidateFormData } from "./types";

export const CandidateDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: candidate } = useQuery({
    queryKey: ["candidate", id],
    queryFn: () => fetchCandidate(id!),
    enabled: !!id,
  });

  const deleteMut = useMutation({
    mutationFn: deleteCandidate,
    onSuccess: () => navigate("/candidates"),
  });

  if (!candidate) return null;

  return (
    <div className="space-y-4">
      {editing ? (
        <CandidateForm
          defaultValues={candidate}
          onSubmit={async (data: CandidateFormData) => {
            await updateCandidate(id!, data);
            setEditing(false);
            queryClient.invalidateQueries({ queryKey: ["candidate", id] });
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="space-y-4 glass-card p-4">
          <h1 className="text-3xl font-bold text-gradient-primary">
            {candidate.name}
          </h1>
          <p>{candidate.party}</p>
          <p>{t(`candidates.types.${candidate.type}`)}</p>
          <p>{t(`candidates.status_options.${candidate.status}`)}</p>
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
