"use client";

import React from "react";
import Link from "next/link";
import { PenTool, Mail } from "lucide-react";
import { SiGithub, SiLinkedin } from "@/shared/ui/icons/BrandIcons";
import { usePortfolioStore } from "@/shared/store/portfolioStore";

export interface NavItem {
  id: string;
  label: string;
}

interface LeftPanelProps {
  navItems?: NavItem[];
  activeSection?: string;
  onSectionClick?: (id: string) => void;
  isSubPage?: boolean;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Career" },
  { id: "projects", label: "Projects" },
  { id: "proficiency", label: "Proficiency" },
  { id: "endorse", label: "Endorsements" },
];

export function LeftPanel({
  navItems = DEFAULT_NAV_ITEMS,
  activeSection = "about",
  onSectionClick,
  isSubPage = false,
}: Readonly<LeftPanelProps>) {
  const { dynamicHeroConfig, setShowResumeModal } = usePortfolioStore();

  return (
    <aside className="lg:sticky lg:top-0 lg:h-screen lg:max-h-screen lg:self-start lg:w-[32%] xl:w-[28%] lg:flex lg:flex-col lg:justify-between lg:py-24">
      <div>
        {/* Available for Remote Work Status Indicator at Top */}
        <div className="inline-flex items-center gap-2 text-[11px] font-mono mb-4">
          <div className="relative flex h-1.5 w-1.5 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dynamicHeroConfig?.status === "busy" ? "bg-amber-400" : "bg-status"}`} />
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dynamicHeroConfig?.status === "busy" ? "bg-amber-400" : "bg-status"}`} />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`font-semibold ${dynamicHeroConfig?.status === "busy" ? "text-amber-400" : "text-status"}`}>Status:</span>
            <span className="text-secondary">{dynamicHeroConfig?.statusText || "Available for Remote Roles (UTC+7)"}</span>
          </div>
        </div>

        {/* Identity & Headline */}
        <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-primary">
          <Link href="/" className="hover:text-brand transition-colors">
            {dynamicHeroConfig?.name || "Awaluddin"}
          </Link>
        </h1>

        <h2 className="mt-2 text-base sm:text-lg font-display font-semibold text-brand">
          {dynamicHeroConfig?.role || "Backend Engineer & AI Integrator"}
        </h2>

        <p className="mt-1 text-base sm:text-lg font-display font-semibold text-brand">
          {dynamicHeroConfig?.headline || "Production Systems at Scale"}
        </p>

        {/* Core Quote / Summary */}
        <p className="mt-3.5 max-w-sm text-xs sm:text-sm text-secondary font-normal leading-relaxed">
          &ldquo;{dynamicHeroConfig?.quote || "I ship LLM integrations into production — not train models in notebooks."}&rdquo;
        </p>

        {/* Navigasi Scrollspy Vertikal */}
        <nav className="nav hidden lg:block mt-10" aria-label="In-page jump links">
          <ul className="w-max space-y-2.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              if (isSubPage) {
                return (
                  <li key={item.id}>
                    <Link
                      href={`/#${item.id}`}
                      className="group flex items-center py-1 cursor-pointer text-left focus:outline-none"
                    >
                      <span className="mr-3 h-px transition-all duration-300 w-6 bg-subtle group-hover:w-12 group-hover:bg-brand" />
                      <span className="text-xs font-mono font-medium uppercase tracking-wider transition-colors duration-300 text-muted group-hover:text-primary">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSectionClick?.(item.id)}
                    className="group flex items-center py-1 cursor-pointer text-left focus:outline-none"
                  >
                    <span
                      className={`mr-3 h-px transition-all duration-300 group-hover:w-12 group-hover:bg-brand ${
                        isActive ? "w-12 bg-brand" : "w-6 bg-subtle"
                      }`}
                    />
                    <span
                      className={`text-xs font-mono font-medium uppercase tracking-wider transition-colors duration-300 group-hover:text-primary ${
                        isActive ? "text-primary" : "text-muted"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Social Links Kolom Kiri */}
      <div className="mt-8 lg:mt-0 flex flex-col gap-4">
        <ul className="flex items-center gap-5 text-secondary" aria-label="Social media">
          <li>
            <a
              href="https://github.com/awaluddin-dev"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-brand transition-colors p-1"
              aria-label="GitHub (opens in a new tab)"
            >
              <SiGithub size={20} />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/awaluddin-developer"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-brand transition-colors p-1"
              aria-label="LinkedIn (opens in a new tab)"
            >
              <SiLinkedin size={20} />
            </a>
          </li>
          <li>
            <a
              href="https://dev.to/awaluddin"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-brand transition-colors p-1"
              aria-label="Dev.to (opens in a new tab)"
            >
              <PenTool size={20} />
            </a>
          </li>
          <li>
            <Link
              href="/inquiry"
              className="hover:text-brand transition-colors p-1 flex items-center justify-center"
              aria-label="Send Inquiry"
            >
              <Mail size={20} />
            </Link>
          </li>
        </ul>

        <div className="text-xs font-mono text-muted flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowResumeModal(true)}
            className="hover:text-brand transition-colors cursor-pointer text-left"
          >
            Resume
          </button>
          <span className="text-subtle">|</span>
          <a
            href={dynamicHeroConfig?.docsUrl || "https://sb.awaluddin.dev/docs"}
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-brand transition-colors"
          >
            Docs
          </a>
          <span className="text-subtle">|</span>
          <Link
            href="/directions"
            className="hover:text-brand transition-colors"
          >
            Activity
          </Link>
          <span className="text-subtle">|</span>
          <a
            href="https://v1.awaluddin.dev"
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-brand transition-colors opacity-70 hover:opacity-100"
            title="Older portfolio version"
          >
            v1
          </a>
        </div>
      </div>
    </aside>
  );
}

export default LeftPanel;
