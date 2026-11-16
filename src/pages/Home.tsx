import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { GamesSection } from "@/components/home/GamesSection";
import { Hero } from "@/components/home/Hero";
import { JoinSection } from "@/components/home/JoinSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { site } from "@/lib/contentLoader";

export default function Home() {
  const { t, language } = useLanguage();
  const title = `${site.studioFullName[language]} — ${t("hero.titleLine1")} ${t("hero.titleLine2")}`;

  usePageMeta({
    title,
    description: t("hero.tagline"),
  });

  return (
    <div className="relative">
      <div className="paper-noise" aria-hidden="true" />
      <Hero />
      <GamesSection />
      <AboutSection />
      <JoinSection />
      <ContactSection />
    </div>
  );
}
