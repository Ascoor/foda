import type { ComponentType } from "react";

import {
  Activity,
  ArrowRightLeft,
  BarChart3,
  Binary,
  Building2,
  CalendarClock,
  ClipboardCheck,
  Cog,
  Compass,
  Database,
  FileBarChart,
  FileStack,
  FolderTree,
  Gauge,
  Globe2,
  Layers,
  LineChart,
  MapPin,
  Network,
  PieChart,
  Presentation,
  Radar,
  Server,
  Settings,
  ShieldCheck,
  Target,
  Users,
  UserSquare2,
  Workflow,
} from "lucide-react";

export type GovernanceRole = "domain-owner" | "data-steward" | "operator";

export interface DashboardAction {
  id: string;
  label: string;
  description: string;
  type: "view" | "create" | "update" | "report" | "sync";
  roles: GovernanceRole[];
  emphasis?: "primary" | "secondary" | "destructive";
}

export interface DashboardAnalytics {
  id: string;
  label: string;
  value: string;
  trend?: "up" | "down";
  change?: string;
}

export interface DashboardPanel {
  id: string;
  label: string;
  summary: string;
  icon: ComponentType<{ className?: string }>;
  analytics?: DashboardAnalytics[];
  actions: DashboardAction[];
  reports?: string[];
}

export interface DashboardSubmodule {
  id: string;
  label: string;
  description: string;
  panels: DashboardPanel[];
}

export interface DashboardModule {
  id: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  submodules: DashboardSubmodule[];
}

export const governanceRoles: Record<GovernanceRole, string> = {
  "domain-owner": "مالك معرفي",
  "data-steward": "مسؤول بيانات",
  operator: "مسؤول تنفيذي",
};

