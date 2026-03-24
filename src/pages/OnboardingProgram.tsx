import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  HeartHandshake,
  TrendingUp,
  HandCoins,
  Smartphone,
  Wallet,
  PlayCircle,
} from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const ImpactStat = ({ value, suffix, label }: { value: number; suffix?: string; label: string }) => {
  const { count, elementRef } = useCountUp({ end: value, duration: 1800, startOnView: true });

  return (
    <div ref={elementRef} className="glass rounded-xl p-6 text-center">
      <p className="font-display text-4xl font-bold text-primary">
        {suffix ?? ""}
        {count}
      </p>
      <p className="text-muted-foreground mt-2">{label}</p>
    </div>
  );
};

const OnboardingProgram = () => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [missingImages, setMissingImages] = useState<number[]>([]);
  const [donateMethod, setDonateMethod] = useState<"mobile" | "crypto" | null>(null);
  const onboardingImages = [
    "/onboarding/onboarding-1.jpg",
    "/onboarding/onboarding-2.jpg",
    "/onboarding/onboarding-3.jpg",
    "/onboarding/onboarding-4.jpg",
    "/onboarding/onboarding-5.jpg",
    "/onboarding/onboarding-6.jpg",
  ];
  const testimonials = [
    {
      name: "Olivier M.",
      photo: "/onboarding/testimonials/testimonial-1.png",
      videoUrl: "https://www.youtube.com/watch?v=AERCr9821Ig&t=11s",
    },
    {
      name: "Olivier M.",
      photo: "/onboarding/testimonials/testimonial-1.png",
      videoUrl: "https://www.youtube.com/watch?v=AERCr9821Ig&t=11s",
    },
    {
      name: "Olivier M.",
      photo: "/onboarding/testimonials/testimonial-1.png",
      videoUrl: "https://www.youtube.com/watch?v=AERCr9821Ig&t=11s",
    },
  ];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % onboardingImages.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [onboardingImages.length, isPaused]);

  return (
    <div>
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">{t("onboarding.title")}</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t("onboarding.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 space-y-10">
          <motion.div
            id="what-is-onboarding"
            {...fadeUp}
            className="glass rounded-xl p-8 scroll-mt-28"
          >
            <div className="flex items-center justify-center gap-3 mb-6 text-center">
              <HeartHandshake className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl font-bold">{t("onboarding.whatTitle")}</h2>
            </div>
            <div
              className="relative rounded-2xl overflow-hidden border border-border min-h-[520px] lg:min-h-[620px]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence mode="wait">
                {missingImages.includes(currentImageIndex) ? (
                  <motion.div
                    key={`placeholder-${currentImageIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground text-center px-4 bg-secondary/40"
                  >
                    Ajoute une image ici:{" "}
                    <code>/public/onboarding/onboarding-{currentImageIndex + 1}.jpg</code>
                  </motion.div>
                ) : (
                  <motion.img
                    key={`bg-${currentImageIndex}`}
                    src={onboardingImages[currentImageIndex]}
                    alt={`Onboarding background ${currentImageIndex + 1}`}
                    onError={() =>
                      setMissingImages((prev) =>
                        prev.includes(currentImageIndex) ? prev : [...prev, currentImageIndex]
                      )
                    }
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/30 to-black/20" />

              <div className="relative z-10 h-full flex items-start justify-end p-5 md:p-7 lg:p-8">
                <div className="max-w-md bg-white/12 backdrop-blur-sm rounded-2xl py-4 px-4 md:py-5 md:px-5 shadow-[0_14px_40px_rgba(0,0,0,0.22)]">
                  <p
                    className="font-display leading-relaxed text-justify text-sm md:text-base lg:text-lg font-medium"
                    style={{ color: "#ffffff" }}
                  >
                    {t("onboarding.storyText")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            id="impact"
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.08 }}
            className="glass rounded-xl p-8 scroll-mt-28"
          >
            <div className="flex items-center justify-center gap-3 mb-6 text-center">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl font-bold">{t("onboarding.impactTitle")}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ImpactStat value={20} suffix="+" label={t("onboarding.stats.cohorts")} />
              <ImpactStat value={400} suffix="+" label={t("onboarding.stats.trained")} />
              <ImpactStat value={20} suffix="+" label={t("onboarding.stats.resources")} />
              <ImpactStat value={1} label={t("onboarding.stats.hub")} />
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-secondary/20 p-6 md:p-7">
              <h3 className="font-display text-xl font-semibold mb-2 text-center">
                {t("onboarding.testimonials.title")}
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {t("onboarding.testimonials.subtitle")}
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {testimonials.map((item, idx) => {
                  const isNamePlaceholder = item.name.startsWith("TO_ADD_");
                  const isVideoPlaceholder = item.videoUrl.startsWith("TO_ADD_");

                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-border/70 bg-background/60 p-4"
                    >
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-secondary/40 mb-3 flex items-center justify-center text-xs text-muted-foreground text-center px-2">
                        <img
                          src={item.photo}
                          alt={isNamePlaceholder ? t("onboarding.testimonials.photoPlaceholder") : item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const fallback = target.nextElementSibling as HTMLElement | null;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                        <div style={{ display: "none" }}>
                          {t("onboarding.testimonials.photoPlaceholder")}
                        </div>
                      </div>

                      <p className="font-medium text-foreground text-center mb-3">
                        {isNamePlaceholder ? t("onboarding.testimonials.namePlaceholder") : item.name}
                      </p>

                      {isVideoPlaceholder ? (
                        <div className="inline-flex w-full items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground text-sm">
                          <PlayCircle className="h-4 w-4" />
                          {t("onboarding.testimonials.videoPlaceholder")}
                        </div>
                      ) : (
                        <a
                          href={item.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition text-sm"
                        >
                          <PlayCircle className="h-4 w-4" />
                          {t("onboarding.testimonials.watchVideo")}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            id="donate"
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.16 }}
            className="glass rounded-xl p-8 scroll-mt-28"
          >
            <div className="flex items-center justify-center gap-3 mb-6 text-center">
              <HandCoins className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl font-bold">{t("onboarding.donateTitle")}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 text-justify">
              {t("onboarding.donateJustification")}
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => setDonateMethod("mobile")}
                className={`px-4 py-2 rounded-lg border transition ${
                  donateMethod === "mobile"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/30 border-border hover:bg-secondary/60"
                }`}
              >
                {t("onboarding.mobileMoneyButton")}
              </button>
              <button
                type="button"
                onClick={() => setDonateMethod("crypto")}
                className={`px-4 py-2 rounded-lg border transition ${
                  donateMethod === "crypto"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/30 border-border hover:bg-secondary/60"
                }`}
              >
                {t("onboarding.cryptoButton")}
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary/40 to-secondary/20 p-6 md:p-7 mb-5 shadow-sm">
              <h3 className="font-display text-xl font-semibold mb-2 text-center">
                {t("onboarding.ideaTitle")}
              </h3>
              <p className="text-muted-foreground mb-5 text-center leading-relaxed">
                {t("onboarding.ideaDesc")}
              </p>
              <div className="flex justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
                >
                  {t("onboarding.ideaCta")}
                </Link>
              </div>
            </div>

            {donateMethod === "mobile" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-secondary/30 p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-lg font-semibold">{t("onboarding.mobileNetworksTitle")}</h3>
                </div>
                <ul className="text-muted-foreground space-y-1">
                  <li>- {t("onboarding.mobile.orange")}</li>
                  <li>- {t("onboarding.mobile.airtel")}</li>
                  <li>- {t("onboarding.mobile.mpesa")}</li>
                </ul>
              </motion.div>
            )}

            {donateMethod === "crypto" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-secondary/30 p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-lg font-semibold">{t("onboarding.cryptoTitle")}</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  {t("onboarding.cryptoHow")}
                </p>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground opacity-80 cursor-not-allowed"
                  disabled
                >
                  {t("onboarding.donateButton")}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OnboardingProgram;

