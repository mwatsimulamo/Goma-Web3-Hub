import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ExternalLink, Search } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const Projects = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  type ProjectShowcase = {
    slug: string;
    title: string;
    category: string;
    shortPresentation: string;
    imagePlaceholder: string;
    exploreUrl: string;
    external?: boolean;
  };

  const projectShowcases: ProjectShowcase[] = [
    {
      slug: "onboarding-program",
      title: "Onboarding Program",
      category: "Education",
      shortPresentation:
        "Programme d'integration progressive pour nouveaux membres de la communaute Web3 locale. Fake data: 12 cohorts, 680 participants, 74% de retention a 90 jours.",
      imagePlaceholder: "Image representative de Onboarding Program a inserer ici",
      exploreUrl: "/onboarding",
      external: false,
    },
    {
      slug: "genealogy",
      title: "Genealogy",
      category: "Social Impact",
      shortPresentation:
        "Plateforme pilote de gestion de genealogie communautaire sur registre decentralise. Fake data: 3 territoires couverts, 1 250 profils testes, 92% de coherence des liens familiaux.",
      imagePlaceholder: "Image representative de Genealogy a inserer ici",
      exploreUrl: "https://genealogie.io",
    },
    {
      slug: "mtidano-nftree",
      title: "Mtidano NFTree",
      category: "Environnement",
      shortPresentation:
        "Solution de tracabilite verte basee sur NFT pour suivre la plantation et la survie des arbres. Fake data: 8 sites suivis, 4 800 arbres tokenises, taux de survie de 87%.",
      imagePlaceholder: "Image representative de Mtidano NFTree a inserer ici",
      exploreUrl: "https://mtidano-nft.com",
    },
    {
      slug: "stakepool-goma",
      title: "Stakepool Goma",
      category: "Infrastructure",
      shortPresentation:
        "Infrastructure de validation locale orientee performance et disponibilite. Fake data: 99.8% uptime, 2 300 delegations test, 0 incident critique sur la periode pilote.",
      imagePlaceholder: "Image representative de Stakepool Goma a inserer ici",
      exploreUrl: "https://gomapool.com/",
    },
    {
      slug: "shiriki-drc",
      title: "Shiriki DRC",
      category: "Social Impact",
      shortPresentation:
        "Outil collaboratif pour coordonner des initiatives citoyennes et projets de quartier. Fake data: 45 initiatives en test, 620 participants actifs, 18 partenariats locaux.",
      imagePlaceholder: "Image representative de Shiriki DRC a inserer ici",
      exploreUrl: "https://example.com/shiriki-drc",
    },
    {
      slug: "wenze",
      title: "Wenze",
      category: "DeFi",
      shortPresentation:
        "Prototype marketplace pour connecter vendeurs locaux, services digitaux et paiements modernes. Fake data: 340 vendeurs onboardes, 2 900 commandes de test, panier moyen 14 USD.",
      imagePlaceholder: "Image representative de Wenze a inserer ici",
      exploreUrl: "https://wenze-beta.vercel.app",
    },
    {
      slug: "umoja-fund",
      title: "UmojaFund",
      category: "DeFi",
      shortPresentation:
        "Mecanisme communautaire de micro-financement transparent pour projets a impact. Fake data: 120 contributeurs pilotes, 28 dossiers finances, 76% de projets en execution.",
      imagePlaceholder: "Image representative de UmojaFund a inserer ici",
      exploreUrl: "https://umoja-fund.vercel.app",
    },
    {
      slug: "goma-hub-hackathon",
      title: "Goma Hub Hackathon",
      category: "AI + Blockchain",
      shortPresentation:
        "Programme de hackathon annuel du hub pour accelerer ideation, mentoring et demo day. Fake data: 9 semaines de cycle, 14 mentors, 30 equipes accompagnees.",
      imagePlaceholder: "Image representative de Goma Hub Hackathon a inserer ici",
      exploreUrl: "https://docs-topaz-tau-22.vercel.app/",
    },
  ];

  const categories = ["Tous", "DeFi", "Environnement", "Education", "Social Impact", "Infrastructure", "AI + Blockchain"];

  const normalizeText = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const filteredProjects = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery);
    const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

    return projectShowcases.filter((project) => {
      const categoryOk = activeCategory === "Tous" || project.category === activeCategory;
      if (!categoryOk) return false;
      if (!queryTokens.length) return true;

      const searchCorpus = normalizeText(
        `${project.title} ${project.category} ${project.shortPresentation}`
      );

      // "Recherche intelligente" simple: chaque mot saisi doit apparaitre
      return queryTokens.every((token) => searchCorpus.includes(token));
    });
  }, [activeCategory, searchQuery, projectShowcases]);

  return (
    <div>
      <section
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: "url('/projects/hero.PNG')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-[#ffb800]">
              Découvrez nos Projets
            </h1>
            <p className="text-white/90 max-w-2xl mx-auto text-lg font-bold">
              Des solutions Web3 innovantes, des projets environnementaux, hackathons et
              programmes d'education construits et incubes par UJUZI Labs.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-t border-border/60">
        <div className="container mx-auto px-4">
          <div className="mb-8 space-y-4 text-center">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="relative max-w-xl mx-auto">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher intelligemment (nom, categorie, mots-cles...)"
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="space-y-6">
            {filteredProjects.map((project, i) => (
              <motion.article
                key={project.slug}
                id={project.slug}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                className="glass rounded-2xl p-6 md:p-7"
              >
                <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
                  <div>
                    <span className="inline-flex text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full mb-3">
                      {project.category}
                    </span>
                    <h3 className="font-display text-2xl font-semibold mb-3">{project.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
                      {project.shortPresentation}
                    </p>
                    <a
                      href={project.exploreUrl}
                      target={project.external === false ? undefined : "_blank"}
                      rel={project.external === false ? undefined : "noopener noreferrer"}
                      className="inline-flex items-center text-primary font-medium hover:underline"
                    >
                      Explorer davantage
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </div>

                  <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 min-h-[170px] flex items-center justify-center p-4 text-center">
                    <span className="text-sm text-muted-foreground">{project.imagePlaceholder}</span>
                  </div>
                </div>
              </motion.article>
            ))}
            {filteredProjects.length === 0 && (
              <div className="glass rounded-xl p-6 text-center text-muted-foreground">
                Aucun projet ne correspond a votre recherche.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
