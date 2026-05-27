import { memo } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, MessageCircleMore } from "lucide-react";
import logo from "../assets/logo_dr.hazem-preview.webp";
import { siteConfig } from "../config/site";
import Reveal from "./Reveal";

const navItems = [
  { name: "الرئيسية", path: "/" },
  { name: "خدماتنا", path: "/services" },
  { name: "من نحن", path: "/about" },
  { name: "الحالات السابقة", path: "/gallery" },
];

const socialLinks = [
  { icon: Facebook, link: siteConfig.facebookUrl, label: "Facebook" },
  { icon: Instagram, link: siteConfig.instagramUrl, label: "Instagram" },
  { icon: MessageCircleMore, link: `https://wa.me/${siteConfig.phoneDigits}`, label: "WhatsApp" },
];

function Footer() {
  return (
    <footer
      dir="rtl"
      className="premium-page premium-ambient relative overflow-hidden border-t border-white/10 px-6 pb-6 pt-10 text-white md:px-10 lg:px-16"
    >
      <Reveal disabled className="relative mx-auto max-w-7xl">
        <div className="glass-card overflow-hidden rounded-[2.25rem] p-8 shadow-[0_36px_100px_rgba(0,0,0,0.28)] md:p-10">
          <div className="grid gap-8 border-b border-white/10 pb-8 lg:grid-cols-[1.18fr_0.8fr_0.9fr]">
            <div className="text-right">
              <img
                alt="شعار عيادة د. حازم سلطان"
                src={logo}
                width="180"
                height="96"
                loading="eager"
                fetchPriority="high"
                className="h-14 w-auto object-contain md:h-16"
              />

              <p className="mt-5 text-sm leading-8 text-slate-300">
                عيادتنا توفر أحدث خدمات الأسنان مع خبرة عالمية <br /> ونهج ي دقيق يركز على راحة
                المريض ونتيجة طبيعية وواضحة.
              </p>

              <div className="mt-5 flex items-center gap-3">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:-translate-y-0.5 hover:border-[#d6bc6a]/40 hover:bg-[#d6bc6a]/16 hover:text-[#f3df9b]"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="text-right">
              <h2 className="text-base font-semibold text-[#f1da97]">الصفحات</h2>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="inline-flex transition hover:text-[#f1da97]">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-right">
              <h2 className="text-base font-semibold text-[#f1da97]">تواصل معنا</h2>
              <div className="mt-5 space-y-4 text-sm text-slate-300">
                <p className="leading-7 transition hover:text-[#f1da97]">{siteConfig.address}</p>
                <a
                  href={`tel:${siteConfig.phoneDigits}`}
                  dir="ltr"
                  className="block transition hover:text-[#f1da97]"
                >
                  {siteConfig.phoneDisplay}
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  dir="ltr"
                  className="block transition hover:text-[#f1da97]"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 text-center text-sm text-slate-400">
           جميع الحقوق محفوظة  د. حازم سلطان . <br /> Powered by Elsawyyy ©
          </div>
        </div>
      </Reveal>
    </footer>
  );
}

export default memo(Footer);
