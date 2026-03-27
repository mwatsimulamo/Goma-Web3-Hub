import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { strapiFetch } from "@/lib/strapi";
import {
  ArrowLeft,
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
  const [mobileNetwork, setMobileNetwork] = useState<"orange" | "airtel" | "mpesa">("orange");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [donateError, setDonateError] = useState("");
  const [donateSuccess, setDonateSuccess] = useState("");
  const [isSubmittingDonation, setIsSubmittingDonation] = useState(false);
  const [cryptoConfirmed, setCryptoConfirmed] = useState(false);

  const cardanoWalletAddress =
    "addr1qx9nr0z089h9pp8q6g4mr9zvjygp6s3rh03v2e05reyk7zlucfqrm58pch6tnppvp8yw58t6s9n0sxeeq5avqhdw6x5qn4vyzg";

  const handleFlutterwaveDonate = () => {
    setDonateError("");
    setDonateSuccess("");
    const amount = Number(donationAmount);
    if (!donorName.trim() || !donorEmail.trim() || !donorPhone.trim()) {
      setDonateError("Veuillez renseigner nom, email et téléphone.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setDonateError("Veuillez saisir un montant valide.");
      return;
    }

    const flwPubKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY as string | undefined;
    if (!flwPubKey) {
      setDonateError("Clé Flutterwave manquante (VITE_FLUTTERWAVE_PUBLIC_KEY).");
      return;
    }

    const checkout = (window as Window & { FlutterwaveCheckout?: (options: Record<string, unknown>) => void })
      .FlutterwaveCheckout;

    if (!checkout) {
      setDonateError("Flutterwave n'est pas chargé. Vérifiez votre connexion puis réessayez.");
      return;
    }

    const txRef = `ujuzi-donate-${Date.now()}`;
    checkout({
      public_key: flwPubKey,
      tx_ref: txRef,
      amount,
      currency: "USD",
      payment_options: "mobilemoney",
      customer: {
        email: donorEmail.trim(),
        phonenumber: donorPhone.trim(),
        name: donorName.trim(),
      },
      customizations: {
        title: "UJUZI Labs Donation",
        description: `Donation via ${mobileNetwork.toUpperCase()}`,
        logo: `${window.location.origin}/favicon.ico`,
      },
      meta: {
        mobile_network: mobileNetwork,
        donation_context: "onboarding_program",
      },
      callback: async (response: unknown) => {
        try {
          const r = (response ?? {}) as { transaction_id?: string | number; tx_ref?: string };
          if (!r.transaction_id && !r.tx_ref) {
            setDonateError("Réponse Flutterwave incomplète. Vérification impossible.");
            return;
          }
          setIsSubmittingDonation(true);
          const verify = await strapiFetch<{ ok?: boolean; status?: string }>("/api/donations/verify-flutterwave", {
            method: "POST",
            body: JSON.stringify({
              transaction_id: r.transaction_id,
              tx_ref: r.tx_ref,
              payer: {
                name: donorName.trim(),
                email: donorEmail.trim(),
                phone: donorPhone.trim(),
              },
            }),
          });
          if (verify.ok && verify.status === "confirmed") {
            setDonateSuccess("Paiement confirmé. Merci pour votre contribution.");
            setDonateError("");
          } else if (verify.ok) {
            setDonateSuccess("Paiement reçu et en cours de validation.");
          } else {
            setDonateError("Paiement initié, mais la vérification a échoué.");
          }
        } catch {
          setDonateError("Paiement initié, mais erreur lors de la vérification serveur.");
        } finally {
          setIsSubmittingDonation(false);
        }
      },
      onclose: () => {
        // no-op
      },
    });
  };

  const copyWalletAddress = async () => {
    try {
      await navigator.clipboard.writeText(cardanoWalletAddress);
      setDonateError("");
    } catch {
      setDonateError("Copie impossible automatiquement. Veuillez copier l'adresse manuellement.");
    }
  };

  const handleCryptoIntent = async () => {
    setDonateError("");
    setDonateSuccess("");
    try {
      setIsSubmittingDonation(true);
      const amount = Number(donationAmount || "0");
      const res = await strapiFetch<{ ok?: boolean }>("/api/donations/crypto-intent", {
        method: "POST",
        body: JSON.stringify({
          donor_name: donorName.trim(),
          donor_email: donorEmail.trim(),
          donor_phone: donorPhone.trim(),
          amount: Number.isFinite(amount) ? amount : 0,
          currency: "ADA",
          wallet_address: cardanoWalletAddress,
          note: "User clicked 'J'ai effectué le don' from onboarding page",
        }),
      });
      if (res.ok) {
        setCryptoConfirmed(true);
        setDonateSuccess("Merci. Votre don crypto a été enregistré pour vérification manuelle.");
      } else {
        setDonateError("Impossible d'enregistrer votre don crypto pour le moment.");
      }
    } catch {
      setDonateError("Erreur serveur lors de l'enregistrement du don crypto.");
    } finally {
      setIsSubmittingDonation(false);
    }
  };
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
      name: "Martin MUSAGARA.",
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

  useEffect(() => {
    const scriptId = "flutterwave-checkout-script";
    if (document.getElementById(scriptId)) return;
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-start mb-6">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/70 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/70 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux projets
            </Link>
          </div>
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
            className="scroll-mt-28"
          >
            <div className="flex items-center justify-center gap-3 mb-6 text-center">
              <HeartHandshake className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl font-bold">{t("onboarding.whatTitle")}</h2>
            </div>
            <div
              className="min-h-[520px] lg:min-h-[620px]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="grid h-full grid-cols-1 lg:grid-cols-2 lg:gap-4">
                {/* Image (gauche) */}
                <div className="relative min-h-[360px] lg:min-h-0 overflow-hidden rounded-2xl border border-border">
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

                  {/* Légère ombre pour la lisibilité côté gauche */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
                </div>

                {/* Texte (droite) */}
                <div className="flex items-center justify-end p-5 md:p-6 lg:p-4">
                  <div className="max-w-md py-1 px-1 md:py-2 md:px-2">
                    <h3 className="font-display text-xl md:text-2xl font-bold mb-3 text-left text-foreground">
                      Web3 Onboarding Program
                    </h3>
                    <p
                      className="font-display leading-relaxed text-justify text-sm md:text-base lg:text-lg font-medium text-foreground"
                    >
                      Since 2023, Ujuzi Labs identified a strong need for Web3 education, especially around the Cardano blockchain.
                      This led us to launch this program, through which at the end of each month we mobilize our limited resources and
                      recruit young entrepreneurs, students, and technology enthusiasts to provide a one-week training on topics such as Web3,
                      distributed ledger technology, blockchain, Cardano wallets, and other practical foundations for their journey.
                    </p>
                  </div>
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

            {donateMethod === "mobile" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                className="glass rounded-xl p-6 md:p-7 border border-border/70 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-lg font-semibold text-foreground">{t("onboarding.mobileNetworksTitle")}</h3>
                </div>
                <p className="text-sm text-foreground/80 mb-5">
                  Remplissez les informations ci-dessous pour finaliser votre don via Mobile Money.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-foreground/90 block mb-1.5">Réseau Mobile Money</label>
                    <select
                      value={mobileNetwork}
                      onChange={(e) => setMobileNetwork(e.target.value as "orange" | "airtel" | "mpesa")}
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                    >
                      <option value="orange">{t("onboarding.mobile.orange")}</option>
                      <option value="airtel">{t("onboarding.mobile.airtel")}</option>
                      <option value="mpesa">{t("onboarding.mobile.mpesa")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-foreground/90 block mb-1.5">Montant (USD)</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="Ex: 10"
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-border text-foreground placeholder:text-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-foreground/90 block mb-1.5">Nom complet</label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Votre nom"
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-border text-foreground placeholder:text-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-foreground/90 block mb-1.5">Email</label>
                    <input
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="vous@email.com"
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-border text-foreground placeholder:text-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-foreground/90 block mb-1.5">Téléphone</label>
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="+243..."
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-border text-foreground placeholder:text-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleFlutterwaveDonate}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isSubmittingDonation}
                  >
                    {isSubmittingDonation ? "Traitement..." : "Continuer le don via Flutterwave"}
                  </button>
                </div>
              </motion.div>
            )}

            {donateMethod === "crypto" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                className="glass rounded-xl p-6 md:p-7 border border-border/70 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-lg font-semibold text-foreground">{t("onboarding.cryptoTitle")}</h3>
                </div>
                <p className="text-foreground/80 mb-5">
                  {t("onboarding.cryptoHow")}
                </p>
                <div className="rounded-lg border border-border bg-background/80 p-4 mb-4">
                  <p className="text-xs text-foreground/70 mb-1">Adresse wallet Cardano</p>
                  <p className="text-sm text-foreground break-all">{cardanoWalletAddress}</p>
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    type="button"
                    onClick={copyWalletAddress}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-border bg-background/80 text-foreground hover:bg-secondary/70 transition-all duration-200"
                  >
                    Copier l'adresse
                  </button>
                  <a
                    href={`https://cardanoscan.io/address/${cardanoWalletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-border bg-background/80 text-foreground hover:bg-secondary/70 transition-all duration-200"
                  >
                    Voir sur Cardanoscan
                  </a>
                </div>
                <button
                  type="button"
                  onClick={handleCryptoIntent}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isSubmittingDonation}
                >
                  {isSubmittingDonation ? "Traitement..." : "J'ai effectué le don"}
                </button>
                {cryptoConfirmed && (
                  <p className="text-sm text-primary mt-3">
                    Merci pour votre contribution. Notre équipe vérifiera la transaction on-chain.
                  </p>
                )}
              </motion.div>
            )}
            {donateSuccess && (
              <p className="text-sm text-primary mt-3 text-center">{donateSuccess}</p>
            )}
            {donateError && (
              <p className="text-sm text-destructive mt-3 text-center">{donateError}</p>
            )}

            <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary/40 to-secondary/20 p-6 md:p-7 mt-6 shadow-sm">
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
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OnboardingProgram;

