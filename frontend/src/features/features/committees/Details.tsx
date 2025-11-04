import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/infrastructure/shared/ui/button";
import { AssignDialog } from "@/infrastructure/shared/ui/assign-dialog";
import {
  fetchCommittee,
  deleteCommittee,
  updateCommittee,
  assignMembers,
} from "./api";
import { CommitteeForm } from "./Form";

export const CommitteeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const { data: committee } = useQuery({
    queryKey: ["committee", id],
    queryFn: () => fetchCommittee(id!),
  });

  const deleteMut = useMutation({
    mutationFn: deleteCommittee,
    onSuccess: () => navigate("/committees"),
  });

  if (!committee) return null;

  return (
    <div className="space-y-4">
      {editing ? (
        <CommitteeForm
          defaultValues={committee}
          onSubmit={async (data) => {
            await updateCommittee(id!, data);
            setEditing(false);
            queryClient.invalidateQueries({ queryKey: ["committee", id] });
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="space-y-4 glass-card p-4">
          <h1 className="text-3xl font-bold text-gradient-primary">
            {committee.name}
          </h1>
          <p>{committee.location}</p>
          <p>{committee.geo_area_name}</p>
          <div className="flex gap-2 pt-4">
            <Button onClick={() => setEditing(true)}>{t("common.edit")}</Button>
            <Button variant="destructive" onClick={() => deleteMut.mutate(id!)}>
              {t("common.delete")}
            </Button>
            <Button variant="outline" onClick={() => setAssignOpen(true)}>
              {t("committees.assign_members")}
            </Button>
          </div>
        </div>
      )}

      <AssignDialog
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
        title={t("committees.assign_members")}
        onAssign={(ids) => assignMembers(id!, ids)}
        items={[]}
      />
    </div>
  );
};
