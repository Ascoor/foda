import { motion } from "framer-motion";
import { Badge } from "@/infrastructure/shared/ui/badge";
import { Button } from "@/infrastructure/shared/ui/button";
import { Avatar, AvatarFallback } from "@/infrastructure/shared/ui/avatar";

const pageTransition = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0)" },
  exit: { opacity: 0, y: -12, filter: "blur(6px)" },
};

const mockUsers = [
  {
    name: "سارة الجبوري",
    email: "sara@campaign.io",
    role: "مشرف",
    status: "نشط",
    initials: "سج",
  },
  {
    name: "محمود العبد",
    email: "mahmoud@field.org",
    role: "قائد ميداني",
    status: "نشط",
    initials: "مع",
  },
  {
    name: "ريما الدروبي",
    email: "reema@data.ai",
    role: "محلل بيانات",
    status: "قيد المتابعة",
    initials: "رد",
  },
  {
    name: "خالد العتيبي",
    email: "khalid@campaign.ai",
    role: "مراقب",
    status: "غير نشط",
    initials: "خع",
  },
];

const UsersPage = () => (
  <motion.div
    key="dashboard-users"
    variants={pageTransition}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.4 }}
    className="space-y-8"
  >
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-semibold text-foreground">
        إدارة المستخدمين
      </h1>
      <p className="text-muted-foreground">
        تحكم كامل في الأدوار، الصلاحيات، والتراخيص الممنوحة لأعضاء فريقك.
      </p>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="rounded-[28px] border border-[hsla(var(--border)/0.15)] bg-[hsla(var(--surface)/0.82)] p-6 shadow-[0_35px_90px_rgba(79,70,229,0.18)] backdrop-blur-2xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            الأعضاء الحاليون
          </h2>
          <p className="text-sm text-muted-foreground">آخر تحديث قبل 5 دقائق</p>
        </div>
        <Button className="rounded-2xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))]">
          إضافة مستخدم جديد
        </Button>
      </div>

      <div className="mt-6 divide-y divide-[hsla(var(--border)/0.12)]">
        {mockUsers.map((user) => (
          <div
            key={user.email}
            className="flex flex-wrap items-center justify-between gap-4 py-4"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 rounded-2xl border border-[hsla(var(--border)/0.2)] bg-[hsla(var(--surface-secondary)/0.6)]">
                <AvatarFallback className="text-sm font-semibold text-foreground">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-base font-semibold text-foreground">
                  {user.name}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Badge
                variant="secondary"
                className="rounded-full px-3 py-1 text-xs font-semibold"
              >
                {user.role}
              </Badge>
              <Badge
                className="rounded-full px-3 py-1 text-xs"
                variant={
                  user.status === "نشط"
                    ? "default"
                    : user.status === "قيد المتابعة"
                      ? "outline"
                      : "secondary"
                }
              >
                {user.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

export default UsersPage;
