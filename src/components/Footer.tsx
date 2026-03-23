import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin } from "lucide-react";
import { IconDiscord, IconGitHub, IconTelegram, IconX } from "./FooterSocialIcons";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-background border-t border-border text-foreground transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground">
              UJUZI <span className="text-primary">Labs</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("footer.desc")}
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Goma, North Kivu, DR Congo</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-6 text-sm uppercase tracking-wider text-foreground">
              {t("footer.quickLinks")}
            </h4>
            <div className="flex flex-col gap-3">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("nav.about")}</Link>
              <Link to="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("nav.events")}</Link>
              <Link to="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("nav.projects")}</Link>
              <Link to="/community" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("nav.community")}</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold mb-6 text-sm uppercase tracking-wider text-foreground">
              {t("footer.resources")}
            </h4>
            <div className="flex flex-col gap-3">
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("nav.blog")}</Link>
              <Link to="/documentation" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("nav.documentation")}</Link>
              <Link to="/tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("nav.tools")}</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("nav.contact")}</Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display font-semibold mb-6 text-sm uppercase tracking-wider text-foreground">
              {t("footer.connect")}
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-3">
                <a
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#000000] text-white shadow-sm ring-1 ring-black/10 dark:ring-white/20 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="X"
                >
                  <IconX className="h-[18px] w-[18px]" />
                </a>
                <a
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#5865F2] text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Discord"
                >
                  <IconDiscord className="h-[22px] w-[22px]" />
                </a>
                <a
                  href="https://t.me/CardanoGomaCommunity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#26A5E4] text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Telegram"
                >
                  <IconTelegram className="h-[22px] w-[22px]" />
                </a>
                <a
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#24292F] text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="GitHub"
                >
                  <IconGitHub className="h-[22px] w-[22px]" />
                </a>
              </div>
              <div className="space-y-2">
                <a href="mailto:contact@ujiuzilabs.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                  contact@ujiuzilabs.com
                </a>
                <a href="tel:+243123456789" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="h-4 w-4" />
                  +243974973061
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} UJUZI Labs. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
