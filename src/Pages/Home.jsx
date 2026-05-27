import { Fragment } from "react";
import Hero from "../Components/Hero";
import Faq from "../Components/Faq";
import Contact from "../Components/Contact";
import WhyUs from "../Components/WhyUs";
import ClinicServices from "../Components/ClinicServices";
import BeforeAfterSection from "../Components/BeforeAfterSection";
import Seo from "../Components/Seo";
import { siteConfig } from "../config/site";

function Home() {
  return (
    <Fragment>
      <Seo
        title={siteConfig.siteName}
        description={siteConfig.siteDescription}
        url={typeof window !== "undefined" ? window.location.origin : "/"}
      />
      <main className="overflow-hidden bg-[#07111f]">
        <Hero />
        <div id="services">
          <ClinicServices />
        </div>
        <BeforeAfterSection />
        <WhyUs />
        <Faq />
        <Contact />
      </main>
    </Fragment>
  );
}

export default Home;
