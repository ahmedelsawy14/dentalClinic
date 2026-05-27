import { useEffect, useState } from "react";
import { DENTAL_ARTICLES_KEY, getAllArticles, getSpecialties } from "../utils/articleStorage";
import { getCases } from "../../services/casesService";

function SettingsPage() {
  const specialties = getSpecialties();
  const articleCount = getAllArticles().length;
  const [caseCount, setCaseCount] = useState(0);

  useEffect(() => {
    getCases()
      .then((cases) => setCaseCount(cases.length))
      .catch(() => setCaseCount(0));
  }, []);

  const storageSize = (() => {
    const articlesRaw = window.localStorage.getItem(DENTAL_ARTICLES_KEY) || "";
    const bytes = new Blob([articlesRaw]).size;
    return bytes ? `${(bytes / 1024).toFixed(1)} KB` : "Cloudinary + Firestore";
  })();

  return (
    <section dir="rtl" className="space-y-4 text-right text-white">
      <div className="glass-card rounded-[2rem] p-5 md:p-6">
        <p className="text-sm font-semibold tracking-[0.22em] text-[#d6bc6a]">الإعدادات</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">إعدادات البيئة الحالية</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
          نظرة سريعة على المحتوى الحالي داخل لوحة الإدارة، مع بقاء المقالات محليًا وربط الحالات بقاعدة البيانات.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "التخصصات", value: specialties.length },
          { label: "الأدلة الرئيسية", value: specialties.length },
          { label: "المقالات الإضافية", value: articleCount },
          { label: "الحالات", value: caseCount },
          { label: "حجم التخزين", value: storageSize },
        ].map((item) => (
          <div key={item.label} className="glass-card rounded-[1.7rem] p-5">
            <p className="text-sm text-slate-300">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SettingsPage;
