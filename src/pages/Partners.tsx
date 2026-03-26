import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { mediaToUrl, strapiFetch } from "@/lib/strapi";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const Partners = () => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  type PartnerMarquee = { name: string; logo: string; description: string; url: string };
  const hardcodedMarqueePartners: PartnerMarquee[] = [
    {
      name: "Apex Fusion",
      logo: "/partners/apex.png",
      description: "Apex Fusion",
      url: "https://apexfusion.com/",
    },
    {
      name: "Wada",
      logo: "/partners/wada.jpg",
      description:
        "Organisation et d'un incubateur communautaire axé sur l'adoption de la blockchain Cardano et de l'intelligence artificielle en Afrique.",
      url: "https://wada.org/",
    },
    {
      name: "Catalyst",
      logo: "/partners/Catalyst.jpg",
      description: "Project Catalyst is the world’s largest decentralized innovation engine for solving real-world challenges.",
      url: "https://projectcatalyst.io/",
    },
    {
      name: "Ekival",
      logo: "/partners/Ekival.png",
      description: "Solution pour le global pair à pair transfert d'argent et de cryptomonnaies",
      url: "https://ekival.com/",
    },
    {
      name: "ISDR-GL",
      logo: "/partners/partner1.png",
      description: "ISDR-GL - Development Rural",
      url: "https://isdrgl.com",
    },
  ];

  const [marqueePartners, setMarqueePartners] = useState<PartnerMarquee[]>(hardcodedMarqueePartners);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await strapiFetch<{ data: unknown[] }>(
          "/api/partners?populate=logo&pagination[pageSize]=50"
        );
        const items = res.data || [];
        const mapped: PartnerMarquee[] = items
          .map((item) => {
            const it = item as { attributes?: Record<string, unknown> };
            const attrs = (it.attributes ?? {}) as Record<string, unknown>;
            const name = String(attrs.name ?? "");
            const url = String(attrs.url ?? "");
            const description = String(attrs.description ?? "");
            const logoUrl = mediaToUrl(attrs.logo) ?? "";
            if (!name || !url || !logoUrl) return null;
            return { name, url, description, logo: logoUrl };
          })
          .filter((p): p is PartnerMarquee => p !== null);

        if (mapped.length) setMarqueePartners(mapped);
      } catch {
        // fallback: hardcodedMarqueePartners
      }
    };

    fetchPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [form, setForm] = useState({
    companyName: "",
    companyWebsite: "",
    industry: "",
    contactPerson: "",
    email: "",
    phone: "",
    partnershipType: "sponsorship",
  });
  const [submitting, setSubmitting] = useState(false);

  return (
    <div>
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              {t("partners.title")} <span className="gradient-text">{t("partners.titleHighlight")}</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{t("partners.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Partners</h2>
          
          {/* Partners Marquee */}
          <div className="relative overflow-hidden bg-gradient-to-r from-transparent via-white/5 to-transparent py-8">
            <div className="flex animate-scroll">
              {[...marqueePartners, ...marqueePartners].map((partner, i) => (
                <div
                  key={`${partner.name}-${i}`}
                  className="flex flex-col items-center min-w-[200px] max-w-[220px] mx-4 flex-shrink-0"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-16 w-auto object-contain mb-3"
                    style={{ maxWidth: 160 }}
                  />
                  <div className="text-center text-sm text-muted-foreground mb-2 font-medium">{partner.description}</div>
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1 text-xs"
                  >
                    <span>Visit website</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="max-w-2xl mx-auto">
            <SectionHeading
              title={t("partners.becomeTitle")}
              subtitle={t("partners.becomeSubtitle")}
            />
            <div className="flex justify-center mb-6">
              <Button variant="glow" size="lg" onClick={() => setShowForm((v) => !v)}>
                {t("partners.getInTouch")}
              </Button>
            </div>
            {showForm && (
              <Card className="shadow-xl border-none animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-center text-2xl font-bold mb-2">
                    Become a partner at UJUZI Labs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (submitting) return;
                      setSubmitting(true);
                      try {
                        await strapiFetch("/api/partner-applications", {
                          method: "POST",
                          body: JSON.stringify({
                            data: {
                              companyName: form.companyName,
                              companyWebsite: form.companyWebsite,
                              industry: form.industry,
                              contactPerson: form.contactPerson,
                              email: form.email,
                              phone: form.phone,
                              partnershipType: form.partnershipType,
                            },
                          }),
                        });
                        toast({ title: "Demande envoyée avec succès." });
                        setShowForm(false);
                        setForm({
                          companyName: "",
                          companyWebsite: "",
                          industry: "",
                          contactPerson: "",
                          email: "",
                          phone: "",
                          partnershipType: "sponsorship",
                        });
                      } catch {
                        toast({ title: "Erreur lors de l'envoi.", variant: "destructive" });
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  >
                    <div>
                      <Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        required
                        placeholder="Company Name"
                        className="mt-1"
                        value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyWebsite">Company Website <span className="text-red-500">*</span></Label>
                      <Input
                        id="companyWebsite"
                        name="companyWebsite"
                        required
                        placeholder="Company Website"
                        className="mt-1"
                        value={form.companyWebsite}
                        onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry <span className="text-red-500">*</span></Label>
                      <Input
                        id="industry"
                        name="industry"
                        required
                        placeholder="Industry"
                        className="mt-1"
                        value={form.industry}
                        onChange={(e) => setForm({ ...form, industry: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson">Contact Person (Full Name) <span className="text-red-500">*</span></Label>
                      <Input
                        id="contactPerson"
                        name="contactPerson"
                        required
                        placeholder="Contact Person (Full Name)"
                        className="mt-1"
                        value={form.contactPerson}
                        onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Email Address"
                        className="mt-1"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                      <Input
                        id="phone"
                        name="phone"
                        required
                        placeholder="Phone Number"
                        className="mt-1"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="partnershipType">What type of partnership are you interested in? <span className="text-red-500">*</span></Label>
                      <Select
                        required
                        name="partnershipType"
                        value={form.partnershipType}
                        onValueChange={(v) => setForm({ ...form, partnershipType: v })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sponsorship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sponsorship">Sponsorship</SelectItem>
                          <SelectItem value="media">Media Partner</SelectItem>
                          <SelectItem value="ecosystem">Ecosystem Partner</SelectItem>
                          <SelectItem value="startup">Startup Showcase</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2 flex justify-center mt-4">
                      <Button type="submit" className="w-full md:w-1/2" size="lg">Register</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
