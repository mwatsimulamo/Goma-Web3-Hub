import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";
import { strapiFetch } from "@/lib/strapi";

interface NavGroup {
  label: string;
  items: { key: string; path: string }[];
}

type NavEntry = NavGroup | { key: string; path: string };

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const location = useLocation();
  const { t } = useTranslation();
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fallbackNavGroups: NavEntry[] = [
    { key: "home", path: "/" },
    {
      label: "nav.about",
      items: [
        { key: "presentation", path: "/about#presentation" },
        { key: "services", path: "/about#services" },
        { key: "team", path: "/about#team" },
        { key: "partners", path: "/about#partners" },
        { key: "contact", path: "/about#contact" },
      ],
    },
    {
      key: "projects",
      path: "/projects",
    },
    {
      label: "nav.ecosystem",
      items: [
        { key: "blockchains", path: "/partners" },
        { key: "validators", path: "/validators" },
        { key: "events", path: "/events" },
        { key: "joinOurCommunity", path: "/community" },
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
  ];

  const applyRequestedNavStructure = (groups: NavEntry[]): NavEntry[] => {
    const cleaned = groups
      .filter((entry) => {
        if (!("items" in entry)) return true;
        const normalizedLabel = entry.label.toLowerCase();
        return !normalizedLabel.includes("onboarding");
      })
      .map((entry) => {
      if (!("items" in entry)) return entry;
      const normalizedLabel = entry.label.toLowerCase();
      if (
        !(
          normalizedLabel.includes("ecosystem") ||
          normalizedLabel.includes("ecosysteme") ||
          normalizedLabel.includes("ecosytem")
        )
      ) {
        return entry;
      }
      return {
        ...entry,
        items: [
          { key: "blockchains", path: "/partners" },
          { key: "validators", path: "/validators" },
          { key: "events", path: "/events" },
          { key: "joinOurCommunity", path: "/community" },
        ],
      };
    });

    const withoutProjectsGroup = cleaned.filter(
      (entry) =>
        !(
          "items" in entry &&
          (entry.label.toLowerCase().includes("projects") || entry.label.toLowerCase().includes("projets"))
        )
    );
    const hasProjectsTopLevel = withoutProjectsGroup.some(
      (entry) => !("items" in entry) && entry.path === "/projects"
    );
    if (hasProjectsTopLevel) return withoutProjectsGroup;

    const aboutIndex = withoutProjectsGroup.findIndex(
      (entry) => "items" in entry && entry.label.toLowerCase().includes("about")
    );

    if (aboutIndex === -1) {
      return [
        ...withoutProjectsGroup,
        { key: "projects", path: "/projects" },
      ];
    }

    return [
      ...withoutProjectsGroup.slice(0, aboutIndex + 1),
      { key: "projects", path: "/projects" },
      ...withoutProjectsGroup.slice(aboutIndex + 1),
    ];
  };

  const [navGroups, setNavGroups] = useState<NavEntry[]>(applyRequestedNavStructure(fallbackNavGroups));

  const stripNavKey = (labelKey: string) => {
    if (!labelKey) return labelKey;
    if (labelKey.startsWith("nav.")) return labelKey.slice("nav.".length);
    return labelKey;
  };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        type StrapiMenuGroup = {
          id: string | number;
          attributes?: {
            labelKey?: string;
            location?: "header" | "footer";
            order?: number;
            items?: { data?: Array<{ id?: string | number; attributes?: { labelKey?: string; path?: string; order?: number } }> };
          };
        };

        const res = await strapiFetch<{ data?: StrapiMenuGroup[] }>(
          "/api/site-menu-groups?populate=items&pagination[pageSize]=50"
        );
        const groups = (res.data ?? []).filter(Boolean);

        const headerGroups = groups
          .map((g) => {
            const attrs = g.attributes ?? {};
            if (attrs.location !== "header") return null;
            const groupLabelKey = String(attrs.labelKey ?? "");
            if (!groupLabelKey) return null;

            const items = attrs.items?.data ?? [];
            const mappedItems = items
              .map((it) => {
                const iAttrs = it.attributes ?? {};
                const labelKey = String(iAttrs.labelKey ?? "");
                const path = String(iAttrs.path ?? "");
                if (!labelKey || !path) return null;
                return {
                  key: stripNavKey(labelKey),
                  path,
                };
              })
              .filter((x): x is { key: string; path: string } => x !== null);

            return {
              label: groupLabelKey,
              items: mappedItems,
              order: typeof attrs.order === "number" ? attrs.order : 0,
            };
          })
          .filter((x): x is { label: string; items: NavGroup["items"]; order: number } => x !== null)
          .sort((a, b) => a.order - b.order);

        if (headerGroups.length) {
          const incoming: NavEntry[] = [
            { key: "home", path: "/" },
            ...headerGroups.map((g) => ({ label: g.label, items: g.items })),
          ];
          setNavGroups(applyRequestedNavStructure(incoming));
        }
      } catch {
        // Fallback déjà présent
      }
    };

    fetchMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isGroup = (item: unknown): item is NavGroup => {
    if (typeof item !== "object" || item === null) return false;
    return "items" in item;
  };

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
              UJUZI <span className="text-[#ffb800]">Labs</span>
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
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                      isGroupActive(item)
                        ? "text-[#ffb800] bg-[#ffb800]/10"
                        : "text-muted-foreground hover:text-[#ffb800] hover:bg-[#ffb800]/10"
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
                          className={`block px-4 py-3 text-sm font-bold transition-colors whitespace-nowrap ${
                            isActive(sub.path)
                              ? "text-[#ffb800] bg-[#ffb800]/10"
                              : "text-muted-foreground hover:text-[#ffb800] hover:bg-[#ffb800]/10"
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
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
                    isActive(item.path)
                      ? "text-[#ffb800] bg-[#ffb800]/10"
                      : "text-muted-foreground hover:text-[#ffb800] hover:bg-[#ffb800]/10"
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
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-lg transition-colors ${
                        isGroupActive(item)
                          ? "text-[#ffb800] bg-[#ffb800]/10"
                          : "text-muted-foreground hover:text-[#ffb800] hover:bg-[#ffb800]/10"
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
                            className={`px-4 py-3 text-sm font-bold rounded-lg transition-colors ${
                              isActive(sub.path)
                                ? "text-[#ffb800] bg-[#ffb800]/10"
                                : "text-muted-foreground hover:text-[#ffb800] hover:bg-[#ffb800]/10"
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
                    className={`px-4 py-3 text-sm font-bold rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "text-[#ffb800] bg-[#ffb800]/10"
                        : "text-muted-foreground hover:text-[#ffb800] hover:bg-[#ffb800]/10"
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
