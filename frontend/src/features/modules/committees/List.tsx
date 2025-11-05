import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/infrastructure/shared/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/infrastructure/shared/ui/button";
import { Input } from "@/infrastructure/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/infrastructure/shared/ui/select";
import {
  fetchCommittees,
  deleteCommittee,
  createCommittee,
  updateCommittee,
  fetchGeoAreas,
} from "./api";
import { Committee, GeoArea } from "./types";
import { CommitteeForm } from "./Form";

export const CommitteesList = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Committee | null>(null);

  const { data: areas } = useQuery<{ data: GeoArea[] }>({
    queryKey: ["geo-areas"],
    queryFn: fetchGeoAreas,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["committees", page, search, areaFilter],
    queryFn: () =>
      fetchCommittees({
        page,
        per_page: 10,
        search,
        geo_area_id: areaFilter || undefined,
      }),
    placeholderData: (prevData) => prevData,
  });

  const committees: Committee[] = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 10) || 1;

  const deleteMutation = useMutation({
    mutationFn: deleteCommittee,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["committees"] }),
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleExport = () => {
    const headers = ["id", "name", "location", "geo_area_id"];
    const rows = committees.map((c) =>
      [c.id, c.name, c.location, c.geo_area_id].join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "committees.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gradient-primary">
          {t("committees.title")}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="glass-button"
            onClick={handleExport}
          >
            {t("committees.export_csv")}
          </Button>
          <Button
            className="glass-button bg-gradient-primary text-white"
            onClick={() => {
              setSelected(null);
              setShowForm(true);
            }}
          >
            {t("committees.add_committee")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder={t("committees.search_placeholder")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="glass max-w-sm"
        />
        <Select
          value={areaFilter}
          onValueChange={(val) => {
            setAreaFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="glass max-w-xs">
            <SelectValue placeholder={t("committees.area")} />
          </SelectTrigger>
          <SelectContent>
            {areas?.data?.map((a: GeoArea) => (
              <SelectItem key={a.id} value={String(a.id)}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">
                {t("committees.committee_name")}
              </th>
              <th className="px-4 py-2 text-left">
                {t("committees.location")}
              </th>
              <th className="px-4 py-2 text-left">{t("committees.area")}</th>
              <th className="px-4 py-2 text-left">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {committees.map((c) => (
              <tr key={c.id} className="border-t border-white/10">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.location}</td>
                <td className="px-4 py-2">{c.geo_area_name}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/committees/${c.id}`)}
                  >
                    {t("common.view")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelected(c);
                      setShowForm(true);
                    }}
                  >
                    {t("common.edit")}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(c.id)}
                  >
                    {t("common.delete")}
                  </Button>
                </td>
              </tr>
            ))}
            {committees.length === 0 && !isLoading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-4 text-center text-muted-foreground"
                >
                  {t("common.no_data")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          {t("common.previous")}
        </Button>
        <span>
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          {t("common.next")}
        </Button>
      </div>

      {showForm && (
        <div className="glass-card p-4">
          <CommitteeForm
            defaultValues={selected || undefined}
            onSubmit={async (formData) => {
              if (selected) {
                await updateCommittee(selected.id, formData);
              } else {
                await createCommittee(formData);
              }
              setShowForm(false);
              queryClient.invalidateQueries({ queryKey: ["committees"] });
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
};
