import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Users,
  Calendar,
  Send,
  Rocket,
  Award,
  Star,
  Zap,
  Globe,
  Heart,
  Linkedin,
  Twitter,
  GraduationCap,
  ServerCog,
  Code2,
  FileText,
  ClipboardList,
  Leaf,
} from "lucide-react";
import ModernButton from "@/components/ui/ModernButton";
import ModernCard from "@/components/ui/ModernCard";
import ModernSectionWrapper from "@/components/ui/ModernSectionWrapper";
import Container from "@/components/ui/Container";
import "@/styles/AboutDesign.css";
import { teamMembers, type TeamMember } from "@/data/teamMembers";
import { mediaToUrl, strapiFetch } from "@/lib/strapi";

const FALLBACK_ABOUT_HERO_BG = "/about/about.jpg";

function teamMembersWithValidImages(members: TeamMember[]): TeamMember[] {
  return members.filter(
    (m) =>
      Boolean(m.image?.trim()) &&
      !m.image.startsWith("TO_ADD_") &&
      !m.image.startsWith("http://TO_ADD")
  );
}

const About = () => {
  const { t } = useTranslation();

  const objectives = [
    {
      title: "Onboarding & Éducation Web3",
      description:
        "Initier et certifier au moins 500 jeunes par an aux technologies de la Blockchain et du Web3, en leur fournissant les compétences techniques nécessaires.",
      icon: "",
    },
    {
      title: "Innovation Environnementale",
      description:
        "Digitaliser la reforestation à travers le projet Mtidano, en utilisant les NFTs pour tracer, financer et garantir la survie d'arbres plantés.",
      icon: "",
    },
    {
      title: "Pionnier du Développement Durable",
      description:
        "Développer des fermes pilotes utilisant des méthodes d'agriculture durable et maraîchère pour accroître la production locale.",
      icon: "",
    },
    {
      title: "Infrastructure & Décentralisation",
      description:
        "Opérer des nœuds validateurs robustes sur les réseaux Cardano, Apex Fusion et Safrochain pour la gouvernance blockchain.",
      icon: "",
    },
  ];

  const [team, setTeam] = useState<TeamMember[]>(teamMembers);

  const heroTeamMembers = useMemo(() => teamMembersWithValidImages(team), [team]);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  useEffect(() => {
    setHeroSlideIndex(0);
  }, [heroTeamMembers.length]);

  useEffect(() => {
    if (heroTeamMembers.length < 2) return;
    const id = window.setInterval(() => {
      setHeroSlideIndex((i) => (i + 1) % heroTeamMembers.length);
    }, 6000);
    return () => clearInterval(id);
  }, [heroTeamMembers.length]);

  const heroCount = heroTeamMembers.length;
  const heroBgUrl =
    heroCount > 0
      ? heroTeamMembers[heroSlideIndex % heroCount].image
      : FALLBACK_ABOUT_HERO_BG;
  const heroLeft = heroCount > 0 ? heroTeamMembers[heroSlideIndex % heroCount] : null;
  const heroRight =
    heroCount > 1
      ? heroTeamMembers[(heroSlideIndex + 1) % heroCount]
      : heroCount === 1
        ? heroTeamMembers[0]
        : null;

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await strapiFetch<{ data: unknown[] }>(
          "/api/team-members?populate=image&pagination[pageSize]=100"
        );
        const items = res.data || [];

        const mapped: TeamMember[] = items
          .map((item) => {
            const it = item as { id?: string | number; attributes?: Record<string, unknown> };
            const attrs = (it.attributes ?? {}) as Record<string, unknown>;
            const imageUrl = mediaToUrl(attrs.image) ?? "";

            return {
              name: String(attrs.name ?? ""),
              role: String(attrs.role ?? ""),
              image: imageUrl,
              social: {
                x: String(attrs.social_x ?? attrs.x ?? ""),
                telegram: String(attrs.social_telegram ?? attrs.telegram ?? ""),
                linkedin: String(attrs.social_linkedin ?? attrs.linkedin ?? ""),
              },
            } satisfies TeamMember;
          })
          .filter((m) => m.name && m.role);

        if (mapped.length) setTeam(mapped);
      } catch {
        // fallback: teamMembers local
      }
    };

    fetchTeam();
  }, []);
  const interventionDomains = [
    {
      title: "Education",
      description:
        "Programmes d'apprentissage, coaching et accompagnement pour développer les competences pratiques des jeunes et professionnels.",
      icon: <GraduationCap className="w-8 h-8" />,
      color: "#ff6b35",
    },
    {
      title: "Nouvelles Technologies",
      description:
        "Blockchain, Web3, developpement logiciel et solutions numeriques pour accelerer l'innovation locale et regionale.",
      icon: <Code2 className="w-8 h-8" />,
      color: "#60a5fa",
    },
    {
      title: "Environnement",
      description:
        "Actions technologiques et communautaires en faveur de la durabilite, de l'agriculture responsable et de la resilience ecologique.",
      icon: <Leaf className="w-8 h-8" />,
      color: "#34d399",
    },
  ];

  const services = [
    {
      title: "Formation sur les nouvelles technologies",
      description:
        "Programmes pratiques et sessions intensives sur Web3, blockchain, outils numériques, IA et compétences digitales adaptées aux besoins locaux.",
      icon: <GraduationCap className="w-8 h-8" />,
      color: "#ff6b35",
    },
    {
      title: "Opérateur de stake pools",
      description:
        "Exploitation et maintenance de nœuds validateurs et stake pools avec supervision continue, bonnes pratiques de sécurité et performance réseau.",
      icon: <ServerCog className="w-8 h-8" />,
      color: "#f39c12",
    },
    {
      title: "Développement d'applications, sites web et smart contracts",
      description:
        "Conception de solutions digitales complètes : applications web, plateformes métiers, intégration blockchain et développement de contrats intelligents.",
      icon: <Code2 className="w-8 h-8" />,
      color: "#22c55e",
    },
    {
      title: "Services de secrétariat",
      description:
        "Services professionnels de bureau : impressions, saisie, scan, photocopie de documents, mise en page, préparation de dossiers et archivage.",
      icon: <FileText className="w-8 h-8" />,
      color: "#60a5fa",
    },
    {
      title: "Conception et planification des projets",
      description:
        "Accompagnement stratégique pour transformer une idée en projet exécutable : cadrage, planification, budget, feuille de route et suivi d'impact.",
      icon: <ClipboardList className="w-8 h-8" />,
      color: "#a78bfa",
    },
    {
      title: "Innovation verte et agriculture durable",
      description:
        "Intégration de solutions technologiques au service de l'agriculture durable pour renforcer la productivité locale et la résilience communautaire.",
      icon: <Leaf className="w-8 h-8" />,
      color: "#34d399",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--dark-bg)" }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/70 via-slate-950/60 to-transparent" />
          <div
            key={heroBgUrl}
            className="absolute inset-0 opacity-20 bg-cover bg-center transition-opacity duration-700"
            style={{
              backgroundImage: `url('${heroBgUrl}')`,
            }}
          />
        </div>

        <Container size="lg" className="relative">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left: text */}
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-100">
                  <Star className="h-4 w-4 text-blue-300" />
                  <span>Centre d'Innovation Hybride</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                  À propos de <span className="text-blue-400">UJUZI Labs</span>
                </h1>

                <p className="text-base md:text-lg leading-relaxed text-blue-50/90 max-w-xl">
                  UJUZI Labs est un centre d'innovation engagé dans l'éducation et l'incubation des
                  talents en Afrique Centrale. Notre approche conjugue rigueur académique et
                  expérimentation terrain pour former des builders capables de concevoir, déployer et
                  améliorer des solutions Web3 responsables. En reliant la blockchain à des pratiques
                  durables, nous transformons le potentiel de la jeunesse en résultats mesurables :
                  apprentissage structuré, projets incubés et impact concret au bénéfice des communautés.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a href="/community" className="btn-primary">
                    <Zap className="w-5 h-5" />
                    Rejoindre la communauté
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <a href="/events" className="btn-secondary">
                    <Calendar className="w-5 h-5" />
                    Voir les événements
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Right: overlapping portraits */}
            <div className="lg:col-span-6 flex justify-end">
              <div className="relative w-full max-w-xl h-[520px]">
                <motion.div
                  initial={{ opacity: 0, x: 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="absolute -left-6 top-0 w-[270px] h-[510px] rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl"
                >
                  <img
                    src={heroLeft?.image ?? FALLBACK_ABOUT_HERO_BG}
                    alt={heroLeft ? `Portrait — ${heroLeft.name}` : "Équipe UJUZI Labs"}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.05 }}
                  className="absolute -right-4 top-24 w-[260px] h-[360px] rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl"
                >
                  <img
                    src={heroRight?.image ?? FALLBACK_ABOUT_HERO_BG}
                    alt={heroRight ? `Portrait — ${heroRight.name}` : "Équipe UJUZI Labs"}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </motion.div>

                <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-blue-500/15 blur-2xl" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="about-section">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">
              Notre{" "}
              <span style={{ color: "var(--accent-orange)" }}>Mission</span>
            </h2>
            <p className="section-subtitle">
              Transformer le potentiel de la jeunesse de Goma en impact réel par
              l'innovation hybride. Nous nous donnons pour mission d'éduquer,
              d'accompagner et d'outiller les talents locaux aux technologies de
              la{" "}
              <span style={{ color: "var(--accent-orange)" }}>Blockchain</span>{" "}
              et aux pratiques de l'
              <span style={{ color: "var(--accent-orange)" }}>
                agriculture durable
              </span>
              .
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="content-card"
          >
            <h3
              style={{
                fontSize: "28px",
                fontWeight: "600",
                color: "var(--light-primary)",
                marginBottom: "20px",
                fontFamily: "var(--font-heading)",
              }}
            >
              Notre{" "}
              <span style={{ color: "var(--accent-orange)" }}>Vision</span>
            </h3>
            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.7",
                color: "var(--light-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Faire de la RDC le premier épicentre africain de la{" "}
              <span style={{ color: "var(--accent-orange)" }}>
                "Blockchain for Good"
              </span>
              . Nous aspirons à un avenir où la technologie Web3 n'est plus une
              abstraction, mais un levier puissant pour régénérer nos
              écosystèmes (via{" "}
              <span style={{ color: "var(--accent-orange)" }}>
                Mtidano NFTree
              </span>
              ) et sécuriser notre souveraineté alimentaire. Nous voyons Goma
              Hub comme le moteur d'une économie décentralisée, verte et
              prospère en Afrique Centrale.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Objectives Section */}
      <section className="about-section">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">
              Objectif{" "}
              <span style={{ color: "var(--accent-orange)" }}>Principal</span>
            </h2>
            <p className="section-subtitle">
              Propulser la RDC comme le premier pôle d'innovation hybride en
              Afrique Centrale, en formant une nouvelle génération de leaders
              capables de transformer l'économie numérique (Web3/Blockchain) et
              la résilience écologique (Agriculture Durable).
            </p>
          </motion.div>

          <div className="objectives-grid">
            {objectives.map((objective, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * i }}
                viewport={{ once: true }}
                className="objective-card"
              >
                <div className="objective-icon">{objective.icon}</div>
                <h4 className="objective-title">{objective.title}</h4>
                <p className="objective-description">{objective.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Intervention Domains Section */}
      <section className="about-section-light">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">
              Nos domaines d'
              <span style={{ color: "var(--accent-orange)" }}>Interventions</span>
            </h2>
            <p className="section-subtitle">
              Trois axes prioritaires qui concentrent notre action et notre impact.
            </p>
          </motion.div>

          <div className="values-grid">
            {interventionDomains.map((domain, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * i }}
                viewport={{ once: true }}
                className="value-card"
              >
                <span className="value-icon" style={{ color: domain.color }}>
                  {domain.icon}
                </span>
                <h3 className="value-title">{domain.title}</h3>
                <p className="value-description">{domain.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <section className="about-section-light" id="services">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">
              Nos <span style={{ color: "var(--accent-orange)" }}>Services</span>
            </h2>
            <p className="section-subtitle">
              Des services concrets, pensés pour les jeunes, les porteurs de projets,
              les institutions et les entrepreneurs qui veulent créer un impact réel.
            </p>
          </motion.div>

          <div className="values-grid">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.08 * i }}
                viewport={{ once: true }}
                className="value-card"
              >
                <span className="value-icon" style={{ color: service.color }}>
                  {service.icon}
                </span>
                <h3 className="value-title">{service.title}</h3>
                <p className="value-description">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team Section */}
      <section className="team-section" id="team">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">
              Notre{" "}
              <span style={{ color: "var(--accent-orange)" }}>Équipe</span>
            </h2>
            <p className="section-subtitle">
              Meet Stake Pool Managers
            </p>
          </motion.div>

          <div className="team-grid">
            {team.map((member, i) => {
              const hasX = member.social.x.startsWith("http");
              const hasTelegram = member.social.telegram.startsWith("http");
              const hasLinkedIn = member.social.linkedin.startsWith("http");
              const hasAnySocial = hasX || hasTelegram || hasLinkedIn;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.08 * i },
                    y: { duration: 0.6, delay: 0.08 * i },
                  }}
                  viewport={{ once: true }}
                  className="team-card"
                >
                  <div className="team-media">
                    <div className="team-avatar">
                      {member.image && !member.image.startsWith("TO_ADD_") ? (
                        <img src={member.image} alt={member.name} loading="lazy" />
                      ) : (
                        <div className="team-avatar-placeholder">
                          <Users
                            className="w-10 h-10"
                            style={{ color: "var(--accent-orange)" }}
                          />
                        </div>
                      )}
                    </div>

                    {hasAnySocial && (
                      <div className="team-overlay-socials">
                        {hasX && (
                          <a
                            href={member.social.x}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="team-social-link"
                            aria-label={`Compte X de ${member.name}`}
                          >
                            <Twitter className="w-4 h-4" />
                          </a>
                        )}
                        {hasLinkedIn && (
                          <a
                            href={member.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="team-social-link"
                            aria-label={`Compte LinkedIn de ${member.name}`}
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {hasTelegram && (
                          <a
                            href={member.social.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="team-social-link"
                            aria-label={`Compte Telegram de ${member.name}`}
                          >
                            <Send className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="team-meta">
                    <h3 className="team-name">{member.name}</h3>
                    <p className="team-role">{member.role}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="about-section-light">
        <Container size="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="content-card text-center"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-orange), var(--accent-red))",
              border: "none",
            }}
          >
            <h3
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "var(--light-primary)",
                marginBottom: "16px",
                fontFamily: "var(--font-heading)",
              }}
            >
              Rejoignez Notre Mission
            </h3>
            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.6",
                color: "rgba(255, 255, 255, 0.9)",
                marginBottom: "32px",
                fontFamily: "var(--font-body)",
                maxWidth: "600px",
                margin: "0 auto 32px",
              }}
            >
              Ensemble, transformons la RD Congo en un pôle d'innovation
              blockchain et de développement durable. Votre contribution fait la
              différence.
            </p>
            <div
              style={{
                display: "flex",
                gap: "24px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="/contact"
                className="btn-primary"
                style={{
                  background: "var(--light-primary)",
                  color: "var(--accent-orange)",
                }}
              >
                <Heart className="w-5 h-5" />
                Nous Contacter
              </a>
              <a
                href="/community"
                className="btn-secondary"
                style={{
                  borderColor: "var(--light-primary)",
                  color: "var(--light-primary)",
                }}
              >
                <Users className="w-5 h-5" />
                Rejoindre la communauté
              </a>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default About;
