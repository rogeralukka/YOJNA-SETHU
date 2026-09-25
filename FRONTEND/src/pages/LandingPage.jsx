import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import slideNamaskar from "../assets/slides/namaskar.png";
import slideStudents from "../assets/slides/students.png";
import slideFarmers from "../assets/slides/farmers.png";
import slideWoman from "../assets/slides/woman.png";
import slideEntrepreneurs from "../assets/slides/entrepreneurs.png";
import slideSeniorCitizen from "../assets/slides/senior_citizen.jpeg";
import useDirection from "../hooks/useDirection";

/**
 * Typewriter Component for subheadings:
 * Types out the text character by character with an active blinking cursor.
 */
function Typewriter({ text = "", speed = 24 }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let charIndex = 0;
    setDisplayText("");

    const interval = setInterval(() => {
      charIndex += 1;
      setDisplayText(text.slice(0, charIndex));
      if (charIndex >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayText}
      <span className="inline-block ms-0.5 text-white/90 font-mono font-bold animate-pulse">
        |
      </span>
    </span>
  );
}

/**
 * Public Landing Page (/)
 * Features:
 *   • Direction-aware horizontal slide transition track (LTR/RTL)
 *   • Typewriter animation for subheading text on slide entry
 *   • Auto-advances every 5 seconds (resets on user interaction)
 *   • Slide 1: "For every citizen." (Namaskar gesture woman)
 *   • Slide 2: "For every student."
 *   • Slide 3: "For every farmer."
 *   • Slide 4: "For every woman."
 *   • Slide 5: "For every entrepreneur."
 *   • Slide 6: "For every generation."
 *   • Interactive dot navigation indicators
 *   • Transparent 3-column footer overlayed directly on the hero image
 */
export default function LandingPage() {
  const { t } = useTranslation();
  const direction = useDirection();
  const isRtl = direction === "rtl";

  const slides = [
    {
      id: 1,
      headline: t("hero.slides.slide1.headline", "For every citizen."),
      description: t("hero.slides.slide1.description", "Your unified gateway to public services, verified document credentials, and national welfare entitlements in one sovereign portal."),
      image: slideNamaskar,
      gradient: "bg-gradient-to-r rtl:bg-gradient-to-l from-black/85 via-black/50 to-transparent w-full md:w-2/3",
      align: "start"
    },
    {
      id: 2,
      headline: t("hero.slides.slide2.headline", "For every student."),
      description: t("hero.slides.slide2.description", "Streamline scholarship applications, verified academic credentials, and skill development opportunities with zero friction."),
      image: slideStudents,
      gradient: "bg-gradient-to-r rtl:bg-gradient-to-l from-black/85 via-black/50 to-transparent w-full md:w-2/3",
      align: "start"
    },
    {
      id: 3,
      headline: t("hero.slides.slide3.headline", "For every farmer."),
      description: t("hero.slides.slide3.description", "Direct benefit transfers, crop insurance records, and agricultural portal services tailored directly to your land and livelihood."),
      image: slideFarmers,
      gradient: "bg-gradient-to-l rtl:bg-gradient-to-r from-black/85 via-black/50 to-transparent w-full md:w-2/3 ms-auto",
      align: "end"
    },
    {
      id: 4,
      headline: t("hero.slides.slide4.headline", "For every woman."),
      description: t("hero.slides.slide4.description", "Healthcare coverage, financial inclusion programs, and household welfare orchestration to empower your independence."),
      image: slideWoman,
      gradient: "bg-gradient-to-r rtl:bg-gradient-to-l from-black/85 via-black/50 to-transparent w-full md:w-2/3",
      align: "start"
    },
    {
      id: 5,
      headline: t("hero.slides.slide5.headline", "For every entrepreneur."),
      description: t("hero.slides.slide5.description", "Accelerated business registrations, MSME credit schemes, and federated commercial gateways built to scale your enterprise."),
      image: slideEntrepreneurs,
      gradient: "bg-gradient-to-l rtl:bg-gradient-to-r from-black/85 via-black/50 to-transparent w-full md:w-2/3 ms-auto",
      align: "end"
    },
    {
      id: 6,
      headline: t("hero.slides.slide6.headline", "For every generation."),
      description: t("hero.slides.slide6.description", "A unified family vault safeguarding pension rights, health benefits, and citizen entitlements across your household's lifetime."),
      image: slideSeniorCitizen,
      gradient: "bg-gradient-to-r rtl:bg-gradient-to-l from-black/85 via-black/50 to-transparent w-full md:w-2/3",
      align: "start"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slideshow every 5 seconds (resets on currentSlide change)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide, slides.length]);

  return (
    <div className="relative w-full h-full flex-1 min-h-0 bg-black text-white font-body-lg overflow-hidden select-none flex flex-col">
      {/* Outer Carousel Container */}
      <div className="relative w-full h-full flex-1 overflow-hidden">
        {/* Horizontal Flex Track with direction-aware translate */}
        <div
          className="flex w-full h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(${isRtl ? currentSlide * 100 : -currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className="w-full flex-shrink-0 h-full relative overflow-hidden"
              >
                {/* Background Image filling container */}
                <img
                  src={slide.image}
                  alt={slide.headline}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  loading="eager"
                />

                {/* Dark Gradient Overlay for Text Readability */}
                <div className={`absolute inset-0 ${slide.gradient}`} />

                {/* Slide Text Content Layer */}
                <div
                  className={`relative h-full flex items-center px-6 sm:px-12 md:px-[8%] lg:px-[10%] z-10 py-16 ${
                    slide.align === "end" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[620px] w-full flex flex-col ${
                      slide.align === "end" ? "items-end text-end" : "items-start text-start"
                    }`}
                  >
                    <h1 className="font-headline-xl text-3xl sm:text-5xl md:text-6xl text-white mb-4 drop-shadow-lg leading-tight font-sans font-bold">
                      {slide.headline}
                    </h1>

                    <p className="font-body-lg text-sm sm:text-base md:text-lg text-slate-200 drop-shadow-md leading-relaxed min-h-[48px] sm:min-h-[56px]">
                      {isActive ? (
                        <Typewriter key={currentSlide} text={slide.description} speed={24} />
                      ) : (
                        slide.description
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dark Gradient at the bottom to ensure footer & dots are always legible */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-15" />

      {/* Slideshow Navigation Dots */}
      <div
        className="absolute bottom-20 sm:bottom-24 inset-x-0 z-20 flex justify-center items-center gap-2.5 pointer-events-auto"
        role="tablist"
        aria-label={t("hero.slideshowControls", "Hero Slideshow Controls")}
      >
        {slides.map((_, index) => {
          const isActive = index === currentSlide;
          return (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={t("hero.slide", { current: index + 1, total: slides.length, defaultValue: `Slide ${index + 1}` })}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/80 cursor-pointer ${
                isActive
                  ? "w-8 bg-white shadow-md"
                  : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          );
        })}
      </div>

      {/* Transparent 3-Column Overlay Footer */}
      <footer className="absolute bottom-0 inset-x-0 z-20 p-6 text-xs text-white/80 flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-auto">
        {/* Left / Start */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 text-slate-200">
          <span className="font-semibold text-white">© 2026 NagrikPath</span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span>{t("footer.platformType", "Independent citizen platform")}</span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="hover:text-white transition cursor-pointer">{t("footer.privacy", "Privacy")}</span>
          <span className="text-white/40">|</span>
          <span className="hover:text-white transition cursor-pointer">{t("footer.terms", "Terms")}</span>
        </div>

        {/* Center */}
        <div className="text-slate-200 font-medium flex items-center justify-center gap-1.5">
          <span>{t("footer.credit", "Made with ❤️ by Team CodeFlux")}</span>
        </div>

        {/* Right / End */}
        <div className="text-[11px] text-white/70 text-center md:text-end max-w-sm">
          {t("footer.disclaimer", "NagrikPath is an independent platform. Not affiliated with any government body.")}
        </div>
      </footer>
    </div>
  );
}
