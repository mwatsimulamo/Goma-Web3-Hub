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
import { teamMembers } from "@/data/teamMembers";

const About = () => {
  const { t } = useTranslation();
  // Remplace ce chemin par ton image de fond About.
  const aboutHeroBackground = "/about/about.jpg";

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

  const team = teamMembers;
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
      <section
        className="about-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(8, 16, 30, 0.76) 0%, rgba(12, 24, 44, 0.82) 100%), url('${aboutHeroBackground}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="animate-fade-in-up"
          >
            <div className="hero-badge">
              <Star className="w-4 h-4" />
              <span>Centre d'Innovation Hybride</span>
            </div>

            <h1 className="hero-title">
              À Propos d'
              <span style={{ color: "var(--accent-orange)" }}>UJUZI Labs</span>
            </h1>

            <p className="hero-subtitle">
              Le centre d'innovation hybride pour le développement de la RD
              Congo, transformant le potentiel de la jeunesse en impact réel à
              travers la blockchain et l'agriculture durable.
            </p>

            <div className="hero-buttons">
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
