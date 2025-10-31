# Task 6 – ربط الحملة المختارة بلوحة التحكم

## مقدمة
يستعرض هذا الدليل أفضل الممارسات التقنية لربط الحملة المختارة في واجهة React مع لوحة التحكم الخاصة بها، بحيث يتم عرض تفاصيل الحملة بناءً على معرفاتها الجغرافية (مثل المحافظة، المركز، الدائرة الانتخابية). يركز الدليل على الاستفادة من Zustand وTanStack React Query لإدارة الحالة والتخزين المؤقت، بما يضمن تجربة سلسة مع تحديث تلقائي للواجهة عند تغيير الحملة النشطة.

يغطي الدليل أربعة محاور رئيسية:
1. **بنية تخزين معرفات التقسيم الجغرافي.**
2. **جلب تفاصيل المنطقة بدون نداءات غير ضرورية.**
3. **تحديث المسار والمكونات تلقائيًا عند اختيار حملة جديدة.**
4. **تنسيق عرض واضح لأسماء المحافظة/المركز/الدائرة في الواجهة.**

---

## 1. بنية تخزين المعرفات الجغرافية في الـ Store
- استخدم مخزن حالة عالمي مثل Zustand أو Context API للاحتفاظ بمعرف الحملة النشطة ومعرفات المحافظة/المركز/الدائرة.
- خزن المعرفات فقط بدلًا من حزم بيانات كاملة، واجلب التفاصيل عند الحاجة عبر React Query.
- افصل حالة واجهة المستخدم (المعرفات المختارة) عن بيانات الخادم (تفاصيل المنطقة) للاستفادة من التخزين المؤقت وتقليل تكرار البيانات.
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
  }

  const useCampaignStore = create<CampaignSelectionState>((set) => ({
    activeCampaignId: null,
    activeGeography: {
      governorateId: null,
      centerId: null,
      districtId: null,
    },
    setActiveCampaign: (id, geo) => set({
      activeCampaignId: id,
      activeGeography: geo,
    }),
  }));
  ```
- استخدم Selectors من Zustand لربط كل مكوّن بالجزء الذي يحتاجه من الحالة فقط، مما يقلل إعادة التصيير.
- تجنب التعشيق العميق غير الضروري وابقِ التحديثات غير قابلة للكسر (immutability) لضمان أداء أفضل.

## 2. جلب تفاصيل المنطقة دون نداءات إضافية
- اعتمد على TanStack React Query لتخزين تفاصيل المناطق مؤقتًا عبر مفاتيح استعلام فريدة.
- أعد استخدام البيانات المخزنة مؤقتًا بدلًا من تكرار النداءات؛ استخدم `initialData` أو `prefetchQuery` عند الانتقال بين الشاشات.
- قم بعملية Prefetch عند معرفة الحملة التي سيُنتقل إليها:
  ```ts
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!districtId) return;
    queryClient.prefetchQuery([
      "district",
      districtId,
    ], () => fetchDistrictById(districtId));
  }, [districtId, queryClient]);
  ```
- اضبط خيارات التخزين المؤقت مثل `staleTime` و`refetchOnWindowFocus` لتقليل النداءات المتكررة إذا كانت البيانات نادرًا ما تتغير.
- إذا كانت البيانات ثابتة، فكر في جلبها مرة واحدة عند بدء التطبيق وتخزينها إما في React Query أو في Zustand مع وسيط `persist`.

## 3. تحديث المسار والمكوّنات تلقائيًا عند اختيار الحملة
- اجعل لكل حملة مسار URL مميز (مثال: `/campaigns/:id/dashboard`) باستخدام React Router.
- نفّذ التنقل البرمجي عبر `useNavigate` عند اختيار حملة جديدة:
  ```ts
  const navigate = useNavigate();

  const goToCampaign = (id: number) => {
    navigate(`/campaigns/${id}/dashboard`);
  };
  ```
- اربط المكوّنات بالمعرفات المخزنة في Zustand أو بالـ URL عبر `useParams` لضمان إعادة التصيير الفوري عند تغيير الاختيار.
- اجعل React Query يعتمد على `activeCampaignId` ضمن مفتاح الاستعلام حتى يجلب (أو يعيد استخدام) بيانات الحملة الجديدة تلقائيًا:
  ```ts
  const { activeCampaignId } = useCampaignStore();

  const { data: campaignDetails } = useQuery({
    queryKey: ["campaign", activeCampaignId],
    queryFn: () => fetchCampaignDetails(activeCampaignId!),
    enabled: !!activeCampaignId,
  });
  ```
- حافظ على تزامن الحالة مع المسار عبر الاعتماد على مصدر حقيقة واحد (URL أو Store) وتجنب التعارض بينهما.

## 4. تنسيق عرض أسماء المحافظة/المركز/الدائرة
- اعرض المستويات الجغرافية بالترتيب الهرمي (محافظة > مركز > دائرة) في ترويسة لوحة التحكم أو داخل Breadcrumbs.
- استخدم نصًا موحدًا أو مكوّن Breadcrumb من مكتبة مثل MUI أو shadcn/ui. مثال بسيط:
  ```tsx
  const locationParts = [provinceName, centerName, districtName].filter(Boolean);

  return (
    <div className="campaign-location">
      {locationParts.join(" / ")}
    </div>
  );
  ```
- أضف تسميات توضيحية إذا لزم الأمر (مثل "المحافظة: القاهرة") لتوضيح المستوى الإداري لكل عنصر.
- راعِ اتجاه النص (RTL) عند تصميم الفواصل أو الأيقونات، واختبر العرض في اللغة العربية للتأكد من وضوح التسلسل.
- عند دمج اسم الحملة مع الموقع، استخدم صيغة متناسقة مثل: `حملة الوعي المدني – القاهرة / المعادي / الدائرة 3`.

---

## الخلاصة
باتباع هذه الممارسات يمكنك تحقيق تجربة متناسقة وسريعة لعرض تفاصيل الحملات الجغرافية. يعتمد النجاح على فصل الحالة عن البيانات، الاستفادة من التخزين المؤقت في React Query، ومزامنة المسارات مع الحالة، مع إبراز التفاصيل الجغرافية بصورة واضحة وسهلة القراءة للمستخدمين.
