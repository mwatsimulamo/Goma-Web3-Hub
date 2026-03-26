import { useEffect, useState, type ElementType } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BookOpen, Video, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mediaToUrl, mediaArrayToUrls, strapiFetch } from "@/lib/strapi";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const iconMap: Record<string, ElementType> = {
  bookOpen: BookOpen,
  bookopen: BookOpen,
  video: Video,
  fileText: FileText,
  filetext: FileText,
  file: FileText,
};

const Resources = () => {
  const { t } = useTranslation();

  type ResourceItem = { title: string; desc: string };
  type ResourceSection = { icon: ElementType; category: string; items: ResourceItem[] };

  const hardcodedSections: ResourceSection[] = [
    {
      icon: BookOpen,
      category: t("resources.cat1"),
      items: [
        { title: t("resources.r1Title"), desc: t("resources.r1Desc") },
        { title: t("resources.r2Title"), desc: t("resources.r2Desc") },
        { title: t("resources.r3Title"), desc: t("resources.r3Desc") },
      ],
    },
    {
      icon: Video,
      category: t("resources.cat2"),
      items: [
        { title: t("resources.r4Title"), desc: t("resources.r4Desc") },
        { title: t("resources.r5Title"), desc: t("resources.r5Desc") },
        { title: t("resources.r6Title"), desc: t("resources.r6Desc") },
      ],
    },
    {
      icon: FileText,
      category: t("resources.cat3"),
      items: [
        { title: t("resources.r7Title"), desc: t("resources.r7Desc") },
        { title: t("resources.r8Title"), desc: t("resources.r8Desc") },
        { title: t("resources.r9Title"), desc: t("resources.r9Desc") },
      ],
    },
  ];

  const [sections, setSections] = useState<ResourceSection[]>(hardcodedSections);

  type GalleryImage = { alt: string; imageUrl: string };
  type GalleryEvent = {
    title: string;
    subtitle: string;
    date: string;
    description: string;
    images: GalleryImage[];
  };

  const hardcodedGalleryEvents: GalleryEvent[] = [
    {
      title: "Cardano Summit 2022",
      subtitle: "Blockchain and its opportunities for Africa",
      date: "30 July 2026",
      description:
        "À UJUZI Labs Web3, nous avons rassemblé des builders, étudiants et entrepreneurs pour explorer l’écosystème Cardano et les opportunités concrètes du Web3 en Afrique. Entre échanges avec des experts, partages d’expériences et démonstrations, cette rencontre a surtout mis l’accent sur l’apprentissage, la collaboration et le passage à l’action autour de projets locaux.",
      images: Array.from({ length: 6 }).map((_, i) => ({
        alt: `Wada Burkina Faso Hub — photo ${i + 1}`,
        imageUrl: `https://via.placeholder.com/900x650?text=Event+1+Photo+${i + 1}`,
      })),
    },
    {
      title: "Cardano Africa Tech Summit",
      subtitle: "Inauguration of Wada Burkina Faso Hub",
      date: "2026",
      description:
        "Cette édition a mis en lumière la vision de UJUZI Labs Web3 : bâtir un centre d’excellence où les talents apprennent, expérimentent et développent des solutions blockchain utiles à notre région. Au programme : panels, networking, ateliers pratiques et mise en relation avec des mentors pour accélérer l’incubation des projets portés par la communauté.",
      images: Array.from({ length: 6 }).map((_, i) => ({
        alt: `Inauguration — photo ${i + 1}`,
        imageUrl: `https://via.placeholder.com/900x650?text=Event+2+Photo+${i + 1}`,
      })),
    },
  ];

  const [galleryEvents, setGalleryEvents] = useState<GalleryEvent[]>(hardcodedGalleryEvents);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await strapiFetch<{ data: unknown[] }>(
          "/api/gallery-events?populate[images]=*&pagination[pageSize]=20"
        );
        const items = res.data || [];
        const mapped: GalleryEvent[] = items
          .map((item) => {
            const it = item as { attributes?: Record<string, unknown> };
            const attrs = (it.attributes ?? {}) as Record<string, unknown>;
            const title = String(attrs.title ?? "");
            if (!title) return null;

            const subtitle = String(attrs.subtitle ?? "");
            const date = String(attrs.date ?? "");
            const description = String(attrs.description ?? "");

            const urls = mediaArrayToUrls(attrs.images);
            const images: GalleryImage[] = urls.map((u, i) => ({
              alt: `${title} - photo ${i + 1}`,
              imageUrl: u,
            }));

            return { title, subtitle, date, description, images };
          })
          .filter((e): e is GalleryEvent => e !== null && e.images.length > 0);

        if (mapped.length) setGalleryEvents(mapped);
      } catch {
        // fallback already set
      }
    };

    fetchGallery();
  }, []);

  useEffect(() => {
    const fetchResourceSections = async () => {
      try {
        const res = await strapiFetch<{ data: unknown[] }>(
          "/api/resource-sections?populate=items&pagination[pageSize]=50"
        );
        const items = res.data || [];

        const mapped: ResourceSection[] = items
          .map((item) => {
            const it = item as { attributes?: Record<string, unknown> };
            const attrs = (it.attributes ?? {}) as Record<string, unknown>;

            const iconKey = String(attrs.iconKey ?? attrs.icon ?? "");
            const Icon = iconMap[iconKey] ?? BookOpen;

            const category = String(attrs.category_fr ?? attrs.category ?? "");
            if (!category) return null;

            const rel = attrs.items as unknown;
            const relItems = (rel as { data?: unknown[] } | undefined)?.data;
            const rawItems = Array.isArray(relItems) ? relItems : [];

            const mappedItems: ResourceItem[] = rawItems
              .map((r) => {
                const rit = r as { attributes?: Record<string, unknown> };
                const rattrs = (rit.attributes ?? {}) as Record<string, unknown>;
                const title = String(rattrs.title_fr ?? rattrs.title ?? "");
                const desc =
                  String(rattrs.description_fr ?? rattrs.desc_fr ?? rattrs.description ?? rattrs.desc ?? "");
                if (!title && !desc) return null;
                return { title, desc };
              })
              .filter((x): x is ResourceItem => x !== null && x.title.length > 0);

            if (!mappedItems.length) return null;
            return { icon: Icon, category, items: mappedItems };
          })
          .filter((s): s is ResourceSection => s !== null);

        if (mapped.length) setSections(mapped);
      } catch {
        // fallback: hardcodedSections
      }
    };

    fetchResourceSections();
  }, []);

  return (
    <div>
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4"><span className="gradient-text">{t("resources.title")}</span></h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{t("resources.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 space-y-16">
          {sections.map((section, si) => (
            <div key={si}>
              <div className="flex items-center gap-3 mb-8">
                <section.icon className="h-6 w-6 text-primary" />
                <h2 className="font-display text-2xl font-bold">{section.category}</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {section.items.map((item, i) => (
                  <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }} className="glass rounded-xl p-6 hover:border-primary/30 transition-colors">
                    <h3 className="font-display font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                    <Button variant="link" className="p-0 h-auto text-primary"><Download className="mr-1 h-3 w-3" /> {t("resources.access")}</Button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold mb-3">
              Galerie du Hub
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez quelques moments clés de UJUZI Labs Web3&nbsp;: événements, ateliers et temps forts avec la communauté.
            </p>
          </div>

          <div className="space-y-12">
            {galleryEvents.map((event, eventIndex) => (
              <motion.div
                key={`${event.title}-${eventIndex}`}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: eventIndex * 0.1 }}
                className="glass rounded-xl p-6 md:p-8"
              >
                <div className="text-center max-w-3xl mx-auto">
                  <h3 className="font-display text-2xl md:text-3xl font-bold">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-lg">
                    {event.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground mt-3">
                    {event.date}
                  </p>
                  <p className="text-muted-foreground mt-6 text-center leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.images.map((img, imgIndex) => (
                    <div
                      key={`${eventIndex}-${imgIndex}`}
                      className="glass rounded-lg overflow-hidden hover:border-primary/30 transition-colors"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={img.imageUrl}
                          alt={img.alt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;
