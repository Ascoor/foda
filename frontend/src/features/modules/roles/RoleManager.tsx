import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/infrastructure/shared/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/infrastructure/shared/ui/table";
import { Switch } from "@/infrastructure/shared/ui/switch";
import { Badge } from "@/infrastructure/shared/ui/badge";
import { Skeleton } from "@/infrastructure/shared/ui/skeleton";
import { useToast } from "@/infrastructure/shared/hooks/use-toast";
import { fetchRoles, updateRole } from "./api";
import type { RoleRecord } from "./types";

const permissionDictionary: Record<
  string,
  {
    label: string;
    description: string;
    scope?: "system" | "election" | "committee" | "shared";
  }
> = {
  "manage users": {
    label: "إدارة المستخدمين",
    description: "إنشاء حسابات جديدة وتعديل بيانات الوصول.",
    scope: "system",
  },
  "manage volunteers": {
    label: "تنسيق المتطوعين",
    description: "إضافة ومتابعة المتطوعين على مستوى اللجان.",
    scope: "committee",
  },
  "manage settings": {
    label: "إعدادات المنصة",
    description: "التحكم في إعدادات النظام والحملات العامة.",
    scope: "system",
  },
  "manage campaigns": {
    label: "إدارة الحملات",
    description: "تخطيط الحملات وتتبع أدائها اليومي.",
    scope: "election",
  },
  "assign committees": {
    label: "تعيين اللجان",
    description: "توزيع المسؤوليات على اللجان الميدانية.",
    scope: "committee",
  },
  "monitor results": {
    label: "مراقبة النتائج",
    description: "متابعة نتائج الفرز اللحظية وتحديد مؤشرات المخاطر.",
    scope: "election",
  },
  "audit activities": {
    label: "تدقيق الأنشطة",
    description: "مراجعة الأنشطة الحساسة وتوثيق أي تجاوزات.",
    scope: "system",
  },
  "view analytics": {
    label: "عرض التحليلات",
    description: "الوصول إلى لوحات المتابعة والرسوم البيانية.",
    scope: "shared",
  },
};

export function RoleManager() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<string[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchRoles();
        setRoles(response.data);
        setAvailablePermissions(response.permissions);
      } catch (err) {
        setError("تعذر تحميل بيانات الأدوار.");
        toast({
          variant: "destructive",
          title: "فشل التحميل",
          description: "تحقق من الاتصال بالخادم وأعد المحاولة.",
        });
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [toast]);

  const allPermissions = useMemo(
    () => availablePermissions,
    [availablePermissions],
  );

  const handlePermissionToggle = useCallback(
    async (role: RoleRecord, permission: string, enabled: boolean) => {
      const previous = roles;
      const updatedPermissions = enabled
        ? Array.from(new Set([...role.permissions, permission]))
        : role.permissions.filter((item) => item !== permission);

      setRoles((current) =>
        current.map((item) =>
          item.id === role.id
            ? { ...item, permissions: updatedPermissions }
            : item,
        ),
      );

      try {
        const { data } = await updateRole(role.id, {
          permissions: updatedPermissions,
        });
        setRoles((current) =>
          current.map((item) =>
            item.id === role.id ? { ...item, ...data } : item,
          ),
        );
        toast({
          title: "تم تحديث الصلاحيات",
          description: `تم ${enabled ? "تفعيل" : "تعطيل"} الصلاحية بنجاح.`,
        });
      } catch (err) {
        setRoles(previous);
        toast({
          variant: "destructive",
          title: "تعذر حفظ التعديل",
          description: "حدث خطأ أثناء تحديث الصلاحية، تمت إعادة الوضع السابق.",
        });
      }
    },
    [roles, toast],
  );

  const renderThresholds = (role: RoleRecord) => {
    const rules = role.auto_assign_rules;
    if (!rules || typeof rules !== "object") return null;

    const thresholds =
      (rules.thresholds as Record<string, number> | undefined) ?? {};

    if (!Object.keys(thresholds).length) return null;

    return (
      <div className="mt-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">
          معايير الترقية الذكية:
        </span>
        <ul className="mt-1 list-disc space-y-1 pr-5">
          {Object.entries(thresholds).map(([metric, value]) => (
            <li key={metric}>
              {metric === "activities_created" && `إنجاز ${value} نشاط ميداني.`}
              {metric === "volunteers_managed" &&
                `إدارة ${value} متطوعًا أو أكثر.`}
              {metric === "committees_assigned" && `الإشراف على ${value} لجنة.`}
              {metric === "campaigns_managed" &&
                `إدارة ${value} حملة انتخابية.`}
              {metric === "observations_submitted" &&
                `توثيق ${value} ملاحظات رقابية.`}
              {![
                "activities_created",
                "volunteers_managed",
                "committees_assigned",
                "campaigns_managed",
                "observations_submitted",
              ].includes(metric) && `${metric}: ${value}`}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const getScopeBadgeVariant = (scope: RoleRecord["scope"]) => {
    switch (scope) {
      case "system":
        return "default" as const;
      case "election":
        return "secondary" as const;
      case "committee":
        return "outline" as const;
      default:
        return "default" as const;
    }
  };

  const renderRoleCard = (role: RoleRecord) => {
    const displayName =
      (role.permissions_json && (role.permissions_json["label"] as string)) ??
      role.name;
    const description =
      (role.permissions_json &&
        (role.permissions_json["description"] as string)) ??
      "دور قابل للتخصيص داخل المنصة.";

    const updatedAt = new Date(role.updated_at).toLocaleString("ar-EG");

    return (
      <Card key={role.id} className="space-y-4">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-lg font-semibold">
              {displayName}
              <Badge variant={getScopeBadgeVariant(role.scope)}>
                {role.scope === "system" && "نطاق النظام"}
                {role.scope === "election" && "نطاق الحملة"}
                {role.scope === "committee" && "نطاق اللجان"}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-muted-foreground">
              {description}
            </CardDescription>
          </div>
          <div className="text-xs text-muted-foreground">
            آخر تحديث: {updatedAt}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الصلاحية</TableHead>
                <TableHead className="text-right">الوصف</TableHead>
                <TableHead className="text-right">النطاق</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allPermissions.map((permission) => {
                const metadata = permissionDictionary[permission];
                return (
                  <TableRow key={permission}>
                    <TableCell className="font-medium text-right">
                      {metadata?.label ?? permission}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {metadata?.description ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">
                        {metadata?.scope === "shared"
                          ? "مشترك"
                          : metadata?.scope === "system"
                            ? "نظام"
                            : metadata?.scope === "election"
                              ? "حملة"
                              : metadata?.scope === "committee"
                                ? "لجنة"
                                : "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={role.permissions.includes(permission)}
                        onCheckedChange={(checked) =>
                          handlePermissionToggle(role, permission, checked)
                        }
                        aria-label={`تبديل الصلاحية ${permission}`}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {renderThresholds(role)}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((item) => (
          <Card key={item}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-2 h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((row) => (
                <Skeleton key={row} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>إدارة الأدوار</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!roles.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>إدارة الأدوار</CardTitle>
          <CardDescription>
            لا توجد أدوار متاحة حالياً. قم بإضافة أدوار جديدة من خلال لوحة
            التحكم الخلفية.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return <div className="space-y-6">{roles.map(renderRoleCard)}</div>;
}

export default RoleManager;
