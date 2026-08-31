import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLang } from '../../context/LangContext';
import { LanguageDropdown } from '../common/LanguageDropdown';

export const LandingPage = () => {
  const { openAuthModal } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();

  const slides = [
    {
      id: 1,
      titlePrefix: t('slide1_prefix') || "For every",
      titleMain: t('slide1_main') || "citizen.",
      description: t('slide1_desc') || "Find government schemes and benefits that are relevant to you, all in one place.",
      align: "right",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgTOx9-hHrWJnNPvDratJWjoIFZGVZddVqB9bezMOMVCaVJo1PKsAMNjQMnCEruvkOqHJl0wCAo9Zq6JMvecqzXrF4c_EVBhpj8ORUVJf6EFrDaISpsTb949PuGBb6FmAlzLUUrnWO9yRVbcFRaQ7aEJUqGspwm0Zs5-N2sI__1uLDYJWGax3OzUpnRPhZu0BQGGSVRPgBJZGtnZ953qJPNDNvCTGc7TYlTF2nVwrASLlDacG2N_8WidwTdqp8VXjLX6A",
      gradient: "bg-gradient-to-l from-black/85 via-black/40 to-transparent w-full md:w-2/3 ml-auto",
    },
    {
      id: 2,
      titlePrefix: t('slide2_prefix') || "For every",
      titleMain: t('slide2_main') || "student.",
      description: t('slide2_desc') || "Discover scholarships, education support, and opportunities designed to help you move forward.",
      align: "left",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3CAKqBDPr1LzEhL21pMbzMByIFID4RZoXPRfIvl5a1xI-XSka2aAyeJHp5a_hhmZTH-9tJkvwI0-m43zuPJKE835n5r1lggMtwqpnaU7I5RdkeWWsnrVh_rOFvrvpSg8GaButtDZCrSzS3XLBMAxy3aGOvH82Zz6ujk2VmIvz5djeZhqBO2AIf4N0o7KutfF_ERxlbxXqDI1D4cire30mPlN-4NWni37TOOH6ym6JXNPd-jR729dMlVDd7DU_r0N0SzA",
      gradient: "bg-gradient-to-r from-black/85 via-black/40 to-transparent w-full md:w-2/3",
    },
    {
      id: 3,
      titlePrefix: t('slide3_prefix') || "For every",
      titleMain: t('slide3_main') || "farmer.",
      description: t('slide3_desc') || "Find agricultural support, financial assistance, and schemes designed around your livelihood.",
      align: "right",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeJVXEf4Ht6UphuDrDvwDuTM-olUYtC2pdl-dgI9EdTWpFzIKzD62XDi00gWMzoQJNjpqkNi5CPP34fU2AtjSENnW-CTnsy_LDeYiZ-RZs_UT5CsEPBJ-o1htQhDeXBg0QBg9viEd_8jSgvcwpZ9-PlEnfd0j_07oV-v1YqfGp9zGlPQVfjA84NXrxOnZhGMg1vjmhNQrYhVX2jryhJcSDFV5oUQjgkxFZleckM8vloMDbzSBo-K4ZCSNhI9w4Hi81D20",
      gradient: "bg-gradient-to-l from-black/85 via-black/40 to-transparent w-full md:w-2/3 ml-auto",
    },
    {
      id: 4,
      titlePrefix: t('slide4_prefix') || "For every",
      titleMain: t('slide4_main') || "woman.",
      description: t('slide4_desc') || "Discover benefits, financial support, and opportunities that help you move forward.",
      align: "left",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMhFp_fM50e3_ypcQq7G5TZzoZnrcLniXWj3tc2Jc81cf_pzRcf08679GbD0ZvZmCaqb_-EPWHQvlIc0lsNlkkKB6VPb0t_LXaBoUJGwFV68NkgzuNoCBJUUScRqhnBortaKOPtvIbalC_OaZdP7RHAOB8Yw8effnGkZhHhy4A6Y-YHWeQ8V9F9fPeVJQtQCRYRhfLCp_T6Q-HSlj56BdNB0IkFDpk7XHgl0PRLlKzZeGUbFJGEuCnYdZqfgPunLWpRdY",
      gradient: "bg-gradient-to-r from-black/85 via-black/40 to-transparent w-full md:w-2/3",
    },
    {
      id: 5,
      titlePrefix: t('slide5_prefix') || "For every",
      titleMain: t('slide5_main') || "entrepreneur.",
      description: t('slide5_desc') || "Find business support, incentives, and government schemes built around your enterprise.",
      align: "right",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_tpCPEQLHCplnFlSGVCbFMEhPxb-LNd3vog0vk5DzMwTC28MGV01boAeOEME7Pc_np4kcb8G-DuR3b8KEUvKVKPzD6q8UTrTe8lOjx3Q74egMaoHSt_8WmDYKTqaOkSnA3435wcXebCm8Sirf5B019z8QzhWCooVvwDwm1kt31xTzdszvT1dIqnULFAJJS_mPVagIxlGJBtLobUCm9Ikf7zLYWX9_ZH6oq2E9ERszFXglB7mCFYAtxiE1W484iokaauM",
      gradient: "bg-gradient-to-l from-black/85 via-black/40 to-transparent w-full md:w-2/3 ml-auto",
    },
    {
      id: 6,
      titlePrefix: t('slide6_prefix') || "For every",
      titleMain: t('slide6_main') || "generation.",
      description: t('slide6_desc') || "Discover support, benefits, and schemes designed to make everyday life more secure.",
      align: "left",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFcIxQKSFbRIVHYySqpzmIxNcSoU3R8Cwux-yB6bnllwk0TkpwXkH7m3p3mPP0g9sJlb92vMsN59Kl9H78e_UpEnIuD05Ta95-hDVPXiHQEWPqqKnlLILOF5Aa3IL9kz90LdjjCJgZKzgAlc5N8ApePnMZyPLAu0KyaagSFaVuDGfs9nzXW1KrfA5KLNu1b2WQ1ghiomwSl_qGcg69ykEZtrQ-IfsZo7gTd93CD0hHTF3YTf9A_GKTVJ4WyOVYW2o2W-4",
      gradient: "bg-gradient-to-r from-black/85 via-black/40 to-transparent w-full md:w-2/3",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [descriptionVisibleText, setDescriptionVisibleText] = useState('');

  // Single unified ref managing all slideshow animation timers
  const timerRef = useRef({
    startTypingTimer: null,
    typingInterval: null,
    autoplayTimer: null,
  });

  const clearAllTimers = () => {
    if (timerRef.current.startTypingTimer) clearTimeout(timerRef.current.startTypingTimer);
    if (timerRef.current.typingInterval) clearInterval(timerRef.current.typingInterval);
    if (timerRef.current.autoplayTimer) clearTimeout(timerRef.current.autoplayTimer);
  };

  const handleIndicatorClick = (newIndex) => {
    clearAllTimers();
    setDescriptionVisibleText('');
    setCurrentSlide(newIndex);
  };

  useEffect(() => {
    // 1. Immediately cancel prior timers and reset description
    clearAllTimers();
    setDescriptionVisibleText('');

    const activeIndex = currentSlide;
    const activeDescription = slides[activeIndex].description;
    let charCount = 0;

    // 2. Wait 500ms for slide entry and title reveal, then begin typing
    timerRef.current.startTypingTimer = setTimeout(() => {
      timerRef.current.typingInterval = setInterval(() => {
        charCount += 1;
        setDescriptionVisibleText(activeDescription.slice(0, charCount));

        if (charCount >= activeDescription.length) {
          clearInterval(timerRef.current.typingInterval);

          // Autoplay to next slide after comfortable reading time
          timerRef.current.autoplayTimer = setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
          }, 5000);
        }
      }, 24);
    }, 500);

    return () => {
      clearAllTimers();
    };
  }, [currentSlide]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-body-lg">
      {/* Top Header */}
      <header className="absolute top-0 left-0 right-0 h-16 bg-surface-container-lowest/80 dark:bg-slate-900/80 backdrop-blur-2xl z-40 flex items-center justify-between px-6 md:px-12 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-white/20">
        <div className="flex items-center gap-3">
          <span className="text-primary font-headline-md text-2xl font-bold drop-shadow-md">
            {t('brandName')}
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-surface-container-low dark:hover:bg-slate-800 rounded-full transition-colors text-on-surface-variant dark:text-slate-200"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            <span className="material-symbols-outlined text-[20px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Language Dropdown */}
          <LanguageDropdown isLanding={true} />

          {/* Standalone Navbar CTA button (always visible & accessible) */}
          <button
            onClick={() => openAuthModal('citizen_login')}
            className="px-5 py-2 bg-primary text-on-primary font-label-bold text-sm rounded-full hover:bg-primary-container transition-all hover:scale-105 shadow-md"
          >
            {t('getStarted')}
          </button>
        </div>
      </header>

      {/* Main Slides Viewport Container */}
      <main className="relative w-full h-screen overflow-hidden">
        {/* Animated Horizontal Slide Track */}
        <div
          className="relative w-full h-full flex transition-transform duration-[1200ms] ease-[cubic-bezier(0.8,0,0.2,1)]"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;

            return (
              <div
                key={slide.id}
                className={`slide w-full min-w-full max-w-full h-full relative flex-shrink-0 overflow-hidden ${
                  isActive ? 'active-slide' : ''
                }`}
              >
                {/* Background Image strictly cropped to slide boundary */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                  style={{ backgroundImage: `url('${slide.image}')` }}
                />

                {/* Dark Gradient Overlay */}
                <div className={`absolute inset-0 ${slide.gradient}`} />

                {/* Content Layer */}
                <div
                  className={`relative h-full flex items-center px-6 sm:px-12 md:px-[8%] lg:px-[10%] z-10 pt-16 pb-28 ${
                    slide.align === 'right' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`slide-content max-w-[560px] w-full flex flex-col ${
                      slide.align === 'right' ? 'items-end text-right' : 'items-start text-left'
                    }`}
                  >
                    {/* Title with editorial reveal */}
                    <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 sm:mb-6 drop-shadow-lg leading-tight font-sans">
                      <span className="block font-light italic text-white/90">
                        {slide.titlePrefix}
                      </span>
                      <span className="block font-bold">
                        {slide.titleMain}
                      </span>
                    </h1>

                    {/* Character-by-Character Typewriter Description */}
                    <p className="font-body-lg text-sm sm:text-base md:text-lg text-gray-200 drop-shadow-md leading-relaxed break-words whitespace-normal max-w-full">
                      {isActive ? descriptionVisibleText : ''}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slide Indicators */}
        <div className="absolute top-24 right-8 z-20 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleIndicatorClick(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
              title={`Slide ${idx + 1}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Integrated Footer Overlay */}
        <div className="absolute bottom-0 w-full z-20 flex flex-col items-center pb-4 px-6 gap-2 pointer-events-auto">
          {/* Trust Strip */}
          <div className="flex flex-col items-center w-full max-w-4xl mb-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 mb-1.5 font-semibold">
              {t('builtForEveryCitizen')}
            </span>
            <div className="flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-8 gap-y-2 py-2.5 px-6 sm:px-8 rounded-full bg-white/10 dark:bg-black/40 backdrop-blur-[20px] border border-white/20 w-full text-xs sm:text-sm">
              <span className="font-medium text-white/90">{t('govSchemes')}</span>
              <span className="w-1 h-1 rounded-full bg-white/40 hidden sm:inline-block"></span>
              <span className="font-medium text-white/90">{t('citizenServices')}</span>
              <span className="w-1 h-1 rounded-full bg-white/40 hidden sm:inline-block"></span>
              <span className="font-medium text-white/90">{t('digitalAccess')}</span>
              <span className="w-1 h-1 rounded-full bg-white/40 hidden sm:inline-block"></span>
              <span className="font-medium text-white/90">{t('businessSupport')}</span>
            </div>
          </div>

          {/* Creator Signature: Made with ♥ by Team CodeFlux */}
          <div className="text-[11px] sm:text-xs text-white/75 font-medium my-0.5 flex items-center gap-1 drop-shadow-sm">
            <span>Made with</span>
            <span className="text-red-400">♥</span>
            <span>by Team</span>
            <span className="text-primary-fixed font-bold tracking-wide">CodeFlux</span>
          </div>

          {/* Legal & Disclaimer */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl pt-2 border-t border-white/10 gap-2 text-[10px] text-white/50">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span>© 2026 YojanaSetu</span>
              <span className="opacity-50">|</span>
              <span>{t('independentCitizenPlatform')}</span>
              <span className="opacity-50">|</span>
              <span className="hover:underline cursor-pointer">{t('privacy')}</span>
              <span className="opacity-50">|</span>
              <span className="hover:underline cursor-pointer">{t('terms')}</span>
            </div>
            <div className="text-center md:text-right text-[9px] text-white/40 max-w-xl">
              {t('platformDisclaimer')}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
