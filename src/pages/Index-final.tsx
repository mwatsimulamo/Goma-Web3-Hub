import { useState, useEffect, useMemo } from "react";
import type { ElementType } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Users, Calendar, Rocket, Award, MapPin, Star, Zap, Globe } from "lucide-react";
import ModernButton from "@/components/ui/ModernButton";
import ModernCard from "@/components/ui/ModernCard";
import ModernSectionWrapper from "@/components/ui/ModernSectionWrapper";
import Container from "@/components/ui/Container";
import Ticker from "@/components/Ticker";
import EventRegistrationModal from "@/components/EventRegistrationModal";
import { useHeroAnimations } from "@/hooks/useHeroAnimations";
import { useCountUp } from "@/hooks/useCountUp";
import { mediaToUrl, strapiFetch } from "@/lib/strapi";
import '@/components/EventCard.css';

interface Event {
  id?: string;
  title: string;
  date: string;
  type: string;
  location: string;
  time: string;
  image: string;
  description: string;
  fullDescription: string;
}

interface HomeBlogPost {
  id: string;
  title: string;
  title_fr: string | null;
  excerpt: string | null;
  excerpt_fr: string | null;
  category: string;
  created_at: string;
}

interface HomeBlogPost {
  id: string;
  title: string;
  title_fr: string | null;
  excerpt: string | null;
  excerpt_fr: string | null;
  category: string;
  created_at: string;
}

