import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c1023] via-[#101735] to-[#162048] text-white flex flex-col">
      {/* Cover Section */}
      <header className="relative h-[90vh] flex items-center justify-center bg-[url('/img/landing.png')] bg-cover bg-center shadow-xl">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center max-w-4xl px-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-md">
            منصة متكاملة لإدارة الحملات الانتخابية
          </h1>
          <p className="mt-4 text-lg text-gray-200 max-w-xl mx-auto">
            قم بإدارة جميع جوانب حملتك من مكان واحد: الجغرافيا، الناخبين، المرشحين، المتطوعين، التحليلات، وأكثر.
          </p>
          
        </div>
      </header>

      {/* Login Prompt Card */}
      <section className="relative -mt-24 z-20 px-4 md:px-0">
        <div className="max-w-3xl mx-auto bg-white text-black rounded-2xl shadow-xl p-6 md:p-10 text-center border-t-4 border-primary">
          <h3 className="text-xl md:text-2xl font-bold mb-2">هل لديك حساب بالفعل؟</h3>
          <p className="mb-4 text-sm text-muted-foreground">قم بتسجيل الدخول لمتابعة حملتك الانتخابية بكل احترافية</p>
          <Link
            to="/login"
            className="inline-block bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-900 transition"
          >
            تسجيل الدخول الآن
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="flex-1 py-24 px-4 md:px-12 bg-gradient-to-b from-[#101735] to-[#0c1023]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">مميزات التطبيق</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[
              "إدارة المناطق الجغرافية والدوائر",
              "متابعة بيانات الناخبين والمرشحين",
              "تحليل الأداء عبر لوحات التحكم",
              "إدارة المتطوعين والوكلاء",
              "تغطية الملاحظات والتقارير",
              "تخصيص الحملات واللجان بسهولة",
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:scale-[1.02] transition"
              >
                <h3 className="text-lg font-semibold text-white mb-1">{feature}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0c1023] text-center text-sm py-6 border-t border-blue-900 text-gray-400">
        © {new Date().getFullYear()} منصة إدارة الانتخابات. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}
