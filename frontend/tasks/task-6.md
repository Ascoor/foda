# Task 6 – ربط الحملة المختارة بلوحة التحكم

## مقدمة
يستعرض هذا الدليل أفضل الممارسات التقنية لربط الحملة المختارة في واجهة React مع لوحة التحكم الخاصة بها، بحيث تُعرَض تفاصيل الحملة بناءً على معرفاتها الجغرافية (مثل المحافظة، المركز، الدائرة الانتخابية). يرتكز الدليل على الجمع بين Zustand لإدارة حالة واجهة المستخدم وTanStack React Query للتعامل مع بيانات الخادم والتخزين المؤقت، لضمان تجربة سلسة مع تحديث تلقائي للواجهة عند تغيير الحملة النشطة.

يغطي الدليل أربعة محاور رئيسية:
1. **بنية تخزين معرفات التقسيم الجغرافي.**
2. **جلب تفاصيل المنطقة بدون نداءات غير ضرورية.**
3. **تحديث المسار والمكوّنات تلقائيًا عند اختيار حملة جديدة.**
4. **تنسيق عرض واضح لأسماء المحافظة/المركز/الدائرة في الواجهة.**

---

## 1. بنية تخزين المعرفات الجغرافية في الـ Store
- استخدم مخزن حالة عالمي مثل Zustand للاحتفاظ بمعرف الحملة النشطة ومعرفات المحافظة/المركز/الدائرة. يوفر Zustand نموذجًا بسيطًا قائمًا على الدوال selectors يسمح للمكوّنات بالاشتراك في أجزاء محددة من الحالة فقط، ما يقلل إعادة التصيير غير الضرورية.[^zustand]
- خزن المعرفات فقط بدلًا من حزم بيانات كاملة، واجلب التفاصيل عند الحاجة عبر React Query لتجنب ازدواجية البيانات بين الـ store والتخزين المؤقت.[^query-overview]
- افصل حالة واجهة المستخدم (المعرفات المختارة) عن بيانات الخادم (تفاصيل المنطقة) للاستفادة من التخزين المؤقت وتقليل تكرار البيانات. يعمل هذا الفصل على إبقاء الـ store خفيفًا، بينما يتكفل React Query بإدارة التحميل، والأخطاء، ومدة صلاحية البيانات.
- مثال على شريحة Zustand:
  ```ts
  interface CampaignSelectionState {
    activeCampaignId: number | null;
    activeGeography: {
      governorateId: number | null;
      centerId: number | null;
      districtId: number | null;
    };
    setActiveCampaign: (
      campaignId: number,
      geo: { governorateId: number; centerId: number; districtId: number }
    ) => void;
    resetCampaign: () => void;
  }

  const defaultGeography = {
    governorateId: null,
    centerId: null,
    districtId: null,
  };

  const useCampaignStore = create<CampaignSelectionState>((set) => ({
    activeCampaignId: null,
    activeGeography: defaultGeography,
    setActiveCampaign: (id, geo) =>
      set({
        activeCampaignId: id,
        activeGeography: { ...geo },
      }),
    resetCampaign: () => set({ activeCampaignId: null, activeGeography: defaultGeography }),
  }));
  ```
- استخدم Selectors من Zustand لربط كل مكوّن بالجزء الذي يحتاجه من الحالة فقط، مما يقلل إعادة التصيير. إذا كان المكوّن لا يحتاج سوى `districtId`، فحدّد selector يعيد هذا الحقل فقط.
- تجنب التعشيق العميق غير الضروري وحافظ على التحديثات غير قابلة للكسر (immutable) لضمان أداء أفضل؛ يقوم Zustand بدمج الحالة بآلية shallow merge ما دام يتم تمرير كائنات جديدة عند التحديث.

## 2. جلب تفاصيل المنطقة دون نداءات إضافية
- اعتمد على TanStack React Query لتخزين تفاصيل المناطق مؤقتًا عبر مفاتيح استعلام فريدة؛ أي استعلام يتم تنفيذه بمفتاح محدد يخزَّن عالميًا ويمكن إعادة استخدامه بدون جلب جديد طالما أن البيانات ما زالت طازجة.[^query-caching]
- أعد استخدام البيانات المخزنة مؤقتًا بدلًا من تكرار النداءات عبر توفير `initialData` عند انتقال المستخدم بين الشاشات، أو عبر تمرير البيانات الموجودة في القائمة إلى شاشة التفاصيل.
- نفّذ `prefetchQuery` فور معرفة الحملة التي سيُنتقل إليها حتى تكون البيانات جاهزة قبل عرض لوحة التحكم:
  ```ts
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!districtId) return;
    queryClient.prefetchQuery({
      queryKey: ["district", districtId],
      queryFn: () => fetchDistrictById(districtId),
      staleTime: 5 * 60 * 1000,
    });
  }, [districtId, queryClient]);
  ```
