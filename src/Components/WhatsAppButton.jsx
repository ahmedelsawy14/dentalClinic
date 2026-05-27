import { MessageCircleMore } from "lucide-react";
import { siteConfig } from "../config/site";

function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${siteConfig.phoneDigits}?text=${encodeURIComponent(siteConfig.whatsappDefaultMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#1ebe5d] md:h-16 md:w-16"
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircleMore size={28} />
    </a>
  );
}

export default WhatsAppButton;
