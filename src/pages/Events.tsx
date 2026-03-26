import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { strapiFetch } from "@/lib/strapi";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

interface EventData {
  id: string;
  title: string;
  title_fr: string | null;
  description: string | null;
  description_fr: string | null;
  date: string;
  location: string;
  type: string;
  upcoming: boolean;
}

const Events = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState("All");
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [registerEventId, setRegisterEventId] = useState<string | null>(null);
  const [regForm, setRegForm] = useState({ full_name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);

  const isFr = i18n.language === "fr";

  const filters = [
    { key: "All", label: t("events.all") },
    { key: "Upcoming", label: t("events.upcoming") },
    { key: "Past", label: t("events.past") },
    { key: "Workshop", label: t("events.workshop") },
    { key: "Hackathon", label: t("events.hackathon") },
    { key: "Meetup", label: t("events.meetup") },
  ];

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      type StrapiEventItem = {
        id: string | number;
        attributes?: {
          title?: string;
          title_fr?: string | null;
          description?: string | null;
          description_fr?: string | null;
          date?: string;
          location?: string;
          type?: string;
          upcoming?: boolean;
        };
      };

      const res = await strapiFetch<{ data: unknown[] }>(
        "/api/events?sort=createdAt:desc&populate=image&pagination[pageSize]=100"
      );
      const items = res.data || [];
      const mapped: EventData[] = items
        .map((item) => {
          const it = item as StrapiEventItem;
          return {
            id: String(it.id),
            title: it.attributes?.title ?? "",
            title_fr: it.attributes?.title_fr ?? null,
            description: it.attributes?.description ?? null,
            description_fr: it.attributes?.description_fr ?? null,
            date: it.attributes?.date ?? "",
            location: it.attributes?.location ?? "",
            type: it.attributes?.type ?? "",
            upcoming: !!it.attributes?.upcoming,
          };
        })
        .filter((e) => e.id && e.date && e.location && e.type);
      if (mapped.length) setEvents(mapped);
    } catch {
      // Fallback: keep using hardcoded events
    } finally {
      setLoading(false);
    }
  };

  const isPast = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return !isNaN(d.getTime()) && d < new Date();
    } catch { return false; }
  };

  const filtered = events.filter((e) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Upcoming") return e.upcoming && !isPast(e.date);
    if (activeFilter === "Past") return !e.upcoming || isPast(e.date);
    return e.type === activeFilter;
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerEventId) return;
    setSubmitting(true);
    try {
      await strapiFetch("/api/event-registrations", {
        method: "POST",
        body: JSON.stringify({
          data: {
            event: registerEventId,
            full_name: regForm.full_name,
            email: regForm.email,
            phone: regForm.phone || null,
          },
        }),
      });

      toast({ title: t("events.registerSuccess") });
      setRegisterEventId(null);
      setRegForm({ full_name: "", email: "", phone: "" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      const status = msg.includes("409")
        ? 409
        : msg.toLowerCase().includes("duplicate")
          ? 409
          : null;

      // Sans code d'erreur Supabase, on retombe sur le message générique.
      if (status === 409) {
        toast({ title: t("events.alreadyRegistered"), variant: "destructive" });
      } else {
        toast({ title: t("events.registerError"), variant: "destructive" });
      }
    }
    setSubmitting(false);
  };

  const getTitle = (e: EventData) => isFr && e.title_fr ? e.title_fr : e.title;
  const getDesc = (e: EventData) => isFr && e.description_fr ? e.description_fr : e.description;

  const hardcodedEvents: EventData[] = [
    { id: "1", title: t("events.event1Title"), title_fr: null, description: t("events.event1Desc"), description_fr: null, date: "2026-03-25", location: "Goma Innovation Center", type: "Workshop", upcoming: true },
    { id: "2", title: t("events.event2Title"), title_fr: null, description: t("events.event2Desc"), description_fr: null, date: "2026-04-10", location: "Virunga Tech Park", type: "Hackathon", upcoming: true },
    { id: "3", title: t("events.event3Title"), title_fr: null, description: t("events.event3Desc"), description_fr: null, date: "2026-04-20", location: "Goma Hub HQ", type: "Meetup", upcoming: true },
    { id: "4", title: t("events.event4Title"), title_fr: null, description: t("events.event4Desc"), description_fr: null, date: "2026-05-05", location: "Goma Hub HQ", type: "Workshop", upcoming: true },
    { id: "5", title: t("events.event5Title"), title_fr: null, description: t("events.event5Desc"), description_fr: null, date: "2026-02-15", location: "ULPGL University", type: "Meetup", upcoming: false },
    { id: "6", title: t("events.event6Title"), title_fr: null, description: t("events.event6Desc"), description_fr: null, date: "2026-01-20", location: "Goma Arts Center", type: "Workshop", upcoming: false },
  ];

  const displayEvents = events.length > 0 ? filtered : hardcodedEvents.filter((e) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Upcoming") return !isPast(e.date);
    if (activeFilter === "Past") return isPast(e.date);
    return e.type === activeFilter;
  });

  return (
    <div>
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">{t("events.title")}</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{t("events.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {filters.map((f) => (
              <button key={f.key} onClick={() => setActiveFilter(f.key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === f.key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground py-12">{t("admin.loading")}</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {displayEvents.map((event, i) => {
                const eventIsPast = isPast(event.date) || !event.upcoming;
                return (
                  <motion.div key={event.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                    className={`glass rounded-xl p-6 transition-colors ${eventIsPast ? "border-destructive/30 opacity-75" : "hover:border-primary/30"}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${eventIsPast ? "bg-destructive/20 text-destructive" : "text-primary bg-primary/10"}`}>{event.type}</span>
                      {eventIsPast && (
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-destructive/20 text-destructive flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> {t("events.eventPassed")}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2">{getTitle(event)}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{getDesc(event)}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className={`flex items-center gap-1 ${eventIsPast ? "text-destructive" : ""}`}><Calendar className="h-4 w-4" /> {event.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {event.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline-glow" size="sm" asChild>
                        <Link to={`/events/${event.id}`}>{t("events.viewDetails")} <ArrowRight className="ml-1 h-3 w-3" /></Link>
                      </Button>
                      {!eventIsPast && (
                        <Button variant="glow" size="sm" onClick={() => setRegisterEventId(event.id)}>
                          {t("events.register")}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!registerEventId} onOpenChange={(open) => !open && setRegisterEventId(null)}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>{t("events.registerTitle")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4 mt-4">
            <Input placeholder={t("events.fullName")} value={regForm.full_name} onChange={(e) => setRegForm({ ...regForm, full_name: e.target.value })} required />
            <Input type="email" placeholder={t("events.email")} value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} required />
            <Input placeholder={t("events.phone")} value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} />
            <Button type="submit" variant="glow" className="w-full" disabled={submitting}>
              {submitting ? t("events.submitting") : t("events.confirmRegister")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;
