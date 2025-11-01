import { useMemo, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { attachCommittees } from "@/shared/api/campaign";
import {
  fetchCircles,
  fetchCommittees,
  fetchGovernorates,
} from "@/shared/api/geo";
import type { GeoArea, Committee } from "@/shared/api/types";
import { useCampaignStore } from "@/shared/state/campaignStore";

export default function GeoWizard() {
  const { campaignId } = useCampaignStore();
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>("");
  const [selectedCircle, setSelectedCircle] = useState<string>("");
  const [selectedCommittees, setSelectedCommittees] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: governorates = [], isLoading: loadingGovernorates } = useQuery<GeoArea[]>(
    {
      queryKey: ["geo", "governorates"],
      queryFn: fetchGovernorates,
    },
  );

  const { data: circles = [], isFetching: loadingCircles } = useQuery<GeoArea[]>(
    {
      queryKey: ["geo", "circles", selectedGovernorate],
      queryFn: () => fetchCircles(selectedGovernorate),
      enabled: Boolean(selectedGovernorate),
    },
  );

  const { data: committees = [], isFetching: loadingCommittees } = useQuery<Committee[]>(
    {
      queryKey: ["geo", "committees", selectedCircle],
      queryFn: () => fetchCommittees(selectedCircle),
      enabled: Boolean(selectedCircle),
    },
  );

  const attachMutation = useMutation({
    mutationFn: () =>
      attachCommittees(campaignId!, selectedCommittees, {
        agent_quota: 2,
        target_voters: 1200,
      }),
    onSuccess: () => {
      setSelectedCommittees([]);
      queryClient.invalidateQueries({ queryKey: ["campaign", "committees", campaignId] });
    },
  });

  const canAttach = useMemo(
    () => Boolean(campaignId && selectedCommittees.length > 0),
    [campaignId, selectedCommittees.length],
  );

  const toggleCommittee = (committeeId: string, checked: boolean) => {
    setSelectedCommittees((prev) => {
      if (checked) {
        if (prev.includes(committeeId)) {
          return prev;
        }
        return [...prev, committeeId];
      }
      return prev.filter((id) => id !== committeeId);
    });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">اختيار النطاق وربط اللجان</h2>
        <p className="text-sm text-muted-foreground">
          اختر المحافظة ثم الدائرة لعرض اللجان المتاحة وربطها بالحملة الحالية.
        </p>
      </header>

      {!campaignId && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          الرجاء اختيار حملة أولاً من القائمة العلوية قبل ربط اللجان.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            المحافظة
          </label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20 dark:border-slate-700 dark:bg-slate-900"
            value={selectedGovernorate}
            onChange={(event) => {
              setSelectedGovernorate(event.target.value);
              setSelectedCircle("");
              setSelectedCommittees([]);
            }}
          >
            <option value="">
              {loadingGovernorates ? "جار التحميل…" : "اختر محافظة"}
            </option>
            {governorates.map((governorate) => (
              <option key={governorate.id} value={governorate.id}>
                {governorate.code}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            الدائرة (مركز / قسم / مدينة)
          </label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20 dark:border-slate-700 dark:bg-slate-900"
            value={selectedCircle}
            onChange={(event) => {
              setSelectedCircle(event.target.value);
              setSelectedCommittees([]);
            }}
            disabled={!selectedGovernorate}
          >
            <option value="">
              {selectedGovernorate
                ? loadingCircles
                  ? "جار التحميل…"
                  : "اختر دائرة"
                : "اختر محافظة أولاً"}
            </option>
            {circles.map((circle) => (
              <option key={circle.id} value={circle.id}>
                {circle.type?.toUpperCase()} — {circle.code}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
            disabled={!canAttach || attachMutation.isPending}
            onClick={() => attachMutation.mutate()}
          >
            {attachMutation.isPending ? "جار الربط…" : "ربط اللجان المختارة"}
          </button>
        </div>
      </div>

      <section className="space-y-2">
        <header className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            اللجان المتاحة
          </span>
          <span className="text-xs text-muted-foreground">
            {selectedCommittees.length} لجنة محددة
          </span>
        </header>
        <div className="max-h-80 space-y-1 overflow-auto rounded-md border border-gray-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {!selectedCircle && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              اختر دائرة لعرض اللجان التابعة لها.
            </div>
          )}

          {selectedCircle && loadingCommittees && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              جاري تحميل اللجان…
            </div>
          )}

          {selectedCircle && !loadingCommittees && committees.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              لا توجد لجان متاحة لهذه الدائرة.
            </div>
          )}

          {selectedCircle &&
            !loadingCommittees &&
            committees.map((committee) => {
              const isChecked = selectedCommittees.includes(committee.id);
              return (
                <label
                  key={committee.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                    checked={isChecked}
                    onChange={(event) =>
                      toggleCommittee(committee.id, event.target.checked)
                    }
                  />
                  <span>
                    <span className="font-medium">{committee.code}</span>
                    <span className="mx-2 text-muted-foreground">—</span>
                    <span>{committee.name}</span>
                  </span>
                </label>
              );
            })}
        </div>
      </section>
    </div>
  );
}
