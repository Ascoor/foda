import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/infrastructure/shared/ui/button";
import { fetchVoter, deleteVoter, updateVoter } from "./api";
import { VoterForm } from "./Form";
import { VoterFormData } from "./types";

export const VoterDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: voter } = useQuery({
    queryKey: ["voter", id],
    queryFn: () => fetchVoter(id!),
    enabled: !!id,
  });

  const deleteMut = useMutation({
    mutationFn: deleteVoter,
    onSuccess: () => navigate("/voters"),
  });

  if (!voter) return null;

  return (
    <div className="space-y-4">
      {editing ? (
        <VoterForm
          defaultValues={voter}
          onSubmit={async (data: VoterFormData) => {
            await updateVoter(id!, data);
            setEditing(false);
            queryClient.invalidateQueries({ queryKey: ["voter", id] });
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="space-y-4 glass-card p-4">
          <h1 className="text-3xl font-bold text-gradient-primary">
            {voter.full_name}
          </h1>
          <p>{voter.national_id}</p>
          <p>{voter.mobile}</p>
          <p>{t(`voters.gender_options.${voter.gender}`)}</p>
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