export const dashboardHierarchy: DashboardModule[] = [
  {
    id: "electoral-operations",
    label: "العمليات الانتخابية",
    description:
      "تحكم شامل في إدارة العمليات الانتخابية مع مسارات تنظيمية دقيقة لكل مرحلة.",
    icon: Compass,
    submodules: [
      {
        id: "elections",
        label: "الانتخابات",
        description:
          "متابعة تفاصيل الانتخابات، جداول الاقتراع، والتقارير التحليلية للمشاركة.",
        panels: [
          {
            id: "election-details",
            label: "تفاصيل الانتخابات",
            summary:
              "نظرة معمقة على المعطيات الرئيسية لكل عملية انتخابية قيد الإدارة.",
            icon: FileStack,
            analytics: [
              {
                id: "registered",
                label: "الإجمالي المسجل",
                value: "1.2M",
                trend: "up",
                change: "+5.3%",
              },
              {
                id: "turnout",
                label: "نسبة المشاركة",
                value: "64%",
                trend: "up",
                change: "+2.1%",
              },
            ],
            actions: [
              {
                id: "view-overview",
                label: "عرض نظرة عامة",
                description:
                  "استعراض ملخص الحالة الراهنة لكل انتخابات مع المؤشرات الحرجة.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
                emphasis: "primary",
              },
              {
                id: "update-status",
                label: "تحديث الحالة",
                description:
                  "تعديل الحالة التشغيلية ومواءمتها مع الجدول الزمني العام.",
                type: "update",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "sync-observers",
                label: "مزامنة المراقبين",
                description:
                  "توزيع فرق المراقبة على اللجان استناداً إلى آخر التغييرات.",
                type: "sync",
                roles: ["domain-owner", "operator"],
              },
            ],
            reports: ["تقرير الحالة اليومية", "مؤشر المخاطر", "توزيع اللجان"],
          },
          {
            id: "ballot-schedules",
            label: "جداول الاقتراع",
            summary:
              "إدارة وتعديل الجداول الزمنية للاقتراع مع التحقق من تغطية الموارد.",
            icon: ClipboardCheck,
            analytics: [
              {
                id: "stations",
                label: "عدد المحطات",
                value: "845",
                trend: "up",
                change: "+18",
              },
              {
                id: "coverage",
                label: "تغطية الموارد",
                value: "92%",
                trend: "down",
                change: "-1.8%",
              },
            ],
            actions: [
              {
                id: "generate-schedule",
                label: "إنشاء جدول",
                description:
                  "إطلاق معالج ذكي لإنشاء جدول اقتراع محسّن بناءً على الموارد.",
                type: "create",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "publish-updates",
                label: "نشر التحديثات",
                description:
                  "إعلام جميع الأطراف بالتعديلات الجديدة عبر قنوات الاتصال الرسمية.",
                type: "sync",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "export-schedule",
                label: "تصدير الجدول",
                description:
                  "تصدير الجداول إلى تنسيقات متعددة وإرسالها إلى غرفة العمليات.",
                type: "report",
                roles: ["data-steward", "operator"],
              },
            ],
            reports: ["تحليل الجاهزية", "قائمة التغطية", "مخطط الموارد"],
          },
          {
            id: "participation-reports",
            label: "تقارير المشاركة",
            summary:
              "متابعة مباشرة لمعدلات المشاركة مع تحليلات زمنية ومقارنات سابقة.",
            icon: BarChart3,
            analytics: [
              {
                id: "live-turnout",
                label: "المشاركة اللحظية",
                value: "58%",
                trend: "up",
                change: "+3.4%",
              },
              {
                id: "alerts",
                label: "تنبيهات حرجة",
                value: "6",
                trend: "down",
                change: "-2",
              },
            ],
            actions: [
              {
                id: "view-timeseries",
                label: "استعراض الاتجاهات",
                description:
                  "عرض الرسوم البيانية التفاعلية لمعدلات المشاركة عبر الوقت.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
                emphasis: "primary",
              },
              {
                id: "flag-anomaly",
                label: "إبلاغ عن شذوذ",
                description:
                  "إرسال تنبيه فوري لغرفة القيادة عن أي تراجع مفاجئ في المشاركة.",
                type: "update",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "download-report",
                label: "تحميل تقرير",
                description:
                  "استخراج تقرير المشاركة التفصيلي لمشاركته مع اللجان العليا.",
                type: "report",
                roles: ["data-steward", "operator"],
              },
            ],
            reports: ["ملخص المشاركة اليومي", "تحليل المناطق", "إنذار مبكر"],
          },
        ],
      },
      {
        id: "geo-areas",
        label: "المناطق الجغرافية",
        description:
          "إدارة المناطق مع طبقات البيانات المكانية والإحصاءات الميدانية.",
        panels: [
          {
            id: "mansoura-zones",
            label: "مناطق المنصورة",
            summary:
              "إشراف تفصيلي على المناطق الحيوية في المنصورة مع الخرائط والتوزيع.",
            icon: Globe2,
            analytics: [
              {
                id: "coverage-index",
                label: "مؤشر التغطية",
                value: "87%",
                trend: "up",
                change: "+4.2%",
              },
              {
                id: "field-teams",
                label: "الفرق الميدانية",
                value: "42",
                trend: "up",
                change: "+3",
              },
            ],
            actions: [
              {
                id: "view-map",
                label: "عرض الخريطة",
                description:
                  "استكشاف الخريطة التفاعلية مع طبقات توزيع الموارد والمراكز.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
                emphasis: "primary",
              },
              {
                id: "update-boundaries",
                label: "تحديث الحدود",
                description:
                  "تحيين الحدود الإدارية بناءً على بيانات رسمية ومسوحات حديثة.",
                type: "update",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "sync-coordinators",
                label: "مزامنة المنسقين",
                description:
                  "توزيع المنسقين الميدانيين على المناطق ذات الأولوية العالية.",
                type: "sync",
                roles: ["domain-owner", "operator"],
              },
            ],
            reports: ["خريطة المخاطر", "جدول الإحصاءات", "توزيع الموارد"],
          },
          {
            id: "geo-subdivisions",
            label: "مناطق أخرى",
            summary:
              "تجميع شامل للمناطق الفرعية الأخرى مع مؤشرات الأداء ومهام المتابعة.",
            icon: FolderTree,
            actions: [
              {
                id: "review-zones",
                label: "مراجعة المناطق",
                description:
                  "استعراض حالة المناطق الفرعية وتحديد مناطق التدخل العاجل.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
              },
              {
                id: "assign-field-teams",
                label: "تعيين فرق",
                description:
                  "تعيين الفرق الميدانية بناءً على كثافة الناخبين وحالة الموارد.",
                type: "update",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "export-kml",
                label: "تصدير KML",
                description:
                  "مزامنة حدود المناطق مع نظم المعلومات الجغرافية المعتمدة.",
                type: "sync",
                roles: ["data-steward", "operator"],
              },
            ],
            reports: ["إحصاءات تفصيلية", "ملف الميدان", "تحليل الأولويات"],
          },
          {
            id: "field-stats",
            label: "الإحصاءات الميدانية",
            summary:
              "لوحة تحليلات متقدمة للإحصاءات الميدانية مع مؤشرات الأداء الرئيسية.",
            icon: Radar,
            analytics: [
              {
                id: "coverage-gap",
                label: "فجوة التغطية",
                value: "13%",
                trend: "down",
                change: "-1.2%",
              },
              {
                id: "reports-volume",
                label: "عدد التقارير",
                value: "128",
                trend: "up",
                change: "+12",
              },
            ],
            actions: [
              {
                id: "view-dashboard",
                label: "عرض لوحة التحليلات",
                description:
                  "مراجعة المؤشرات الحيوية مع المقارنة بين المناطق ومعدلات النمو.",
                type: "view",
                roles: ["domain-owner", "data-steward"],
                emphasis: "primary",
              },
              {
                id: "trigger-alert",
                label: "إطلاق تنبيه",
                description:
                  "إرسال تنبيه للمناطق ذات الأداء المنخفض لاتخاذ الإجراءات التصحيحية.",
                type: "update",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "publish-digest",
                label: "نشر ملخص",
                description:
                  "إصدار ملخص أسبوعي بالأداء الميداني وتوزيعه على القيادات.",
                type: "report",
                roles: ["domain-owner", "data-steward", "operator"],
              },
            ],
            reports: ["مؤشر الأداء", "تحليل الفجوات", "تقرير أسبوعي"],
          },
        ],
      },
      {
        id: "committees",
        label: "اللجان",
        description: "إدارة اللجان ومواقعها وربطها بالمحاور الجغرافية.",
        panels: [
          {
            id: "committee-directory",
            label: "قائمة اللجان",
            summary:
              "عرض شامل لكل اللجان مع بيانات الاتصال والطاقم المسؤول.",
            icon: Building2,
            actions: [
              {
                id: "open-directory",
                label: "فتح السجل",
                description:
                  "استعراض جميع اللجان مع البحث المتقدم والتصفيات الديناميكية.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
                emphasis: "primary",
              },
              {
                id: "register-committee",
                label: "تسجيل لجنة",
                description:
                  "إضافة لجنة جديدة مع تحديد الموقع والأعضاء المسؤولين.",
                type: "create",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "sync-location",
                label: "مزامنة الموقع",
                description:
                  "مزامنة مواقع اللجان مع قاعدة البيانات الجغرافية المركزية.",
                type: "sync",
                roles: ["data-steward", "operator"],
              },
            ],
            reports: ["مخطط المواقع", "حالة الاعتماد", "تقرير التوزيع"],
          },
          {
            id: "committee-locations",
            label: "مواقع اللجان",
            summary:
              "تصور خرائطي لمواقع اللجان مع إمكانية تحليل كثافة الناخبين.",
            icon: MapPin,
            actions: [
              {
                id: "view-geo-map",
                label: "عرض الخرائط",
                description:
                  "تحليل مواقع اللجان على الخريطة مع فلاتر الكثافة والسعة.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
              },
              {
                id: "link-areas",
                label: "ربط المناطق",
                description:
                  "ربط كل لجنة بالمناطق الجغرافية لضمان توزيع متوازن.",
                type: "update",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "export-map",
                label: "تصدير الخريطة",
                description:
                  "توليد حزمة خرائط PDF/KML لاستخدامها في الاجتماعات الميدانية.",
                type: "report",
                roles: ["data-steward", "operator"],
              },
            ],
            reports: ["تحليل الكثافة", "تقرير التغطية", "خريطة قابلة للطباعة"],
          },
          {
            id: "geo-linking",
            label: "الربط الجغرافي",
            summary:
              "تهيئة العلاقات بين اللجان والمناطق لضمان التتبع اللحظي.",
            icon: Network,
            actions: [
              {
                id: "configure-links",
                label: "تهيئة الربط",
                description:
                  "إنشاء قواعد ربط بين اللجان والمناطق مع صلاحيات التحكم.",
                type: "update",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "audit-links",
                label: "تدقيق الربط",
                description:
                  "مراجعة سجل الربط وتدقيق التعديلات لضمان الحوكمة.",
                type: "report",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "notify-teams",
                label: "إخطار الفرق",
                description:
                  "إشعار الفرق الميدانية بالتغييرات الجديدة في الربط الجغرافي.",
                type: "sync",
                roles: ["domain-owner", "operator"],
              },
            ],
            reports: ["ملف الربط", "تقرير التدقيق", "سجل التغييرات"],
          },
        ],
      },
      {
        id: "voters",
        label: "الناخبون",
        description:
          "إدارة قواعد بيانات الناخبين مع أدوات البحث والتحليل والسجل الكامل.",
        panels: [
          {
            id: "voter-database",
            label: "قاعدة بيانات الناخبين",
            summary:
              "قواعد بيانات موحدة قابلة للتقسيم مع أدوات تصفية متقدمة.",
            icon: Users,
            actions: [
              {
                id: "open-database",
                label: "فتح القاعدة",
                description:
                  "الوصول إلى قاعدة الناخبين مع خيارات البحث والفلاتر المخصصة.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
              },
              {
                id: "import-data",
                label: "استيراد بيانات",
                description:
                  "استيراد دفعات البيانات الجديدة مع تدقيق الجودة والمطابقة.",
                type: "create",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "sync-registries",
                label: "مزامنة السجلات",
                description:
                  "مزامنة قاعدة البيانات مع السجلات الوطنية والأنظمة الخارجية.",
                type: "sync",
                roles: ["domain-owner", "operator"],
              },
            ],
            reports: ["تحليل الشرائح", "تفاصيل التوزيع", "تقرير التحديثات"],
          },
          {
            id: "voter-search",
            label: "البحث المتقدم",
            summary:
              "أدوات بحث ديناميكية للعثور على الناخبين وتصفيتهم وفق المعايير.",
            icon: Binary,
            actions: [
              {
                id: "launch-search",
                label: "تشغيل البحث",
                description:
                  "إطلاق محرك البحث المتقدم مع حفظ الاستعلامات التكرارية.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
                emphasis: "primary",
              },
              {
                id: "save-template",
                label: "حفظ القالب",
                description:
                  "حفظ قوالب البحث للمشاركة مع فرق الحملات والميدان.",
                type: "create",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "assign-followup",
                label: "إسناد متابعة",
                description:
                  "إرسال نتائج البحث إلى المنسقين لمتابعة الناخبين المستهدفين.",
                type: "update",
                roles: ["domain-owner", "operator"],
              },
            ],
            reports: ["قائمة الاتصال", "أولوية المتابعة", "نسبة الاستجابة"],
          },
          {
            id: "voter-activity",
            label: "سجل النشاط",
            summary:
              "توثيق تفاعلات الناخبين مع الحملات ونتائج التواصل.",
            icon: Activity,
            actions: [
              {
                id: "review-history",
                label: "مراجعة السجل",
                description:
                  "تتبع أنشطة الناخبين والنتائج الميدانية لكل تواصل.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
              },
              {
                id: "log-interaction",
                label: "تسجيل تواصل",
                description:
                  "إضافة تفاعل جديد مع الناخب مع تحديد القناة والملاحظات.",
                type: "create",
                roles: ["operator"],
              },
              {
                id: "issue-alert",
                label: "إصدار تنبيه",
                description:
                  "تنبيه فرق الحملات بوجود ملاحظات حرجة تستدعي تدخل فوري.",
                type: "update",
                roles: ["domain-owner", "operator"],
              },
            ],
            reports: ["تحليل التفاعل", "تقرير الحملات", "قائمة المتابعة"],
          },
        ],
      },
      {
        id: "candidates",
        label: "المرشحون",
        description:
          "إدارة بيانات المرشحين، قوائم الدعم، وتحليلات التأثير الجماهيري.",
        panels: [
          {
            id: "candidate-lists",
            label: "قوائم المرشحين",
            summary:
              "تنظيم القوائم الانتخابية مع إمكانيات الفرز والتحليل.",
            icon: UserSquare2,
            actions: [
              {
                id: "open-lists",
                label: "فتح القوائم",
                description:
                  "استعراض قوائم المرشحين مع التصنيف حسب المناطق والأحزاب.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
              },
              {
                id: "add-candidate",
                label: "إضافة مرشح",
                description:
                  "إدخال بيانات مرشح جديد مع تحقق من الأهلية والمتطلبات.",
                type: "create",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "publish-list",
                label: "نشر القوائم",
                description:
                  "إصدار القوائم النهائية وتوزيعها على الفروع التنظيمية.",
                type: "report",
                roles: ["domain-owner", "operator"],
              },
            ],
            reports: ["سجلات الاعتماد", "تحليل التغطية", "تقرير التحديثات"],
          },
          {
            id: "candidate-profiles",
            label: "بيانات الترشيح",
            summary:
              "قاعدة معرفية للمرشحين مع مستنداتهم الرسمية وسجل التواصل.",
            icon: Database,
            actions: [
              {
                id: "review-profile",
                label: "مراجعة الملف",
                description:
                  "فحص بيانات الترشيح والتأكد من اكتمال المتطلبات الإدارية.",
                type: "view",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "update-profile",
                label: "تحديث البيانات",
                description:
                  "تحيين بيانات المرشح وتوثيق التعديلات لأغراض التدقيق.",
                type: "update",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "assign-liaison",
                label: "تعيين منسق",
                description:
                  "تحديد منسق ارتباط لكل مرشح للتواصل الدائم وإدارة الاحتياجات.",
                type: "update",
                roles: ["domain-owner", "operator"],
              },
            ],
            reports: ["مراقبة التغييرات", "ملف الوثائق", "تقرير التواصل"],
          },
          {
            id: "support-reports",
            label: "تقارير الدعم الشعبي",
            summary:
              "مؤشرات دعم شعبي تفاعلية مع مقارنات زمنية وتحليل الاتجاهات.",
            icon: PieChart,
            analytics: [
              {
                id: "support-index",
                label: "مؤشر الدعم",
                value: "74",
                trend: "up",
                change: "+7",
              },
              {
                id: "engagement",
                label: "التفاعل",
                value: "1.8K",
                trend: "up",
                change: "+340",
              },
            ],
            actions: [
              {
                id: "open-insights",
                label: "فتح التحليلات",
                description:
                  "عرض الرسوم البيانية للتفاعل الشعبي مع خيارات المقارنة بين المرشحين.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
                emphasis: "primary",
              },
              {
                id: "schedule-briefing",
                label: "جدولة إحاطة",
                description:
                  "جدولة لقاء سريع مع فريق المرشح لمناقشة مؤشرات الأداء.",
                type: "update",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "export-analytics",
                label: "تصدير التحليلات",
                description:
                  "توليد تقارير الدعم الشعبي وتوجيهها للمجلس القيادي.",
                type: "report",
                roles: ["domain-owner", "data-steward"],
              },
            ],
            reports: ["تقرير التفاعل", "تحليل المقارنة", "سجل الاجتماعات"],
          },
        ],
      },
    ],
  },
  {
    id: "field-resources",
    label: "الموارد الميدانية",
    description:
      "تنظيم شامل للموارد البشرية الميدانية ومتابعة فعالياتهم اليومية.",
    icon: Workflow,
    submodules: [
      {
        id: "coordinators",
        label: "المنسقون",
        description: "إدارة المنسقين وتوزيع المهام ومراقبة الأداء.",
        panels: [
          {
            id: "coordinator-directory",
            label: "قائمة المنسقين",
            summary:
              "عرض شامل للمنسقين مع مستويات الاعتماد والتكليفات الحالية.",
            icon: Users,
            actions: [
              {
                id: "view-directory",
                label: "عرض القائمة",
                description:
                  "استعراض بيانات المنسقين مع قدرات البحث السريع.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
              },
              {
                id: "assign-missions",
                label: "تعيين مهام",
                description:
                  "إسناد مهام جديدة بناءً على الأولويات اليومية والجاهزية.",
                type: "update",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "export-directory",
                label: "تصدير السجل",
                description:
                  "استخراج قائمة المنسقين لاستخدامها في الاجتماعات التنظيمية.",
                type: "report",
                roles: ["domain-owner", "data-steward"],
              },
            ],
            reports: ["حالة الجاهزية", "تقرير التكليفات", "تحليل الأداء"],
          },
          {
            id: "coordination-map",
            label: "خرائط التوزيع",
            summary:
              "لوحة خرائط حية لتوزيع المنسقين على المناطق الحرجة.",
            icon: MapPin,
            actions: [
              {
                id: "open-map",
                label: "فتح الخريطة",
                description:
                  "عرض التوزيع الجغرافي مع إمكانية تعديل مناطق النفوذ.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
              },
              {
                id: "optimize-coverage",
                label: "تحسين التغطية",
                description:
                  "تشغيل محرك توصية لإعادة توزيع المنسقين حسب الحاجة.",
                type: "update",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "publish-map",
                label: "نشر الخريطة",
                description:
                  "مشاركة خرائط التوزيع مع الفرق الميدانية في الوقت الفعلي.",
                type: "sync",
                roles: ["domain-owner", "data-steward", "operator"],
              },
            ],
            reports: ["تقرير التغطية", "تحليل التحركات", "ملخص يومي"],
          },
          {
            id: "coordination-tasks",
            label: "مهام التنسيق",
            summary:
              "قائمة مركزية لمهام التنسيق مع مراقبة التقدم ومؤشرات الأداء.",
            icon: ClipboardCheck,
            actions: [
              {
                id: "review-tasks",
                label: "عرض المهام",
                description:
                  "متابعة المهام النشطة مع حالات الإنجاز والتبعيات.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
              },
              {
                id: "assign-task",
                label: "إسناد مهمة",
                description:
                  "إسناد مهمة جديدة لمجموعة من المنسقين مع تحديد الوقت المستهدف.",
                type: "create",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "audit-progress",
                label: "تدقيق التقدم",
                description:
                  "تحليل تقدم المهام ومقارنته بالخطط التشغيلية.",
                type: "report",
                roles: ["domain-owner", "data-steward"],
              },
            ],
            reports: ["لوحة التقدم", "تحليل العمل", "أرشيف المهام"],
          },
        ],
      },
      {
        id: "volunteers",
        label: "المتطوعون",
        description:
          "متابعة قاعدة المتطوعين، مهام الحملات، وبرامج الحوافز.",
        panels: [
          {
            id: "volunteer-database",
            label: "قاعدة المتطوعين",
            summary:
              "إدارة المتطوعين مع تتبع المهارات والتوافر والتكليفات الحالية.",
            icon: Users,
            actions: [
              {
                id: "open-volunteer-base",
                label: "فتح القاعدة",
                description:
                  "عرض قاعدة بيانات المتطوعين مع إمكانيات الاستعلام المتقدم.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
              },
              {
                id: "add-volunteer",
                label: "إضافة متطوع",
                description:
                  "تسجيل متطوع جديد وتحديد المهارات وتاريخ التفرغ.",
                type: "create",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "sync-training",
                label: "مزامنة التدريب",
                description:
                  "مزامنة برامج التدريب والحضور مع منصة الحوكمة المركزية.",
                type: "sync",
                roles: ["domain-owner", "data-steward"],
              },
            ],
            reports: ["نسبة النشاط", "تقرير الحضور", "تحليل المهارات"],
          },
          {
            id: "campaign-tasks",
            label: "مهام الحملات",
            summary:
              "قائمة موحدة لمهام الحملات مع القياس الآني لمستويات الإنجاز.",
            icon: ClipboardCheck,
            actions: [
              {
                id: "review-campaign-tasks",
                label: "عرض المهام",
                description:
                  "متابعة مهام الحملات مع إمكانية إعادة الإسناد حسب الحاجة.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
              },
              {
                id: "dispatch-task",
                label: "إرسال مهمة",
                description:
                  "توجيه مهمة جديدة لمجموعة متطوعين بناءً على التوافر.",
                type: "create",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "monitor-progress",
                label: "مراقبة التقدم",
                description:
                  "إصدار تقارير متابعة للمهام التشغيلية المرتبطة بالحملات.",
                type: "report",
                roles: ["domain-owner", "data-steward"],
              },
            ],
            reports: ["تقرير الإنجاز", "مخطط الحملات", "تحليل الموارد"],
          },
          {
            id: "volunteer-incentives",
            label: "الحوافز والتقييم",
            summary:
              "نظام تقييم متكامل لقياس أداء المتطوعين وبرامج الحوافز.",
            icon: ShieldCheck,
            actions: [
              {
                id: "launch-evaluation",
                label: "بدء التقييم",
                description:
                  "تشغيل دورة تقييم جديدة مع نماذج قياس جاهزة.",
                type: "create",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "publish-incentives",
                label: "نشر الحوافز",
                description:
                  "الإعلان عن برامج الحوافز بناءً على مستويات الأداء المحققة.",
                type: "update",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "share-feedback",
                label: "مشاركة التغذية الراجعة",
                description:
                  "نشر النتائج التفصيلية للمتطوعين مع توصيات التحسين.",
                type: "report",
                roles: ["domain-owner", "data-steward", "operator"],
              },
            ],
            reports: ["تقرير التقييم", "تحليل الأداء", "ملخص الحوافز"],
          },
        ],
      },
      {
        id: "observations",
        label: "الملاحظات",
        description:
          "تدفق الملاحظات الميدانية والتقارير اليومية وتحليل الأنماط.",
        panels: [
          {
            id: "field-reports",
            label: "تقارير الميدان",
            summary:
              "استقبال وتحليل التقارير القادمة من فرق الميدان بشكل لحظي.",
            icon: FileBarChart,
            actions: [
              {
                id: "open-reports",
                label: "فتح التقارير",
                description:
                  "الوصول إلى التقارير الميدانية مع قدرات التصفية الزمنية.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
                emphasis: "primary",
              },
              {
                id: "assign-followups",
                label: "إسناد المتابعة",
                description:
                  "تحويل التقارير الحرجة إلى مهام للمنسقين لاتخاذ إجراء فوري.",
                type: "update",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "archive-report",
                label: "أرشفة",
                description:
                  "أرشفة التقارير المكتملة ضمن نظام الحوكمة المركزي.",
                type: "update",
                roles: ["data-steward"],
              },
            ],
            reports: ["ملخص يومي", "مؤشر المخاطر", "تحليل الاتصالات"],
          },
          {
            id: "daily-observations",
            label: "الملاحظات اليومية",
            summary:
              "سجل يومي للحالات الميدانية مع تتبع المعالجة والنتائج.",
            icon: ClipboardCheck,
            actions: [
              {
                id: "log-observation",
                label: "تسجيل ملاحظة",
                description:
                  "إدخال ملاحظات جديدة مع تحديد الموقع والأولوية.",
                type: "create",
                roles: ["operator"],
              },
              {
                id: "review-queue",
                label: "مراجعة الطابور",
                description:
                  "متابعة حالة الملاحظات المفتوحة وتعيينها إلى المسؤولين.",
                type: "update",
                roles: ["domain-owner", "data-steward", "operator"],
              },
              {
                id: "publish-digest",
                label: "نشر الملخص",
                description:
                  "إصدار ملخص يومي لأبرز الملاحظات وتوزيعه على القيادة.",
                type: "report",
                roles: ["domain-owner", "data-steward"],
              },
            ],
            reports: ["تحليل اليوم", "سجل الحالات", "تقرير الإغلاق"],
          },
          {
            id: "pattern-analytics",
            label: "تحليل الأنماط",
            summary:
              "كشف الاتجاهات المتكررة في الملاحظات لتحديد المخاطر والفرص.",
            icon: Layers,
            analytics: [
              {
                id: "anomaly-detected",
                label: "حالات الشذوذ",
                value: "14",
                trend: "up",
                change: "+2",
              },
              {
                id: "resolution-rate",
                label: "نسبة المعالجة",
                value: "82%",
                trend: "up",
                change: "+6%",
              },
            ],
            actions: [
              {
                id: "view-patterns",
                label: "عرض الأنماط",
                description:
                  "استعراض لوحة تحليلات الأنماط مع مصفوفة المخاطر.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
              },
              {
                id: "launch-investigation",
                label: "فتح تحقيق",
                description:
                  "إطلاق تحقيق تفصيلي في الأنماط الحرجة المكتشفة.",
                type: "update",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "sync-intelligence",
                label: "مزامنة الذكاء",
                description:
                  "مشاركة نتائج التحليل مع منصات الذكاء والحوكمة المؤسسية.",
                type: "sync",
                roles: ["domain-owner", "data-steward"],
              },
            ],
            reports: ["تقرير الذكاء", "تحليل المخاطر", "ملخص المقارنات"],
          },
        ],
      },
    ],
  },
  {
    id: "campaigns-analytics",
    label: "الحملات والتحليلات",
    description:
      "إدارة الحملات، الأتمتة، والتحليلات المتقدمة مع مؤشرات أداء تفاعلية.",
    icon: BarChart3,
    submodules: [
      {
        id: "campaigns",
        label: "الحملات",
        description:
          "لوحة تحكم كاملة لتخطيط الحملات، الأهداف، وتتبع التنفيذ.",
        panels: [
          {
            id: "campaign-details",
            label: "تفاصيل الحملات",
            summary:
              "إدارة دورات الحملات مع مخططات جانت ومقاييس التقدم.",
            icon: FolderTree,
            actions: [
              {
                id: "open-campaign",
                label: "فتح الحملة",
                description:
                  "استعراض الحملات النشطة مع توزيع الموارد وتبعيات المهام.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
                emphasis: "primary",
              },
              {
                id: "create-campaign",
                label: "إطلاق حملة",
                description:
                  "إنشاء حملة جديدة مع قوالب الأهداف والمقاييس المدمجة.",
                type: "create",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "publish-scorecard",
                label: "نشر بطاقة الأداء",
                description:
                  "إرسال نتائج الأداء إلى أصحاب المصلحة الرئيسيين.",
                type: "report",
                roles: ["domain-owner", "data-steward"],
              },
            ],
            reports: ["لوحة الأهداف", "مؤشرات الإنجاز", "سجل الحملة"],
          },
          {
            id: "goal-management",
            label: "إدارة الأهداف",
            summary:
              "تحديد الأهداف الاستراتيجية ومتابعة تحقيقها عبر الفرق المختلفة.",
            icon: Target,
            actions: [
              {
                id: "define-goal",
                label: "تحديد هدف",
                description:
                  "إضافة هدف استراتيجي جديد وربطه بالمقاييس التنفيذية.",
                type: "create",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "track-progress",
                label: "متابعة التقدم",
                description:
                  "لوحة مؤشرات لحالة الأهداف مع إمكانية تصعيد المخاطر.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
              },
              {
                id: "sync-objectives",
                label: "مزامنة الأهداف",
                description:
                  "مزامنة الأهداف مع أنظمة التخطيط المؤسسية وإدارة الأداء.",
                type: "sync",
                roles: ["domain-owner", "data-steward"],
              },
            ],
            reports: ["لوحة الأهداف", "تحليل المخاطر", "سجل التصعيد"],
          },
          {
            id: "execution-tracking",
            label: "تتبع التنفيذ",
            summary:
              "رصد تنفيذ الحملات لحظياً مع نسب الإنجاز ومؤشرات العوائق.",
            icon: ClipboardCheck,
            actions: [
              {
                id: "review-timeline",
                label: "مراجعة الجدول",
                description:
                  "عرض خط الزمن التنفيذي للحملة مع حالة المهام المحورية.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
              },
              {
                id: "escalate-issue",
                label: "تصعيد عائق",
                description:
                  "إشعار غرفة التحكم بأي عوائق تهدد الجدول الزمني.",
                type: "update",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "export-progress",
                label: "تصدير التقدم",
                description:
                  "تجميع تقارير التقدم الأسبوعية وإرسالها لأصحاب المصلحة.",
                type: "report",
                roles: ["domain-owner", "data-steward"],
              },
            ],
            reports: ["مخطط جانت", "تحليل الانحراف", "تقرير المخاطر"],
          },
        ],
      },
      {
        id: "automation",
        label: "الأتمتة",
        description:
          "تشغيل المهام الآلية، تكامل الأنظمة، وتنسيق الجداول الذكية.",
        panels: [
          {
            id: "automation-tasks",
            label: "المهام الآلية",
            summary:
              "مصفوفة المهام الآلية مع حالة التنفيذ ومؤشرات الثبات.",
            icon: Workflow,
            actions: [
              {
                id: "view-automations",
                label: "عرض المهام",
                description:
                  "قائمة المهام الآلية مع حالة التشغيل وتفاصيل التنفيذ.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
                emphasis: "primary",
              },
              {
                id: "create-automation",
                label: "إنشاء مهمة",
                description:
                  "إنشاء مهام آلية جديدة مع قواعد التشغيل والجدولة.",
                type: "create",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "pause-automation",
                label: "إيقاف مؤقت",
                description:
                  "إيقاف مهمة آلية للتدقيق أو تعديل الإعدادات التنفيذية.",
                type: "update",
                roles: ["domain-owner", "operator"],
              },
            ],
            reports: ["سجل التنفيذ", "تحليل الأعطال", "استهلاك الموارد"],
          },
          {
            id: "system-integration",
            label: "تكامل الأنظمة",
            summary:
              "محور التكامل مع المنصات الأخرى وإدارة واجهات البرمجة.",
            icon: ArrowRightLeft,
            actions: [
              {
                id: "review-integrations",
                label: "مراجعة التكامل",
                description:
                  "متابعة حالة نقاط التكامل مع الأنظمة الخارجية وتحديث المفاتيح.",
                type: "view",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "add-connector",
                label: "إضافة موصل",
                description:
                  "تكوين موصل جديد مع تحديد الصلاحيات ومستويات الأمان.",
                type: "create",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "audit-logs",
                label: "تدقيق السجلات",
                description:
                  "مراجعة سجلات التكامل وتحديد محاولات الفشل أو التعديات.",
                type: "report",
                roles: ["domain-owner", "data-steward"],
              },
            ],
            reports: ["صحة التكامل", "تقرير الأمان", "قائمة الموصلات"],
          },
          {
            id: "scheduler",
            label: "تشغيل الجدولة",
            summary:
              "إدارة جدول التشغيل الذكي للمهام الآلية والحملات الإدارية.",
            icon: CalendarClock,
            actions: [
              {
                id: "view-scheduler",
                label: "عرض الجدول",
                description:
                  "استعراض الجداول الزمنية للمهام الآلية وضبط أوقات التنفيذ.",
                type: "view",
                roles: ["domain-owner", "operator"],
              },
              {
                id: "optimize-schedule",
                label: "تحسين الجدول",
                description:
                  "إطلاق توصيات ذكية لتحسين الترتيب الزمني للمهام.",
                type: "update",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "export-schedule",
                label: "تصدير الجدولة",
                description:
                  "إرسال الجداول التنفيذية إلى غرف العمليات المختلفة.",
                type: "report",
                roles: ["domain-owner", "operator"],
              },
            ],
            reports: ["مخطط التشغيل", "تحليل الضغط", "أرشيف الجدولة"],
          },
        ],
      },
      {
        id: "analytics",
        label: "التحليلات",
        description:
          "مركز تحليلات متقدم لمؤشرات الأداء، التقارير التفاعلية، وتحليل الاتجاهات.",
        panels: [
          {
            id: "kpi-monitor",
            label: "مؤشرات الأداء",
            summary:
              "لوحة مؤشرات الأداء الرئيسية مع التحديث اللحظي والتصعيد التلقائي.",
            icon: Gauge,
            analytics: [
              {
                id: "delivery",
                label: "التسليم",
                value: "89%",
                trend: "up",
                change: "+4%",
              },
              {
                id: "risk",
                label: "مستوى المخاطر",
                value: "منخفض",
              },
            ],
            actions: [
              {
                id: "open-kpis",
                label: "عرض المؤشرات",
                description:
                  "استعراض المؤشرات مع إمكانية تحديد الأهداف والتصعيد.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
                emphasis: "primary",
              },
              {
                id: "update-thresholds",
                label: "تحديث العتبات",
                description:
                  "تعديل حدود المؤشرات وتشغيل التنبيهات المرتبطة بها.",
                type: "update",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "share-dashboard",
                label: "مشاركة اللوحة",
                description:
                  "إرسال لوحة المؤشرات إلى أصحاب المصلحة المعنيين.",
                type: "report",
                roles: ["domain-owner", "operator"],
              },
            ],
            reports: ["لوحة التقدم", "تحليل الأداء", "قائمة المخاطر"],
          },
          {
            id: "interactive-reports",
            label: "تقارير تفاعلية",
            summary:
              "مجموعة من التقارير التفاعلية مع قدرات الحفر العميق والمرئيات.",
            icon: Presentation,
            actions: [
              {
                id: "launch-reports",
                label: "تشغيل التقارير",
                description:
                  "عرض التقارير التفاعلية مع تخصيص الفلاتر والمقاييس.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
              },
              {
                id: "save-dashboard",
                label: "حفظ لوحة",
                description:
                  "حفظ تكوينات التقارير لاستخدامها لاحقاً أو مشاركتها.",
                type: "create",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "export-report",
                label: "تصدير",
                description:
                  "توليد نسخة PDF أو PowerPoint للتقارير التفاعلية المختارة.",
                type: "report",
                roles: ["domain-owner", "operator"],
              },
            ],
            reports: ["تقرير الحوكمة", "مخطط الأداء", "عرض الشرائح"],
          },
          {
            id: "trend-analysis",
            label: "تحليل الاتجاهات",
            summary:
              "رصد الاتجاهات الزمنية ومؤشرات التنبؤ المبكر لاتخاذ القرارات.",
            icon: LineChart,
            actions: [
              {
                id: "view-trends",
                label: "عرض الاتجاهات",
                description:
                  "رسم الاتجاهات الزمنية مع الطبقات التنبؤية المتقدمة.",
                type: "view",
                roles: ["domain-owner", "data-steward", "operator"],
                emphasis: "primary",
              },
              {
                id: "configure-forecast",
                label: "تهيئة التنبؤ",
                description:
                  "إعداد نماذج التنبؤ مع ضبط المعلمات المحورية.",
                type: "update",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "share-trends",
                label: "مشاركة النتائج",
                description:
                  "إرسال نتائج التحليل إلى القيادة لاتخاذ الإجراءات.",
                type: "report",
                roles: ["domain-owner", "operator"],
              },
            ],
            reports: ["تقرير الاتجاهات", "تحليل التنبؤ", "مؤشر المخاطر"],
          },
        ],
      },
    ],
  },
  {
    id: "administration",
    label: "الإدارة",
    description:
      "محور الحوكمة والإعدادات المتقدمة، إدارة المستخدمين، ومراقبة الأداء.",
    icon: Settings,
    submodules: [
      {
        id: "settings",
        label: "الإعدادات",
        description:
          "تهيئة إعدادات النظام، الصلاحيات والأدوار، والتكامل مع الخدمات.",
        panels: [
          {
            id: "system-settings",
            label: "إعدادات النظام",
            summary:
              "إدارة الإعدادات العامة مع الضبط الدقيق للمصادقة والهوية.",
            icon: Cog,
            actions: [
              {
                id: "open-settings",
                label: "فتح الإعدادات",
                description:
                  "عرض إعدادات المنصة مع أقسام مصنفة وشرح لكل خيار.",
                type: "view",
                roles: ["domain-owner"],
                emphasis: "primary",
              },
              {
                id: "update-config",
                label: "تحديث التكوين",
                description:
                  "تعديل إعدادات النظام مع سجل تدقيق لكل تغيير.",
                type: "update",
                roles: ["domain-owner"],
              },
              {
                id: "export-config",
                label: "تصدير التكوين",
                description:
                  "نسخ إعدادات النظام لمشاركتها مع الفرق التقنية.",
                type: "report",
                roles: ["domain-owner", "data-steward"],
              },
            ],
            reports: ["سجل التدقيق", "تقرير التكوين", "التحقق الأمني"],
          },
          {
            id: "roles-permissions",
            label: "الصلاحيات والأدوار",
            summary:
              "نظام إدارة الصلاحيات مع مصفوفة الأدوار والمهام المرتبطة.",
            icon: ShieldCheck,
            actions: [
              {
                id: "view-roles",
                label: "عرض الأدوار",
                description:
                  "مراجعة الأدوار الحالية وصلاحياتها وتعيين المسؤوليات.",
                type: "view",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "assign-permissions",
                label: "تعيين صلاحيات",
                description:
                  "تعديل صلاحيات المستخدمين وضبط الوصول إلى الأقسام الحرجة.",
                type: "update",
                roles: ["domain-owner"],
              },
              {
                id: "export-matrix",
                label: "تصدير المصفوفة",
                description:
                  "إصدار مصفوفة الصلاحيات لمشاركتها مع فرق الحوكمة.",
                type: "report",
                roles: ["domain-owner", "data-steward"],
              },
            ],
            reports: ["مصفوفة الصلاحيات", "سجل التعديلات", "التقارير الرقابية"],
          },
          {
            id: "service-integrations",
            label: "الربط مع الخدمات الخارجية",
            summary:
              "إدارة الربط مع الخدمات والبروتوكولات الخارجية.",
            icon: Network,
            actions: [
              {
                id: "open-services",
                label: "عرض الخدمات",
                description:
                  "عرض قائمة الخدمات المدمجة وحالة الاتصال.",
                type: "view",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "add-service",
                label: "إضافة خدمة",
                description:
                  "إضافة خدمة جديدة مع تعيين مفاتيح الوصول.",
                type: "create",
                roles: ["domain-owner"],
              },
              {
                id: "audit-service",
                label: "تدقيق الربط",
                description:
                  "مراجعة السجلات وضمان الامتثال للسياسات الأمنية.",
                type: "report",
                roles: ["domain-owner", "data-steward"],
              },
            ],
            reports: ["قائمة الخدمات", "سجل الربط", "التحقق الأمني"],
          },
        ],
      },
      {
        id: "advanced-controls",
        label: "التحكم المتقدم",
        description:
          "إدارة المستخدمين، مراقبة الأداء، والنُسخ الاحتياطية والتدقيق.",
        panels: [
          {
            id: "user-management",
            label: "إدارة المستخدمين",
            summary:
              "لوحة تحكم شاملة لإدارة المستخدمين، الجلسات، والأمان.",
            icon: Users,
            actions: [
              {
                id: "view-users",
                label: "عرض المستخدمين",
                description:
                  "استعراض المستخدمين مع تفاصيل الصلاحيات والنشاط.",
                type: "view",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "provision-user",
                label: "إضافة مستخدم",
                description:
                  "إضافة مستخدم جديد مع تعيين الدور المناسب.",
                type: "create",
                roles: ["domain-owner"],
              },
              {
                id: "suspend-user",
                label: "إيقاف مؤقت",
                description:
                  "إيقاف مستخدم مع تسجيل السبب وسريان السياسة.",
                type: "update",
                roles: ["domain-owner"],
              },
            ],
            reports: ["سجل الدخول", "مراجعة الصلاحيات", "سجل التعديلات"],
          },
          {
            id: "performance-monitoring",
            label: "مراقبة الأداء",
            summary:
              "مراقبة الأداء التشغيلي مع تنبيهات زمنية وتقارير الحوكمة.",
            icon: Activity,
            actions: [
              {
                id: "open-monitor",
                label: "فتح المراقبة",
                description:
                  "مراقبة أداء المنصة مع مؤشرات زمنية وأحداث حرجة.",
                type: "view",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "set-thresholds",
                label: "تعيين العتبات",
                description:
                  "ضبط مستويات التحذير والتصعيد للمؤشرات الحيوية.",
                type: "update",
                roles: ["domain-owner"],
              },
              {
                id: "export-performance",
                label: "تصدير التقرير",
                description:
                  "إصدار تقرير أداء تشغيلي للفترات المحددة.",
                type: "report",
                roles: ["domain-owner", "data-steward"],
              },
            ],
            reports: ["تقارير الحوكمة", "حالة الخدمة", "مؤشرات المخاطر"],
          },
          {
            id: "backup-audit",
            label: "النسخ الاحتياطي والتدقيق",
            summary:
              "تحكم شامل في سياسات النسخ الاحتياطي وسجلات التدقيق.",
            icon: Server,
            actions: [
              {
                id: "review-backups",
                label: "مراجعة النسخ",
                description:
                  "عرض حالة النسخ الاحتياطية والجداول الزمنية المرتبطة.",
                type: "view",
                roles: ["domain-owner", "data-steward"],
              },
              {
                id: "trigger-backup",
                label: "تشغيل نسخة",
                description:
                  "تشغيل نسخة احتياطية فورية مع تحديد نطاق البيانات.",
                type: "create",
                roles: ["domain-owner"],
              },
              {
                id: "audit-trail",
                label: "تدقيق السجلات",
                description:
                  "استعراض سجلات التدقيق والتحقق من الالتزام بالسياسات.",
                type: "report",
                roles: ["domain-owner", "data-steward"],
              },
            ],
            reports: ["تقارير النسخ", "سجل التدقيق", "تحليل الامتثال"],
          },
        ],
      },
    ],
  },
];
