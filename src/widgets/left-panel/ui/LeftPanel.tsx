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
        {/* Brand Logo & awaluddin.dev link that scrolls to top */}
        <div className="mb-6">
          <Link
            href="/"
            onClick={(e) => {
              if (!isSubPage && typeof window !== "undefined") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="inline-flex items-center gap-2.5 group focus:outline-none"
            aria-label="awaluddin.dev - Back to top"
          >
            <svg
              width="28"
              height="29"
              viewBox="0 0 831 872"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 shrink-0 transition-transform group-hover:scale-105"
            >
              <ellipse cx="425" cy="470.5" rx="366" ry="353.5" fill="#1ADDDA" />
              <path
                d="M599.053 591.053C625.756 564.349 625.756 521.054 599.053 494.351C572.349 467.647 529.054 467.647 502.351 494.351C475.647 521.054 475.647 564.349 502.351 591.053C529.054 617.756 572.349 617.756 599.053 591.053Z"
                fill="#155B64"
              />
              <path
                d="M331.053 591.053C357.756 564.349 357.756 521.054 331.053 494.351C304.349 467.647 261.054 467.647 234.351 494.351C207.647 521.054 207.647 564.349 234.351 591.053C261.054 617.756 304.349 617.756 331.053 591.053Z"
                fill="#155B64"
              />
              <path
                d="M783.854 276.43C813.947 333.12 831 397.81 831 466.488C831 690.446 649.675 872 426 872V781.886C599.97 781.886 741 640.678 741 466.488C741 428.963 734.454 392.968 722.445 359.586C747.648 334.59 767.847 306.119 783.854 276.43ZM429.15 70C535.755 70.8131 632.557 112.866 704.429 181.013C703.695 181.674 702.955 182.332 702.209 182.985C700.86 184.164 699.492 185.331 698.102 186.483C676.573 208.646 653.972 225.439 632.049 236.93C583.086 194.497 520.925 166.923 452.561 161.208C451.486 159.5 450.434 157.826 449.407 156.192L449.353 156.107C440.671 142.285 433.789 131.331 429.15 127.286V70Z"
                fill="#155B64"
              />
              <path
                d="M47.2627 276.43C17.0947 333.12 5.47618e-05 397.81 0 466.488C0 690.446 181.772 872 406 872V781.886C231.601 781.886 90.2222 640.678 90.2222 466.488C90.2223 428.963 96.7846 392.968 108.824 359.586C83.5578 334.59 63.3089 306.119 47.2627 276.43ZM402.842 70C295.974 70.8131 198.933 112.866 126.884 181.013C127.619 181.674 128.361 182.332 129.109 182.985C130.461 184.164 131.833 185.331 133.226 186.483C154.809 208.646 177.465 225.439 199.442 236.93C248.526 194.497 310.84 166.923 379.373 161.208C380.451 159.5 381.506 157.826 382.535 156.192L382.589 156.107C391.293 142.285 398.192 131.331 402.842 127.286V70Z"
                fill="#155B64"
              />
              <path
                d="M795.832 2.48691C799.251 0.0187116 803.164 -0.68425 807.334 0.702605C811.017 1.02496 813.67 3.85224 815.469 6.88379C817.469 10.2532 819.083 14.932 820.352 20.5291C822.903 31.7813 824.259 47.6577 823.959 66.5924C823.359 104.504 816.113 155.273 797.933 207.002C761.561 310.498 681.14 418.426 522.177 433.982L521.982 434L521.785 433.998C493.649 433.681 472.56 417.44 457.085 394.562C441.643 371.734 431.485 341.908 425.087 313.266L425 312.878V141.804L431.344 149.212C434.158 152.499 437.569 158.697 441.248 165.337L441.296 165.424L441.306 165.445C444.265 170.785 447.524 176.664 451.076 182.322C459.847 196.295 470.422 213.135 482.377 228.501C494.179 243.671 507.102 257.104 520.663 264.918L521.309 265.287L521.496 265.391L521.669 265.517C538.187 277.586 563.368 279.847 592.499 270.936C621.543 262.051 653.991 242.182 684.333 210.922L684.469 210.783L684.618 210.659C738.026 166.354 758.866 99.5103 773.269 53.1207C778.323 36.842 782.673 22.7851 787.441 13.4597C789.817 8.81106 792.516 4.88035 795.832 2.48691Z"
                fill="#155B64"
              />
              <path
                d="M35.1681 2.48691C31.7486 0.0187116 27.836 -0.68425 23.6656 0.702605C19.9829 1.02496 17.3298 3.85224 15.5307 6.88379C13.5313 10.2532 11.9171 14.932 10.648 20.5291C8.09675 31.7813 6.7414 47.6577 7.04102 66.5924C7.64095 104.504 14.8872 155.273 33.0666 207.002C69.4386 310.498 149.86 418.426 308.823 433.982L309.018 434L309.215 433.998C337.351 433.681 358.44 417.44 373.915 394.562C389.357 371.734 399.515 341.908 405.913 313.266L406 312.878V141.804L399.656 149.212C396.842 152.499 393.431 158.697 389.752 165.337L389.704 165.424L389.694 165.445C386.735 170.785 383.476 176.664 379.924 182.322C371.153 196.295 360.578 213.135 348.623 228.501C336.821 243.671 323.898 257.104 310.337 264.918L309.691 265.287L309.504 265.391L309.331 265.517C292.813 277.586 267.632 279.847 238.501 270.936C209.457 262.051 177.009 242.182 146.667 210.922L146.531 210.783L146.382 210.659C92.9741 166.354 72.1337 99.5103 57.7311 53.1207C52.6766 36.842 48.3266 22.7851 43.5592 13.4597C41.1827 8.81106 38.4838 4.88035 35.1681 2.48691Z"
                fill="#155B64"
              />
            </svg>
            <span className="text-base sm:text-lg font-mono font-bold tracking-tight text-primary group-hover:text-brand transition-colors">
              awaluddin.dev
            </span>
          </Link>
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
            Directions
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

        {/* Available for Remote Work Status Indicator */}
        <div className="inline-flex items-center gap-2 text-[11px] font-mono pt-1">
          <div className="relative flex h-1.5 w-1.5 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dynamicHeroConfig?.status === "busy" ? "bg-amber-400" : "bg-status"}`} />
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dynamicHeroConfig?.status === "busy" ? "bg-amber-400" : "bg-status"}`} />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`font-semibold ${dynamicHeroConfig?.status === "busy" ? "text-amber-400" : "text-status"}`}>Status:</span>
            <span className="text-secondary">{dynamicHeroConfig?.statusText || "Available for Remote Roles (UTC+7)"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default LeftPanel;
