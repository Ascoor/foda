import i18n from "@/infrastructure/i18n";

const floatingResources = {
  ar: {
    floating: {
      heroTitle: "شارك في المستقبل — منصة التحليل الانتخابي الذكية",
      heroSubtitle:
        "تتبع البيانات، وحلل المشاركة، وتفاعل مع جمهورك من خلال تجربة انتخابية رقمية متكاملة.",
      getStarted: "ابدأ الآن",
      viewDashboard: "عرض لوحة التحكم",
      featuresTitle: "قدرات استثنائية",
      featureCards: [
        {
          title: "تحليلات فورية للنتائج",
          description:
            "لوحة بيانات متجددة تعكس نبض التصويت لحظة بلحظة عبر مؤشرات مرئية دقيقة.",
        },
        {
          title: "خريطة تفاعلية للمناطق",
          description:
            "استكشف التوزيع الجغرافي للناخبين ونتائج اللجان من خلال خريطة ديناميكية.",
        },
        {
          title: "تقارير مخصصة",
          description:
            "كوِّن تقاريرك الخاصة وشاركها مع فريقك بسهولة لدعم قراراتك الاستراتيجية.",
        },
      ],
      statsTitle: "أرقام تُحدث الفرق",
      ctaTitle: "كن جزءًا من التجربة الانتخابية الجديدة",
      ctaSubtitle:
        "صمم مسار حملتك من التخطيط وحتى إعلان النتائج عبر أدوات مدعومة بالذكاء الاصطناعي.",
      footerTagline: "منصة التحليل الانتخابي الذكية",
      voters: "الناخبون",
      participation: "نسبة المشاركة",
      campaigns: "الحملات",
      dayTheme: "وضع نهاري",
      nightTheme: "وضع ليلي",
    },
  },
  en: {
    floating: {
      heroTitle: "Shape the Future — Intelligent Election Analytics Platform",
      heroSubtitle:
        "Monitor live data, decode voter engagement, and orchestrate your campaign with an immersive digital experience.",
      getStarted: "Get Started",
      viewDashboard: "View Dashboard",
      featuresTitle: "Powerful Capabilities",
      featureCards: [
        {
          title: "Real-time Analytics",
          description:
            "Continuously updating dashboards that mirror the pulse of the vote with precise indicators.",
        },
        {
          title: "Interactive Geo Maps",
          description:
            "Explore voter distribution and committee performance through a dynamic regional map.",
        },
        {
          title: "Custom Reports",
          description:
            "Build and share tailored reports with your team to support strategic decision-making.",
        },
      ],
      statsTitle: "Numbers that Matter",
      ctaTitle: "Be Part of the Next Election Experience",
      ctaSubtitle:
        "Shape your campaign journey from planning to final results with AI-assisted workflows.",
      footerTagline: "Intelligent Election Analytics Platform",
      voters: "Voters",
      participation: "Participation",
      campaigns: "Campaigns",
      dayTheme: "Day Mode",
      nightTheme: "Night Mode",
    },
  },
} as const;

Object.entries(floatingResources).forEach(([lng, resources]) => {
  const namespace = "floating";
  if (!i18n.hasResourceBundle(lng, namespace)) {
    i18n.addResourceBundle(lng, namespace, resources[namespace], true, true);
  }
});

export default floatingResources;