const StatCard = ({
  stat,
  index,
}: {
  stat: { icon: ElementType; value: number; label: string; suffix: string };
  index: number;
}) => {
  const { count, elementRef } = useCountUp({
    end: stat.value,
    duration: 2500,
    startOnView: true,
  });

  const Icon = stat.icon;

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <ModernCard className="p-8 text-center">
        <Icon
          className={`h-10 w-10 mx-auto mb-4 ${
            index === 0
              ? "text-[#ffb800]"
              : index === 1
                ? "text-[#ffb800]"
                : index === 2
                  ? "text-[#ffb800]"
                  : "text-[#ffb800]"
          }`}
        />
        <div ref={elementRef} className="text-4xl font-bold mb-2 text-card-foreground">
          {count}
          {stat.suffix}
        </div>
        <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
      </ModernCard>
    </motion.div>
  );
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  // Les événements de la section "Événements à venir" sont pilotés par Strapi.
  // On garde une valeur de fallback pour éviter une page vide si l'API n'est pas joignable.
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { t, i18n } = useTranslation();
  const { heroRef, titleRef, buttonsRef, navigationRef } = useHeroAnimations(isLoading);

  const innovationSentenceWords = useMemo(
    () => t("home.innovationMission").split(/\s+/).filter(Boolean),
    [t, i18n.language]
  );

  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const stats = [
    { icon: Users, value: 500, label: "Membres Actifs", suffix: "+" },
    { icon: Calendar, value: 30, label: "Événements Organisés", suffix: "+" },
    { icon: Rocket, value: 15, label: "Projets Lancés", suffix: "+" },
    { icon: Award, value: 1000, label: "Bénéficiaires", suffix: "+" },
  ];

  const hardcodedUpcomingEvents: Event[] = [
    { 
      title: "Workshop Blockchain Fondamentaux", 
      date: "25 Mars 2026", 
      type: "Workshop", 
      location: "Goma Innovation Center",
      time: "14:00 - 18:00",
      image: "https://images.unsplash.com/photo-1639322533843-2b5a3b5b5b5?w=600&h=400&fit=crop",
      description: "Initiation aux concepts fondamentaux de la blockchain",
      fullDescription: "Plongez dans l'univers fascinant de la blockchain avec ce workshop intensif. Vous apprendrez les concepts de base, les mécanismes de consensus, la cryptographie, et comment cette technologie révolutionnaire transforme les industries. Session pratique avec démonstrations live et études de cas concrets applicables au contexte africain."
    },
    { 
      title: "Hackathon Web3 pour le Développement", 
      date: "10 Avril 2026", 
      type: "Hackathon", 
      location: "Virunga Tech Park",
      time: "09:00 - 20:00",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=400&fit=crop",
      description: "48h de développement intensif pour créer des solutions Web3",
      fullDescription: "Rejoignez-nous pour 48 heures de création intensive ! Formez des équipes, développez des solutions innovantes utilisant les technologies Web3, et présentez vos projets à un jury d'experts. Thème central : 'Technologie Blockchain pour le Développement Durable en RDC'. Prix exceptionnels et opportunités de financement pour les meilleurs projets."
    },
    { 
      title: "Meetup Crypto et Investissement", 
      date: "20 Avril 2026", 
      type: "Meetup", 
      location: "Goma Hub HQ",
      time: "17:00 - 19:00",
      image: "https://images.unsplash.com/photo-1611224923853-80b0237ed8b3?w=600&h=400&fit=crop",
      description: "Réseautage et discussions sur les opportunités d'investissement crypto",
      fullDescription: "Un meetup exclusif pour explorer les opportunités d'investissement dans les cryptomonnaies et projets blockchain. Échanges avec des investisseurs expérimentés, analyses de marché, et présentation de projets prometteurs. Session networking suivie d'un cocktail. Places limitées pour garantir des échanges de qualité."
    },
  ];

  useEffect(() => {
    setUpcomingEvents(hardcodedUpcomingEvents);

    const fetchUpcoming = async () => {
      try {
        type StrapiEventItem = {
          id: string | number;
          attributes?: {
            title?: string;
            title_fr?: string | null;
            date?: string;
            type?: string;
            location?: string;
            time?: string;
            image?: unknown;
            description?: string | null;
            description_fr?: string | null;
          };
        };

        const res = await strapiFetch<{ data: unknown[] }>(
          "/api/events?filters[upcoming][$eq]=true&sort=date:asc&populate=image&pagination[pageSize]=6"
        );
        const items = res.data || [];

        const formatDate = (d: string) => {
          try {
            const dt = new Date(d);
            return dt.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
          } catch {
            return d;
          }
        };

        const mapped: Event[] = items
          .map((item) => {
            const it = item as StrapiEventItem;
            return {
              id: String(it.id),
              title: it.attributes?.title_fr ?? it.attributes?.title ?? "",
              date: formatDate(it.attributes?.date ?? ""),
              type: it.attributes?.type ?? "",
              location: it.attributes?.location ?? "",
              time: it.attributes?.time ?? "",
              image: mediaToUrl(it.attributes?.image) ?? "",
              description: it.attributes?.description_fr ?? it.attributes?.description ?? "",
              fullDescription: it.attributes?.description_fr ?? it.attributes?.description ?? "",
            };
          })
          .filter((e) => e.id && e.title && e.date && e.type && e.location);

        if (mapped.length) setUpcomingEvents(mapped);
      } catch {
        // fallback déjà présent (hardcodedUpcomingEvents)
      }
    };

    fetchUpcoming();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  type HomeProject = { name: string; category: string; description: string };
  const hardcodedProjects: HomeProject[] = [
    { 
      name: "KivuPay", 
      category: "DeFi", 
      description: "Plateforme de paiement décentralisée pour la région des Grands Lacs"
    },
    { 
      name: "EduChain", 
      category: "Éducation", 
      description: "Système éducatif basé sur la blockchain pour les écoles congolaises"
    },
    { 
      name: "VolcanoDAO", 
      category: "Impact Social", 
      description: "Organisation autonome pour le développement durable autour du Virunga"
    },
  ];

  const [projectsList, setProjectsList] = useState<HomeProject[]>(hardcodedProjects);

  type HomePartner = { name: string; logo: string; url: string };
  const hardcodedPartners: HomePartner[] = [
    {
      name: "Apex Fusion",
      logo: "/partners/apex.png",
      url: "https://apexfusion.com/",
    },
    {
      name: "Wada",
      logo: "/partners/wada.jpg",
      url: "https://wada.org/",
    },
    {
      name: "Catalyst",
      logo: "/partners/Catalyst.jpg",
      url: "https://projectcatalyst.io/",
    },
    {
      name: "Ekival",
      logo: "/partners/Ekival.png",
      url: "https://ekival.com/",
    },
    {
      name: "ISDR-GL",
      logo: "/partners/partner1.png",
      url: "https://isdrgl.com",
    },
  ];

  const [partnersList, setPartnersList] = useState<HomePartner[]>(hardcodedPartners);

  const [latestBlogPosts, setLatestBlogPosts] = useState<HomeBlogPost[]>([]);
  const [blogPostsLoading, setBlogPostsLoading] = useState(true);

  const blogFallbackPosts = useMemo(
    () =>
      [
        { id: "1", title: t("blog.p1Title"), title_fr: null, excerpt: t("blog.p1Excerpt"), excerpt_fr: null, category: "Announcement", created_at: "2026-03-01" },
        { id: "2", title: t("blog.p2Title"), title_fr: null, excerpt: t("blog.p2Excerpt"), excerpt_fr: null, category: "Event Recap", created_at: "2026-02-20" },
        { id: "3", title: t("blog.p3Title"), title_fr: null, excerpt: t("blog.p3Excerpt"), excerpt_fr: null, category: "Education", created_at: "2026-02-10" },
        { id: "4", title: t("blog.p4Title"), title_fr: null, excerpt: t("blog.p4Excerpt"), excerpt_fr: null, category: "Innovation", created_at: "2026-01-28" },
        { id: "5", title: t("blog.p5Title"), title_fr: null, excerpt: t("blog.p5Excerpt"), excerpt_fr: null, category: "Community", created_at: "2026-01-15" },
        { id: "6", title: t("blog.p6Title"), title_fr: null, excerpt: t("blog.p6Excerpt"), excerpt_fr: null, category: "Education", created_at: "2026-01-05" },
      ] satisfies HomeBlogPost[],
    [t]
  );

  const displayHomeBlogPosts = useMemo(() => {
    if (latestBlogPosts.length > 0) return latestBlogPosts.slice(0, 3);
    return blogFallbackPosts.slice(0, 3);
  }, [latestBlogPosts, blogFallbackPosts]);

  useEffect(() => {
    const fetchLatestBlog = async () => {
      try {
        type StrapiBlogPostItem = {
          id: string | number;
          attributes?: {
            title?: string;
            title_fr?: string | null;
            excerpt?: string | null;
            excerpt_fr?: string | null;
            category?: string;
            createdAt?: string;
            created_at?: string;
          };
        };
        const res = await strapiFetch<{ data: unknown[] }>(
          "/api/blog-posts?filters[published][$eq]=true&sort=createdAt:desc&pagination[pageSize]=3"
        );
        const items = res.data || [];
        const mapped: HomeBlogPost[] = items
          .map((item) => {
            const it = item as StrapiBlogPostItem;
            return {
              id: String(it.id),
              title: it.attributes?.title ?? "",
              title_fr: it.attributes?.title_fr ?? null,
              excerpt: it.attributes?.excerpt ?? null,
              excerpt_fr: it.attributes?.excerpt_fr ?? null,
              category: it.attributes?.category ?? "",
              created_at: it.attributes?.createdAt ?? it.attributes?.created_at ?? "",
            };
          })
          .filter((p) => p.id && p.created_at);
        if (mapped.length) setLatestBlogPosts(mapped);
      } catch {
        // fallback: blogFallbackPosts
      } finally {
        setBlogPostsLoading(false);
      }
    };
    fetchLatestBlog();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await strapiFetch<{ data: unknown[] }>(
          "/api/projects?sort=createdAt:desc&pagination[pageSize]=100"
        );
        const items = res.data || [];
        const mapped: HomeProject[] = items
          .map((item) => {
            const it = item as { attributes?: Record<string, unknown>; id?: string | number };
            const attrs = (it.attributes ?? {}) as Record<string, unknown>;
            const name = String(attrs.name ?? "");
            const category = String(attrs.category ?? "");
            const description = String(attrs.description ?? "");
            if (!name || !category) return null;
            return { name, category, description };
          })
          .filter((p): p is HomeProject => p !== null);

        if (mapped.length) setProjectsList(mapped);
      } catch {
        // fallback: hardcodedProjects
      }
    };

    const fetchPartners = async () => {
      try {
        const res = await strapiFetch<{ data: unknown[] }>(
          "/api/partners?populate=logo&pagination[pageSize]=50"
        );
        const items = res.data || [];
        const mapped: HomePartner[] = items
          .map((item) => {
            const it = item as { attributes?: Record<string, unknown>; id?: string | number };
            const attrs = (it.attributes ?? {}) as Record<string, unknown>;
            const name = String(attrs.name ?? "");
            const url = String(attrs.url ?? "");
            const logoUrl = mediaToUrl(attrs.logo) ?? "";
            if (!name || !url || !logoUrl) return null;
            return { name, url, logo: logoUrl };
          })
          .filter((p): p is HomePartner => p !== null);

        if (mapped.length) setPartnersList(mapped);
      } catch {
        // fallback: hardcodedPartners
      }
    };

    fetchProjects();
    fetchPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero avec vidéo YouTube en arrière-plan */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20" ref={heroRef}>
        <div className="absolute inset-0">
          <iframe
            src="https://www.youtube.com/embed/3Lp9Zj2tSRo?autoplay=1&mute=1&loop=1&controls=0&playlist=3Lp9Zj2tSRo&showinfo=0&modestbranding=1&iv_load_policy=3&disablekb=1&rel=0&fs=0"
            className="absolute inset-0 w-full h-full"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100vw',
              height: '56.25vw',
              minHeight: '100vh',
              minWidth: '177.77vh',
              transform: 'translateX(-50%) translateY(-50%)',
              pointerEvents: 'none'
            }}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="UJUZI Labs Background Video"
            frameBorder="0"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-indigo-900/60" />
        </div>
        
        <Container className="relative z-10 text-center">
          <div className="hero-decoration inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium mb-8 bg-white/20 backdrop-blur-md border border-white/30">
            <Star className="h-4 w-4 text-blue-400" />
            <span className="text-blue-300">Innovation Web3 par UJUZI Labs</span>
          </div>
          
          <h1 
            ref={titleRef}
            className="text-4xl md:text-6xl lg:text-8xl font-bold leading-tight mb-6 text-white overflow-hidden"
          >
            <div>
              <span className="text-white">UJUZI </span>
              <span className="text-[#ffb800]">Labs</span>
            </div>
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed text-white/90">
            <div className="text-blue-300">Le centre d'innovation blockchain pour le développement de la RD Congo</div>
          </p>
          
          <div 
            ref={buttonsRef}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <ModernButton
              variant="primary"
              size="lg"
              href="/community"
              className="!bg-[#ffb800] !text-[#111111] shadow-none hover:shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[#ffb800]/60"
            >
              <Zap className="mr-2 h-5 w-5" />
              Rejoindre la communauté
              <ArrowRight className="ml-2 h-5 w-5" />
            </ModernButton>
            
            <ModernButton variant="outline" size="lg" href="/events" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              <Calendar className="mr-2 h-5 w-5" />
              Voir les événements
            </ModernButton>
          </div>
        </Container>
      </section>

      {/* Ticker */}
      <Ticker />

      {/* Stats */}
      <ModernSectionWrapper background="gray" className="py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <StatCard key={i} stat={stat} index={i} />
            ))}
          </div>
        </motion.div>
      </ModernSectionWrapper>

      {/* About */}
      <ModernSectionWrapper className="py-24">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-12 gap-10 items-center"
          >
            <div className="lg:col-span-5">
              <div className="relative max-w-[520px] mx-auto lg:mx-0">
                <div className="absolute -left-6 top-2 w-[78%] h-[88%] rounded-[34px] bg-[#e8f8f7]" />
                <div className="absolute -left-8 -bottom-8 grid grid-cols-5 gap-2 opacity-90 z-0 pointer-events-none">
                  {Array.from({ length: 35 }).map((_, idx) => (
                    <span key={idx} className="h-2 w-2 rounded-full bg-slate-500/80" />
                  ))}
                </div>

                <div className="relative z-10 rounded-[34px] overflow-hidden shadow-2xl w-[78%]">
                  <img
                    src="/onboarding/onboarding-2.jpg"
                    alt="Innovation technologique locale"
                    className="w-full h-[300px] md:h-[360px] object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="absolute z-20 right-3 top-3 h-[72px] w-[146px] rounded-2xl bg-gradient-to-br from-[#0f6be8] to-[#0a3f95] text-white shadow-xl inline-flex items-center gap-1 px-2">
                  <span className="text-[30px] leading-none font-extrabold">+5</span>
                  <span className="text-[9.5px] font-semibold leading-[1.06] uppercase tracking-wide opacity-95 text-right max-w-[78px]">
                    YEARS OF
                    <br />
                    EXISTENCE
                  </span>
                </div>

                <div className="absolute z-20 -right-6 bottom-8 w-[44%] h-[230px] rounded-[22px] overflow-hidden border-[8px] border-white shadow-xl bg-white">
                  <img
                    src="/onboarding/onboarding-4.jpg"
                    alt="Programme d'innovation UJUZI Labs"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 text-center">
              <div className="mb-6 rounded-2xl border border-border/70 bg-card/40 p-5 md:p-6">
                <p className="text-xl md:text-[1.75rem] font-bold text-foreground leading-relaxed text-center">
                  {innovationSentenceWords.map((word, index) => (
                    <motion.span
                      key={`${word}-${index}`}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.24, delay: index * 0.035 }}
                      className={`inline-block mr-2 ${index < 2 ? "text-[#ffb800]" : ""}`}
                    >
                      {word}
                    </motion.span>
                  ))}
                </p>
              </div>

              <ModernButton variant="primary" href="/about" className="!bg-[#ffb800] !text-[#111111] hover:brightness-105 mx-auto">
                <Globe className="mr-2 h-5 w-5" />
                {t("home.learnMore")}
              </ModernButton>
            </div>
          </motion.div>
        </Container>
      </ModernSectionWrapper>

      {/* Events */}
      <ModernSectionWrapper background="gray" className="py-24">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
              <div className="text-[#ffb800]">Événements à venir</div>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {upcomingEvents.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ModernCard className="overflow-hidden">
                  {/* Image d'aperçu de l'événement */}
                  <div className="event-image-container">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="event-image"
                    />
                    <div className={`event-type-badge ${
                      i === 0 ? 'bg-[#ffb800]' :
                      i === 1 ? 'bg-[#ffb800]' :
                      'bg-[#ffb800]'
                    }`}>
                      {event.type}
                    </div>
                  </div>
                  
                  <div className="event-content">
                    <h3 className="text-2xl font-bold mb-4 text-card-foreground">{event.title}</h3>
                    
                    {/* Description complète de l'événement */}
                    <div className="event-description">
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {event.fullDescription}
                      </p>
                    </div>
                    
                    {/* Informations pratiques */}
                    <div className="space-y-3 mb-6">
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-[#ffb800]" />
                        <span className="text-[#ffb800]">{event.date}</span>
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span className="text-card-foreground">{event.location}</span>
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Zap className="h-4 w-4 text-[#ffb800]" />
                        <span className="text-[#ffb800]">{event.time}</span>
                      </p>
                    </div>
                    
                    {/* Bouton d'inscription */}
                    <ModernButton 
                      variant="primary" 
                      className={`w-full ${
                        i === 0 ? 'bg-[#ffb800] hover:bg-[#e6a600]' :
                        i === 1 ? 'bg-[#ffb800] hover:bg-[#e6a600]' :
                        'bg-[#ffb800] hover:bg-[#e6a600]'
                      }`}
                      onClick={() => handleOpenModal(event)}
                    >
                      S'inscrire maintenant
                    </ModernButton>
                  </div>
                  </ModernCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
      </ModernSectionWrapper>

      {/* Projects */}
      <ModernSectionWrapper className="py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
            <div className="text-[#ffb800]">Projets Innovants</div>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {projectsList.map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <ModernCard className="p-8">
                  <div className={`inline-block px-4 py-2 rounded-full text-xs font-bold mb-4 ${
                    i === 0 ? 'bg-[#ffb800] text-[#111111]' :
                    i === 1 ? 'bg-[#ffb800] text-[#111111]' :
                    'bg-[#ffb800] text-[#111111]'
                  }`}>
                    {project.category}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-card-foreground">{project.name}</h3>
                  <p className="leading-relaxed text-muted-foreground">{project.description}</p>
                </ModernCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </ModernSectionWrapper>

      {/* Derniers articles blog */}
      <ModernSectionWrapper background="gray" className="py-24">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
              <span className="text-[#ffb800]">{t("home.latestBlogTitle")}</span>
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12 text-lg">
              {t("home.latestBlogSubtitle")}
            </p>

            {blogPostsLoading && latestBlogPosts.length === 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-64 rounded-xl bg-muted/50 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-3 gap-6">
                  {displayHomeBlogPosts.map((post, i) => {
                    const isFr = i18n.language.startsWith("fr");
                    const title = (isFr && post.title_fr ? post.title_fr : post.title) || "";
                    const excerpt = (isFr && post.excerpt_fr ? post.excerpt_fr : post.excerpt) || "";
                    const dateStr = post.created_at
                      ? new Date(post.created_at).toLocaleDateString(isFr ? "fr-FR" : "en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "";
                    return (
                      <motion.div
                        key={`${post.id}-${i}`}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                        viewport={{ once: true }}
                      >
                        <Link to={`/blog/${post.id}`} className="group block h-full">
                          <ModernCard className="h-full p-6 flex flex-col border-border/80 hover:border-[#ffb800]/40 transition-colors">
                            <span className="text-xs font-medium text-[#ffb800] bg-[#ffb800]/10 px-3 py-1 rounded-full self-start">
                              {post.category}
                            </span>
                            <h3 className="font-semibold text-lg mt-4 mb-2 text-card-foreground line-clamp-2 group-hover:text-[#ffb800] transition-colors">
                              {title}
                            </h3>
                            <p className="text-sm text-muted-foreground flex-1 line-clamp-3">{excerpt}</p>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/60">
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                {dateStr}
                              </span>
                              <span className="text-sm font-medium text-[#ffb800] flex items-center gap-1">
                                {t("blog.readMore")}
                                <ArrowRight className="h-4 w-4" />
                              </span>
                            </div>
                          </ModernCard>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="flex justify-center mt-12">
                  <ModernButton
                    variant="primary"
                    href="/blog"
                    size="lg"
                    className="!bg-[#ffb800] !text-[#111111] hover:brightness-105"
                  >
                    {t("home.viewAllBlog")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </ModernButton>
                </div>
              </>
            )}
          </motion.div>
        </Container>
      </ModernSectionWrapper>

      {/* Partenaires — même présentation que la page /partners */}
      <section className="bg-[#1734a8] py-14 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold mb-10 md:mb-12"
          >
            <span className="text-white">{t("partners.title")}</span>{" "}
            <span className="text-[#ffb800]">{t("partners.titleHighlight")}</span>
          </motion.h2>

          <div className="relative overflow-hidden py-6 md:py-8">
            <div className="flex w-max animate-scroll gap-5 md:gap-6 pr-5 md:pr-6">
              {[...partnersList, ...partnersList].map((partner, i) => (
                <div key={`${partner.name}-${i}`} className="flex-shrink-0">
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white rounded-2xl"
                    aria-label={partner.name}
                  >
                    <div className="bg-black rounded-2xl border border-white/15 p-4 md:p-5 h-[100px] w-[200px] md:h-[108px] md:w-[220px] flex items-center justify-center shadow-md shadow-black/10">
                      <img
                        src={partner.logo}
                        alt=""
                        className="max-h-[72px] w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal d'inscription aux événements */}
      <EventRegistrationModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
      />
    </div>
  );
};

export default Index;
