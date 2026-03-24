import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";

interface NavGroup {
  label: string;
  items: { key: string; path: string }[];
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const location = useLocation();
  const { t } = useTranslation();
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navGroups: (NavGroup | { key: string; path: string })[] = [
    { key: "home", path: "/" },
    {
      label: "nav.about",
      items: [
        { key: "presentation", path: "/about" },
        { key: "services", path: "/about#services" },
        { key: "team", path: "/about#team" },
        { key: "partners", path: "/partners" },
        { key: "contact", path: "/contact" },
      ],
    },
    {
      label: "nav.ecosystem",
      items: [
        { key: "projects", path: "/projects" },
        { key: "events", path: "/events" },
        { key: "validators", path: "/validators" },
        { key: "community", path: "/community" },
      ],
    },
    {
      label: "nav.resources",
      items: [
        { key: "blog", path: "/blog" },
        { key: "documentation", path: "/documentation" },
        { key: "tools", path: "/tools" },
        { key: "gallery", path: "/resources#gallery" },
      ],
    },
    {
      label: "nav.onboarding",
      items: [
        { key: "onboardingWhat", path: "/onboarding#what-is-onboarding" },
        { key: "impact", path: "/onboarding#impact" },
        { key: "donate", path: "/onboarding#donate" },
      ],
    },
  ];

  const isGroup = (item: any): item is NavGroup => "items" in item;

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path.includes("#")) return location.pathname === path.split("#")[0];
    return location.pathname === path;
  };

  const isGroupActive = (group: NavGroup) => group.items.some((item) => isActive(item.path));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="UJUZI Labs" className="h-10 w-10" />
            <span className="font-display text-xl font-bold text-foreground">
              UJUZI <span className="text-primary">Labs</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {navGroups.map((item, idx) =>
              isGroup(item) ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                      isGroupActive(item) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {t(item.label)}
                    <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`} />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-popover rounded-xl shadow-lg border border-border py-2 z-50">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={`block px-4 py-3 text-sm transition-colors whitespace-nowrap ${
                            isActive(sub.path) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                        >
                          {t(`nav.${sub.key}`)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive(item.path) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              )
            )}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            <ThemeToggle />
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="text-muted-foreground hover:text-foreground">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-popover border-t border-border max-h-[80vh] overflow-y-auto">
            <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-2">
              {navGroups.map((item) =>
                isGroup(item) ? (
                  <div key={item.label}>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isGroupActive(item) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      {t(item.label)}
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileExpanded === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {mobileExpanded === item.label && (
                      <div className="ml-4 flex flex-col gap-1 mt-2">
                        {item.items.map((sub) => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            onClick={() => setMobileOpen(false)}
                            className={`px-4 py-3 text-sm rounded-lg transition-colors ${
                              isActive(sub.path) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            }`}
                          >
                            {t(`nav.${sub.key}`)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.path) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
