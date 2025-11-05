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
import { Alert, AlertDescription, AlertTitle } from "@/infrastructure/shared/ui/alert";
import { DataTableSkeleton, EmptyState } from "@/infrastructure/shared/ui/data-table-skeleton";
import { safeArray } from "@/infrastructure/shared/lib/utils";
import {
  fetchElections,
  deleteElection,
  createElection,
  updateElection,
} from "./api";
import { Election } from "./types";
import { ElectionForm } from "./Form";

export const ElectionsList = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Election | null>(null);

  const {
    data = { data: [], total: 0 },
    isLoading,
    error,
  } = useQuery<{ data: Election[]; total: number }>({
    queryKey: ["elections", page, search, statusFilter],
    queryFn: () =>
      fetchElections({
        page,
        per_page: 10,
        search,
        status:
          (statusFilter as "draft" | "active" | "completed" | "cancelled") ||
          undefined,
      }),
    placeholderData: (prevData) => prevData,
  });

  const elections = safeArray(data.data);
  const total = data.total ?? 0;
  const totalPages = Math.ceil(total / 10) || 1;

  const deleteMut = useMutation({
    mutationFn: deleteElection,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["elections"] }),
  });

  if (isLoading) return <DataTableSkeleton />;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t("common.error") || "Error"}</AlertTitle>
        <AlertDescription>{(error as Error).message}</AlertDescription>
      </Alert>
    );
  }

  if (elections.length === 0) {
    return <EmptyState title={t("common.no_data")} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gradient-primary">
          {t("elections.title")}
        </h1>
        <Button
          className="glass-button bg-gradient-primary text-white"
          onClick={() => {
            setSelected(null);
            setShowForm(true);
          }}
        >
          {t("elections.add_election")}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder={t("elections.search_placeholder")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="glass max-w-sm"
        />
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="glass max-w-xs">
            <SelectValue placeholder={t("common.status")} />
          </SelectTrigger>
          <SelectContent>
            {(["draft", "active", "completed", "cancelled"] as const).map(
              (s) => (
                <SelectItem key={s} value={s}>
                  {t(`elections.status.${s}`)}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">
                {t("elections.election_name")}
              </th>
              <th className="px-4 py-2 text-left">
                {t("elections.election_type")}
              </th>
              <th className="px-4 py-2 text-left">{t("common.status")}</th>
              <th className="px-4 py-2 text-left">
                {t("elections.start_date")}
              </th>
              <th className="px-4 py-2 text-left">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {elections.map((e) => (
              <tr key={e.id} className="border-t border-white/10">
                <td className="px-4 py-2">{e.name}</td>
                <td className="px-4 py-2">{t(`elections.types.${e.type}`)}</td>
                <td className="px-4 py-2">
                  {t(`elections.status.${e.status}`)}
                </td>
                <td className="px-4 py-2">{e.start_date}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/elections/${e.id}`)}
                  >
                    {t("common.view")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelected(e);
                      setShowForm(true);
                    }}
                  >
                    {t("common.edit")}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMut.mutate(e.id)}
                  >
                    {t("common.delete")}
                  </Button>
                </td>
              </tr>
            ))}
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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md">
            <ElectionForm
              defaultValues={selected || undefined}
              onSubmit={async (data) => {
                if (selected) {
                  await updateElection(selected.id, data);
                } else {
                  await createElection(data);
                }
                setShowForm(false);
                setSelected(null);
                queryClient.invalidateQueries({ queryKey: ["elections"] });
              }}
              onCancel={() => {
                setShowForm(false);
                setSelected(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
