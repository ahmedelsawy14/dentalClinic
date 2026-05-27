import ClinicServices from "../Components/ClinicServices";
import Contact from "../Components/Contact";
import Seo from "../Components/Seo";
import { siteConfig } from "../config/site";

function Services() {
  return (
    <>
      <Seo
        title={`خدماتنا | ${siteConfig.siteName}`}
        description="استكشف خدمات عيادة د. حازم سلطان في زراعة الأسنان والتجميل والعلاج التحفظي والحجز السريع."
        url={typeof window !== "undefined" ? `${window.location.origin}/services` : "/services"}
      />
      <main className="overflow-hidden bg-[#07111f] text-white">
        <ClinicServices />
        <Contact />
      </main>
    </>
  );
}

export default Services;
