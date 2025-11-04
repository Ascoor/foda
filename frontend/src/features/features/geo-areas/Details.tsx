import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/infrastructure/shared/ui/button";
import { fetchGeoArea, deleteGeoArea } from "./api";
import { GeoAreaForm } from "./Form";

export const GeoAreaDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: area } = useQuery({
    queryKey: ["geo-area", id],
    queryFn: () => fetchGeoArea(id!),
    enabled: !!id,
  });

  const deleteMut = useMutation({
    mutationFn: deleteGeoArea,
    onSuccess: () => navigate("/geo-areas"),
  });

  if (!area) return null;

  return (
    <div className="space-y-4">
      {editing ? (
        <GeoAreaForm
          isOpen={true}
          onClose={() => setEditing(false)}
          onSuccess={() => {
            setEditing(false);
            queryClient.invalidateQueries({ queryKey: ["geo-area", id] });
            queryClient.invalidateQueries({ queryKey: ["geo-areas"] });
          }}
          area={area}
          parentAreas={[]}
        />
      ) : (
        <div className="space-y-4 glass-card p-4">
          <h1 className="text-3xl font-bold text-gradient-primary">
            {area.name}
          </h1>
          <p>{t(`geo_areas.types.${area.type}`)}</p>
          {area.parent_name && <p>{area.parent_name}</p>}
          <p>
            {t("geo_areas.total_voters")}: {area.total_voters}
          </p>
          <p>
            {t("geo_areas.total_committees")}: {area.total_committees}
          </p>
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
