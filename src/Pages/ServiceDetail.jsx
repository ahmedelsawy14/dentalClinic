import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Seo from "../Components/Seo";
import ErrorBoundary from "../Components/ErrorBoundary";
import ServiceHero from "../Components/ServiceHero";
import ServiceArticle from "../Components/ServiceArticle";
import RelatedServices from "../Components/RelatedServices";
import SpecialtyArticlesSection from "../Components/articles/SpecialtyArticlesSection";
import { getRelatedServices, getServiceBySlug } from "../data/services";
import { getServiceContentBySlug, subscribeToArticleStorage } from "../dashboard/utils/articleStorage";

function ServiceDetail() {
  const { serviceName } = useParams();
  const service = getServiceBySlug(serviceName);
  const relatedServices = getRelatedServices(serviceName, 2);
  
  const [, setContentVersion] = useState(0);

  useEffect(() => {
    return subscribeToArticleStorage(() => {
      setContentVersion((v) => v + 1);
    });
  }, []);

  const dynamicContent = getServiceContentBySlug(serviceName);
  const safeArticleContent = dynamicContent?.guide || service?.article;

  if (!service) {
    return (
      <section className="bg-[#07111f] px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#d6bc6a]/18 bg-white/[0.05] p-10 text-center text-white shadow-[0_24px_70px_rgba(0,0,0,0.2)] backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-white">الخدمة غير متاحة حاليًا</h1>
          <p className="mt-4 text-base leading-8 text-slate-300">
            الرابط الذي فتحته لا يطابق خدمة موجودة في العيادة حاليًا. يمكنك الرجوع إلى
            صفحة الخدمات واختيار خدمة أخرى.
          </p>
        </div>
      </section>
    );
  }

  const canonicalUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/services/${service.slug}`
      : `/services/${service.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Dentist",
      name: "Hazem Clinic",
    },
    url: canonicalUrl,
  };

  return (
    <>
      <Seo
        title={service.seoTitle || service.title}
        description={service.seoDescription || service.summary}
        keywords={service.keywords}
        url={canonicalUrl}
        image={service.heroImage}
        schema={schema}
      />

      <main className="relative overflow-hidden bg-[#07111f] px-6 pb-12 pt-28 md:px-10 md:pt-32 lg:px-16 lg:pb-16 lg:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,188,106,0.16),transparent_28%),radial-gradient(circle_at_left_center,rgba(30,64,111,0.28),transparent_32%),linear-gradient(180deg,#07111f_0%,#091729_55%,#0b1d33_100%)]" />
        <div className="absolute right-[7%] top-12 h-72 w-72 rounded-full bg-[#d6bc6a]/10 blur-3xl" />
        <div className="absolute left-[4%] top-44 h-80 w-80 rounded-full bg-[#173a60]/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl space-y-10">
          <ServiceHero service={service} />

          <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
            <ErrorBoundary
              compact
              fallbackTitle="تعذر عرض دليل الخدمة"
              fallbackDescription="حدثت مشكلة أثناء تجهيز محتوى هذه الخدمة. يمكنك متابعة التصفح أو إعادة المحاولة لاحقًا."
            >
              <ServiceArticle article={safeArticleContent} serviceTitle={service.title} />
            </ErrorBoundary>
            <ErrorBoundary compact fallbackTitle="تعذر عرض الخدمات المقترحة">
              <RelatedServices services={relatedServices} />
            </ErrorBoundary>
          </section>

          <ErrorBoundary compact fallbackTitle="تعذر عرض المقالات الإضافية">
            <SpecialtyArticlesSection specialtySlug={service.slug} />
          </ErrorBoundary>
        </div>
      </main>
    </>
  );
}

export default ServiceDetail;