- اضبط خيارات التخزين المؤقت مثل `staleTime`, `cacheTime`, و`refetchOnWindowFocus` لتقليل النداءات المتكررة إذا كانت البيانات نادرًا ما تتغير. يمكن تعيين `staleTime` لبضع دقائق أو تعطيل إعادة الجلب عند إعادة تركيز النافذة إذا كانت البيانات شبه ثابتة.
- إذا كانت البيانات الجغرافية ثابتة (مثل قائمة المحافظات والمراكز)، فكر في جلبها مرة واحدة عند بدء التطبيق وتخزينها في React Query أو في Zustand باستخدام middleware مثل `persist` لتسريع تحميل الواجهة وتقليل الضغط على الخادم.
- في حال عدم استخدام React Query، يمكنك إضافة طبقة caching داخل الـ store، لكن ذلك يتطلب إدارة حالات التحميل والأخطاء يدويًا. تظل React Query الخيار الأبسط لأنها توفر هذه الإدارة افتراضيًا.

## 3. تحديث المسار والمكوّنات تلقائيًا عند اختيار الحملة
- اجعل لكل حملة مسار URL مميز (مثل `/campaigns/:campaignId/dashboard`) باستخدام React Router. وجود معرف الحملة داخل المسار يجعل الروابط قابلة للمشاركة ويسهّل التنقل إلى الحملة الصحيحة بعد إعادة تحميل الصفحة.[^router-patterns]
- نفّذ التنقل البرمجي عبر `useNavigate` عند اختيار حملة جديدة:
  ```ts
  const navigate = useNavigate();

  const goToCampaign = (id: number) => {
    navigate(`/campaigns/${id}/dashboard`, { replace: false });
  };
  ```
- اربط المكوّنات بالمعرفات المخزنة في Zustand أو استخرجها مباشرة من `useParams` لضمان إعادة التصيير الفوري عند تغيير الاختيار. احرص على اختيار مصدر حقيقة واحد كي لا تتعارض قيم الـ store مع عنوان المسار.
- اجعل React Query يعتمد على `activeCampaignId` ضمن مفتاح الاستعلام حتى يجلب (أو يعيد استخدام) بيانات الحملة الجديدة تلقائيًا:
  ```ts
  const { activeCampaignId } = useCampaignStore((state) => ({
    activeCampaignId: state.activeCampaignId,
  }));

  const { data: campaignDetails } = useQuery({
    queryKey: ["campaign", activeCampaignId],
    queryFn: () => fetchCampaignDetails(activeCampaignId!),
    enabled: !!activeCampaignId,
    staleTime: 2 * 60 * 1000,
  });
  ```
- يمكن الاستفادة من `queryClient.invalidateQueries` عند تغيير الحملة لإجبار تحديث البيانات التي تعتمد على المعرف السابق، أو استخدام React Router loaders إذا كان المشروع يعتمد على نهج data routers. يبقى React Query مفيدًا حتى مع loaders لأنه يمنع الجلب المكرر عند العودة إلى حملة تمت زيارتها.

## 4. تنسيق عرض أسماء المحافظة/المركز/الدائرة
- اعرض المستويات الجغرافية بالترتيب الهرمي (محافظة > مركز > دائرة) في ترويسة لوحة التحكم أو داخل Breadcrumbs لتسهيل فهم نطاق الحملة للمستخدم.
- استخدم نصًا موحدًا أو مكوّن Breadcrumb جاهز مثل مكوّن `Breadcrumbs` من مكتبة MUI، أو نظير له في shadcn/ui، لتوفير تنسيق متناسق ويدعم إمكانية النقر على المستويات العليا عند الحاجة.[^mui-breadcrumbs]
- مثال بسيط باستخدام JSX:
  ```tsx
  const locationParts = [provinceName, centerName, districtName].filter(Boolean);

  return (
    <div className="campaign-location" dir="rtl">
      {locationParts.join(" / ")}
    </div>
  );
  ```
- أضف تسميات توضيحية إذا لزم الأمر (مثل "المحافظة: القاهرة") لتوضيح المستوى الإداري لكل عنصر، وراعِ اتجاه النص (RTL) عند تصميم الفواصل أو الأيقونات.
- عند دمج اسم الحملة مع الموقع، استخدم صيغة متناسقة مثل: `حملة الوعي المدني – القاهرة / المعادي / الدائرة 3`. يمكن أيضًا استخدام أيقونات أو ألوان مختلفة لتسليط الضوء على الدائرة الانتخابية باعتبارها المستوى الأدنى.

---

## الخلاصة
باتباع هذه الممارسات يمكنك تحقيق تجربة متناسقة وسريعة لعرض تفاصيل الحملات الجغرافية. يعتمد النجاح على فصل الحالة عن بيانات الخادم، والاستفادة من قدرات التخزين المؤقت في React Query، ومزامنة المسارات مع الحالة، مع إبراز التفاصيل الجغرافية بصورة واضحة وسهلة القراءة للمستخدمين.

[^zustand]: [Zustand documentation – Getting Started](https://docs.pmnd.rs/zustand/getting-started/introduction)
[^query-overview]: [TanStack Query – React Overview](https://tanstack.com/query/latest/docs/react/overview)
[^query-caching]: [TanStack Query – Caching](https://tanstack.com/query/latest/docs/react/guides/caching)
[^router-patterns]: [React Router – Tutorial & useNavigate](https://reactrouter.com/en/main/hooks/use-navigate)
[^mui-breadcrumbs]: [MUI – Breadcrumbs component](https://mui.com/material-ui/react-breadcrumbs/)
