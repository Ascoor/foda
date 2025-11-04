import {
  Component,
  ReactNode,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Download,
} from "lucide-react";
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
import {
  ErrorDisplay,
  LoadingSpinner,
  SafeDataRenderer,
} from "@/infrastructure/shared/ui/safe-data-renderer";
import { useToast } from "@/infrastructure/shared/hooks/use-toast";
import { logError } from "@/infrastructure/shared/lib/logging";
import { Agent, AgentFilters } from "./types";
import { deleteAgent, assignAgent, mockCommittees, exportAgents } from "./api";
import { AgentForm } from "./AgentForm";
import { AgentDetails } from "./AgentDetails";
import { useAgentsData, invalidateAgentsCache } from "./useAgentsData";

class AgentsListErrorBoundary extends Component<
  {
    children: ReactNode;
    onRetry: () => void;
    title: string;
  },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined as Error | undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    logError(error.message, errorInfo);
    console.error(error);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onRetry();
  };

  render() {
    const { children, title } = this.props;
    const { hasError, error } = this.state;

    if (hasError && error) {
      return (
        <ErrorDisplay error={error} onRetry={this.handleRetry} title={title} />
      );
    }

    return children;
  }
}

const AgentsListFallback = ({ message }: { message: string }) => (
  <div className="glass-card">
    <LoadingSpinner message={message} />
  </div>
);

type AgentsListSuspendedProps = {
  filters: AgentFilters;
  search: string;
  onView: (agent: Agent) => void;
  onEdit: (agent: Agent) => void;
  onAssign: (agent: Agent) => void;
  onDelete: (agent: Agent) => void;
  onExport: () => Promise<void>;
  onRefresh: () => void;
  exportLabel: string;
};

const AgentsListSuspended = ({
  filters,
  search,
  onView,
  onEdit,
  onAssign,
  onDelete,
  onExport,
  onRefresh,
  exportLabel,
}: AgentsListSuspendedProps) => {
  const { t } = useTranslation();
  const agents = useAgentsData(filters);

  const filteredAgents = useMemo(
    () =>
      agents.filter((agent) =>
        agent.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [agents, search],
  );

  return (
    <>
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            void onExport();
          }}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" /> {exportLabel}
        </Button>
      </div>

      <SafeDataRenderer
        data={filteredAgents}
        emptyTitle={t("agents.no_results", { defaultValue: "No agents found" })}
        emptyDescription={t("agents.no_results_help", {
          defaultValue: "Adjust the filters or add agents to get started.",
        })}
        onRetry={onRefresh}
      >
        {(data) => (
          <div className="overflow-x-auto glass-card">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-4 py-2">{t("agents.agent_name")}</th>
                  <th className="px-4 py-2">{t("agents.mobile")}</th>
                  <th className="px-4 py-2">{t("agents.role")}</th>
                  <th className="px-4 py-2">
                    {t("agents.committee", { defaultValue: "Committee" })}
                  </th>
                  <th className="px-4 py-2">{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((agent) => (
                  <tr
                    key={agent.id}
                    className="border-t border-white/10 hover:bg-accent/5 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{agent.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {agent.mobile}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                        {agent.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">{agent.committee_name || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onView(agent)}
                          className="hover:bg-primary/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(agent)}
                          className="hover:bg-secondary/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onAssign(agent)}
                          className="hover:bg-accent/10"
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => onDelete(agent.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SafeDataRenderer>
    </>
  );
};

export const AgentsList = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [filters, setFilters] = useState<AgentFilters>({});
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [selected, setSelected] = useState<Agent | null>(null);
  const [, setReloadToken] = useState(0);

  const refresh = useCallback(() => {
    invalidateAgentsCache(filters);
    setReloadToken((token) => token + 1);
  }, [filters]);

  const handleAdd = () => {
    setSelected(null);
    setShowForm(true);
  };
  const handleEdit = (agent: Agent) => {
    setSelected(agent);
    setShowForm(true);
  };
  const handleView = (agent: Agent) => {
    setSelected(agent);
    setShowDetails(true);
  };
  const handleAssign = (agent: Agent) => {
    setSelected(agent);
    setShowAssign(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAgent(id);
      toast({
        title: t("common.delete"),
        description: t("agents.delete_success", {
          defaultValue: "Agent deleted successfully",
        }),
      });
      refresh();
    } catch (err) {
      toast({
        title: t("common.error"),
        description: t("agents.delete_error", {
          defaultValue: "Failed to delete agent",
        }),
        variant: "destructive",
      });
    }
  };

  const handleExport = useCallback(async () => {
    try {
      await exportAgents();
      toast({
        title: t("agents.export_title", { defaultValue: "Export" }),
        description: t("agents.export_success", {
          defaultValue: "Agents exported successfully",
        }),
      });
    } catch (err) {
      toast({
        title: t("common.error"),
        description: t("agents.export_error", {
          defaultValue: "Failed to export agents",
        }),
        variant: "destructive",
      });
    }
  }, [toast, t]);

  const onAssign = async (ids: string[]) => {
    if (selected && ids[0]) {
      try {
        await assignAgent(selected.id, ids[0]);
        toast({
          title: t("agents.assignment_title", { defaultValue: "Assignment" }),
          description: t("agents.assignment_success", {
            defaultValue: "Agent assigned successfully",
          }),
        });
        setShowAssign(false);
        refresh();
      } catch (err) {
        toast({
          title: t("common.error"),
          description: t("agents.assignment_error", {
            defaultValue: "Failed to assign agent",
          }),
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gradient-primary">
          {t("agents.title")}
        </h1>
        <Button onClick={handleAdd} className="bg-gradient-primary text-white">
          <Plus className="h-4 w-4 mr-2" />
          {t("agents.add_agent")}
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
        <Select onValueChange={(v) => setFilters((f) => ({ ...f, role: v }))}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("agents.role")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="observer">Observer</SelectItem>
            <SelectItem value="supervisor">Supervisor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AgentsListErrorBoundary
        onRetry={refresh}
        title={t("agents.load_error", {
          defaultValue: "Failed to load agents",
        })}
      >
        <Suspense
          fallback={
            <AgentsListFallback
              message={t("agents.loading", {
                defaultValue: "Loading agents...",
              })}
            />
          }
        >
          <AgentsListSuspended
            filters={filters}
            search={search}
            onView={handleView}
            onEdit={handleEdit}
            onAssign={handleAssign}
            onDelete={handleDelete}
            onExport={handleExport}
            onRefresh={refresh}
            exportLabel={t("agents.export_button", {
              defaultValue: "Export agents",
            })}
          />
        </Suspense>
      </AgentsListErrorBoundary>

      <AgentForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelected(null);
        }}
        onSuccess={() => {
          setShowForm(false);
          refresh();
        }}
        agent={selected}
      />
      <AgentDetails
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelected(null);
        }}
        agent={selected}
        onEdit={(agent) => {
          setShowDetails(false);
          handleEdit(agent);
        }}
      />
      <AssignDialog
        isOpen={showAssign}
        onClose={() => setShowAssign(false)}
        title={t("agents.assigned_committee")}
        items={mockCommittees.map((c) => ({ id: c.id, name: c.name }))}
        onAssign={onAssign}
        multiSelect={false}
      />
    </div>
  );
};
