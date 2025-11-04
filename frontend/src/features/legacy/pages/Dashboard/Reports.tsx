import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/infrastructure/shared/ui/table";
import { Badge } from "@/infrastructure/shared/ui/badge";

const pageTransition = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0)" },
  exit: { opacity: 0, y: -12, filter: "blur(6px)" },
};

const reports = [
  {
    title: "مؤشر الأداء الميداني",
    owner: "فريق تنسيق العاصمة",
    status: "جاهز للمراجعة",
    updatedAt: "قبل ساعتين",
  },
  {
    title: "تقرير المخاطر",
    owner: "قسم التقييم",
    status: "يتطلب متابعة",
    updatedAt: "اليوم",
  },
  {
    title: "تحليل معدلات التصويت",
    owner: "مختبر البيانات",
    status: "تم الاعتماد",
    updatedAt: "أمس",
  },
  {
    title: "خريطة الدعم الجغرافي",
    owner: "فريق التحليل المكاني",
    status: "قيد الإعداد",
    updatedAt: "قبل 3 أيام",
  },
];

const statusVariant = (status: string) => {
  switch (status) {
    case "تم الاعتماد":
      return "default" as const;
    case "جاهز للمراجعة":
      return "secondary" as const;
    case "يتطلب متابعة":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
};

const ReportsPage = () => (
  <motion.div
    key="dashboard-reports"
    variants={pageTransition}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.4 }}
    className="space-y-8"
  >
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold text-foreground">
        التقارير والتحليلات
      </h1>
      <p className="text-muted-foreground">
        متابعة تفصيلية لنتائج الحملات، مستويات المخاطر، ومؤشرات الأداء عبر
        المناطق.
      </p>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
      transition={{ duration: 0.35, delay: 0.08 }}
      className="rounded-[28px] border border-[hsla(var(--border)/0.15)] bg-[hsla(var(--surface)/0.82)] p-6 shadow-[0_35px_90px_rgba(79,70,229,0.18)] backdrop-blur-2xl"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground">عنوان التقرير</TableHead>
            <TableHead className="text-foreground">الفريق المسؤول</TableHead>
            <TableHead className="text-foreground">الحالة</TableHead>
            <TableHead className="text-foreground">آخر تحديث</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow
              key={report.title}
              className="border-[hsla(var(--border)/0.1)]"
            >
              <TableCell className="font-medium text-foreground">
                {report.title}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {report.owner}
              </TableCell>
              <TableCell>
                <Badge
                  variant={statusVariant(report.status)}
                  className="rounded-full px-3 py-1 text-xs"
                >
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {report.updatedAt}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  </motion.div>
);

export default ReportsPage;
