export interface HeroSlide {
  id: string;
  title: string;
  description: string;
  media: string;
  badge: string;
  ctaLabel: string;
  ctaVideo: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  avatar: string;
  quote: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
}

export interface FeatureNode {
  id: string;
  title: string;
  children?: FeatureNode[];
}

export const heroSlides: HeroSlide[] = [
  {
    id: "insight",
    title: "منصة إدارة الحملات الانتخابية",
    description:
      "منصة موحدة لإدارة المتطوعين، المرشحين، الناخبين، والبيانات الميدانية مع تحليلات فورية وتقارير دقيقة.",
    media: "/img/landing.webp",
    badge: "منصة متكاملة",
    ctaLabel: "استعرض الجولة التعريفية",
    ctaVideo: "https://www.youtube.com/watch?v=21X5lGlDOfg",
  },
  {
    id: "analytics",
    title: "قرارات تعتمد على البيانات",
    description:
      "لوحات تحكم تفاعلية تساعدك على قراءة الأنماط الانتخابية وتحديد أولويات الحملة في ثوانٍ.",
    media: "/img/landing.webp",
    badge: "تحليلات لحظية",
    ctaLabel: "اكتشف نماذج التقارير",
    ctaVideo: "https://www.youtube.com/watch?v=5qap5aO4i9A",
  },
  {
    id: "field",
    title: "تنسيق الفرق الميدانية بسهولة",
    description:
      "جدولة المهام، تتبع الملاحظات، وإدارة المتطوعين من تطبيق واحد يدعم اللغة العربية بالكامل.",
    media: "/img/landing.webp",
    badge: "جاهز للميدان",
    ctaLabel: "شاهد كيفية إدارة الفرق",
    ctaVideo: "https://www.youtube.com/watch?v=hHW1oY26kxQ",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    author: "ليلى العوضي",
    role: "مديرة الحملة - محافظة القاهرة",
    avatar: "https://i.pravatar.cc/128?img=32",
    quote:
      "المنصة قدمت لنا رؤية دقيقة لكل مرحلة من الحملة. قدرنا نستبق التحديات ونوزع الفرق بكفاءة.",
  },
  {
    id: "t2",
    author: "خالد منصور",
    role: "مسؤول التطوع",
    avatar: "https://i.pravatar.cc/128?img=12",
    quote:
      "من خلال لوحة المتابعة قدرنا نحفز المتطوعين برسائل مخصصة ونغلق المهام بسرعة غير مسبوقة.",
  },
  {
    id: "t3",
    author: "سارة عبد الله",
    role: "رئيس لجنة رصد",
    avatar: "https://i.pravatar.cc/128?img=45",
    quote:
      "تقارير الرصد الميداني والملاحظات تندمج تلقائياً مع التحليلات، مما سهل علينا اتخاذ القرار.",
  },
];

export const partners: Partner[] = [
  { id: "p1", name: "Election Pulse", logo: "/img/partner-1.svg" },
  { id: "p2", name: "Insights Lab", logo: "/img/partner-2.svg" },
  { id: "p3", name: "FieldOps", logo: "/img/partner-3.svg" },
  { id: "p4", name: "Atlas Maps", logo: "/img/partner-4.svg" },
  { id: "p5", name: "Civic Data", logo: "/img/partner-5.svg" },
];

export const featureTree: FeatureNode = {
  id: "platform",
  title: "منصة الحملة",
  children: [
    {
      id: "planning",
      title: "التخطيط",
      children: [
        { id: "zones", title: "خرائط المناطق" },
        { id: "targets", title: "تحليل الناخبين" },
      ],
    },
    {
      id: "engagement",
      title: "التفاعل",
      children: [
        { id: "volunteers", title: "إدارة المتطوعين" },
        { id: "communications", title: "حملات الرسائل" },
      ],
    },
    {
      id: "operations",
      title: "العمليات",
      children: [
        { id: "observations", title: "تتبع الملاحظات" },
        { id: "committees", title: "تنسيق اللجان" },
      ],
    },
    {
      id: "analytics",
      title: "التحليلات",
      children: [
        { id: "dashboards", title: "لوحات القيادة" },
        { id: "reports", title: "تقارير فورية" },
      ],
    },
  ],
};
