import i18n from "@/i18n";

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
      dashboard: {
        loadSuccess: "تم تحديث بيانات لوحة التحكم",
        loadError: "تعذر تحميل بيانات لوحة التحكم",
        heatmapError: "تعذر تحميل بيانات الخريطة",
        noStats: "لا توجد بيانات إحصائية حالياً",
        retry: "إعادة المحاولة",
        errorLoading: "تعذر تحميل بيانات لوحة التحكم",
        noData: "لا توجد بيانات متاحة",
        turnoutPoint: "المرحلة {{index}}",
        registrationFallback: "شهر {{index}}",
        cards: {
          participation: "نسبة المشاركة",
          registeredVoters: "الناخبون المسجلون",
          activeVolunteers: "المتطوعون النشطون",
          events: "الفعاليات",
        },
        progress: {
          registration: "التسجيل",
          verification: "التحقق",
          campaign: "الحملة",
          voting: "التصويت",
        },
        activity: {
          other: "أنشطة أخرى",
        },
        charts: {
          turnoutTitle: "منحنى المشاركة",
          turnoutDescription: "تطور نسبة التصويت مع قياس الزخم.",
          progressTitle: "توزيع مراحل الحملة",
          progressDescription: "مقارنة نسب التقدم في مراحل التسجيل والحملة.",
          registrationTitle: "اتجاهات التسجيل",
          registrationDescription: "تحليل تطور تسجيل الناخبين والأنشطة المصاحبة.",
          activitiesTitle: "أنماط الأنشطة",
          activitiesDescription: "حجم الأنشطة الميدانية حسب النوع.",
        },
        overallProgress: "مؤشر التقدم العام",
        overallProgressDescription: "نظرة سريعة على التقدم الإجمالي للحملة.",
        overall: "إجمالي الإنجاز",
        remaining: "المتبقي",
        mapTitle: "خريطة نقاط التأثير",
        mapSubtitle: "تعرّف على توزيع النشاط الميداني ومستويات الدعم.",
        mapEmpty: "لا توجد نقاط نشطة لعرضها حالياً",
        actions: {
          refresh: "تحديث الإحصاءات",
          refreshing: "جاري التحديث...",
          createActivity: "إضافة نشاط",
          openSettings: "إعدادات التطبيق",
        },
      },
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
      dashboard: {
        loadSuccess: "Dashboard data refreshed",
        loadError: "Unable to load dashboard data",
        heatmapError: "Unable to load map data",
        noStats: "No statistics available yet",
        retry: "Retry",
        errorLoading: "Failed to load dashboard data",
        noData: "No data available",
        turnoutPoint: "Period {{index}}",
        registrationFallback: "Month {{index}}",
        cards: {
          participation: "Participation Rate",
          registeredVoters: "Registered Voters",
          activeVolunteers: "Active Volunteers",
          events: "Events",
        },
        progress: {
          registration: "Registration",
          verification: "Verification",
          campaign: "Campaign",
          voting: "Voting",
        },
        activity: {
          other: "Other activities",
        },
        charts: {
          turnoutTitle: "Turnout trend",
          turnoutDescription: "Track participation momentum throughout the cycle.",
          progressTitle: "Campaign stages",
          progressDescription: "Compare progress across registration and campaign phases.",
          registrationTitle: "Registration trends",
          registrationDescription: "Monitor voter registrations and supporting activity.",
          activitiesTitle: "Activity mix",
          activitiesDescription: "Volume of field operations by type.",
        },
        overallProgress: "Overall progress",
        overallProgressDescription: "A snapshot of campaign completion.",
        overall: "Completed",
        remaining: "Remaining",
        mapTitle: "Impact map",
        mapSubtitle: "See where field engagement is most active.",
        mapEmpty: "No active points to display",
        actions: {
          refresh: "Refresh stats",
          refreshing: "Refreshing...",
          createActivity: "Log new activity",
          openSettings: "Open settings",
        },
      },
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
