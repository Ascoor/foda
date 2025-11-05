import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Eye, Edit, Trash2, UserCheck } from "lucide-react";
import { Button } from "@/infrastructure/shared/ui/button";
import { Input } from "@/infrastructure/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/infrastructure/shared/ui/select";
import { AssignDialog } from "@/infrastructure/shared/ui/assign-dialog";
import { Volunteer, VolunteerFilters } from "./types";
import { fetchVolunteers, deleteVolunteer, assignVolunteer } from "./api";
import { VolunteerForm } from "./VolunteerForm";
import { VolunteerDetails } from "./VolunteerDetails";
import { request } from "@/infrastructure/shared/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/shared/lib/endpoints";
import type { Committee } from "@/types";

const DEFAULT_META = { total: 0, per_page: 0, current_page: 0 };

export const VolunteersList = () => {
  const { t } = useTranslation();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filters, setFilters] = useState<VolunteerFilters>({});
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [selected, setSelected] = useState<Volunteer | null>(null);
  const [meta, setMeta] = useState(DEFAULT_META);
  const [committees, setCommittees] = useState<Committee[]>([]);

  const committeeLookup = useMemo(() => {
    return new Map(
      committees.map((committee) => [committee.uuid, committee.name]),
    );
  }, [committees]);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchVolunteers({ ...filters, search });
      setVolunteers(response.data);
      setMeta(response.meta ?? DEFAULT_META);
    } catch (error) {
      console.error("Failed to load volunteers", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, search]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const loadCommittees = async () => {
      try {
        const res = await request<{ data: Committee[] }>({
          url: API_ENDPOINTS.elections.committees,
          method: "get",
          params: { per_page: 100 },
        });
        setCommittees(res.data);
      } catch (error) {
        console.error("Failed to load committees", error);
      }
    };

    loadCommittees();
  }, []);

  const handleAdd = () => {
    setSelected(null);
    setShowForm(true);
  };
  const handleEdit = (volunteer: Volunteer) => {
    setSelected(volunteer);
    setShowForm(true);
  };
  const handleView = (volunteer: Volunteer) => {
    setSelected(volunteer);
    setShowDetails(true);
  };
  const handleAssign = (volunteer: Volunteer) => {
    setSelected(volunteer);
    setShowAssign(true);
  };

  const onAssign = async (ids: string[]) => {
    if (selected && ids[0]) {
      await assignVolunteer(selected.uuid, ids[0]);
      setShowAssign(false);
      load();
    }
  };

  const committeeItems = committees.map((committee) => ({
    id: committee.uuid,
    name: committee.name,
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gradient-primary">
          {t("volunteers.title")}
        </h1>
        <Button onClick={handleAdd} className="bg-gradient-primary text-white">
          <Plus className="h-4 w-4 mr-2" />
          {t("volunteers.add_volunteer")}
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("common.search") ?? "Search"}
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              status: value as Volunteer["status"],
            }))
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue
              placeholder={t("volunteers.status_filter", {
                defaultValue: "Status",
              })}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">
              {t("status.active", { defaultValue: "Active" })}
            </SelectItem>
            <SelectItem value="onboarding">
              {t("status.onboarding", { defaultValue: "Onboarding" })}
            </SelectItem>
            <SelectItem value="inactive">
              {t("status.inactive", { defaultValue: "Inactive" })}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto glass-card">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2">{t("volunteers.volunteer_name")}</th>
              <th className="px-4 py-2">
                {t("volunteers.status", { defaultValue: "Status" })}
              </th>
              <th className="px-4 py-2">
                {t("volunteers.assigned_area") || "Committee"}
              </th>
              <th className="px-4 py-2">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((volunteer) => {
              const committeeName = volunteer.assigned_committee_uuid
                ? (committeeLookup.get(volunteer.assigned_committee_uuid) ??
                  "-")
                : "-";

              return (
                <tr key={volunteer.uuid} className="border-t border-white/10">
                  <td className="px-4 py-2">{volunteer.full_name}</td>
                  <td className="px-4 py-2 capitalize">{volunteer.status}</td>
                  <td className="px-4 py-2">{committeeName}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleView(volunteer)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(volunteer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAssign(volunteer)}
                    >
                      <UserCheck className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={async () => {
                        await deleteVolunteer(volunteer.uuid);
                        load();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
            {!isLoading && volunteers.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-4 text-muted-foreground"
                >
                  {t("common.no_data") || "No data"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <VolunteerForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelected(null);
        }}
        onSuccess={() => {
          setShowForm(false);
          load();
        }}
        volunteer={selected}
      />
      <VolunteerDetails
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelected(null);
        }}
        volunteer={selected}
        committeeName={
          selected?.assigned_committee_uuid
            ? (committeeLookup.get(selected.assigned_committee_uuid) ??
              undefined)
            : undefined
        }
        onEdit={(volunteer) => {
          setShowDetails(false);
          handleEdit(volunteer);
        }}
      />
      <AssignDialog
        isOpen={showAssign}
        onClose={() => setShowAssign(false)}
        title={t("volunteers.assigned_area") || "Assign"}
        items={committeeItems}
        onAssign={onAssign}
        multiSelect={false}
      />

      <div className="text-xs text-muted-foreground">
        {t("common.total_results", {
          defaultValue: "Total results: {{count}}",
          count: meta.total,
        })}
      </div>
    </div>
  );
};
