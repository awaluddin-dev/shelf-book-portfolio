import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  LogOut,
  LayoutDashboard,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Network,
  Rocket,
  Layers,
  Cpu,
  ArrowLeft,
  BookOpen,
  Palette,
  Milestone,
  Menu,
  X,
  Database,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";

export function AdminSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();
  const activePath = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/admin/login");
  };

  const navGroups = [
    {
      group: "General",
      items: [
        { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      ],
    },
    {
      group: "Portfolio",
      items: [
        { path: "/admin/projects", icon: BookOpen, label: "Projects" },
        { path: "/admin/architecture", icon: Layers, label: "Architecture" },
        { path: "/admin/schema", icon: Database, label: "DB Schema" },
        { path: "/admin/erd", icon: Database, label: "ERD" },
        {
          path: "/admin/technical-imagery",
          icon: Palette,
          label: "Tech Imagery",
        },
        { path: "/admin/lifecycle", icon: Milestone, label: "Lifecycle" },
      ],
    },
    {
      group: "Resume & Social",
      items: [
        {
          path: "/admin/testimoni",
          icon: MessageSquare,
          label: "Testimonials",
        },
        { path: "/admin/work", icon: Briefcase, label: "Work Exp." },
        { path: "/admin/skill", icon: Network, label: "Skill Tree" },
        { path: "/admin/learning", icon: Rocket, label: "Learning" },
        { path: "/admin/current", icon: Layers, label: "Right Now" },
        { path: "/admin/proficiency", icon: Cpu, label: "Proficiency" },
      ],
    },
  ];

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-[100] p-3 glass-card rounded-xl shadow-neu text-neu-accent"
        onClick={() => setIsMobileOpen(true)}
        type="button"
      >
        <Menu size={24} />
      </button>

      {isMobileOpen && (
        <button
          className="md:hidden fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
              setIsMobileOpen(false);
            }
          }}
          type="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      <div
        className={cn(
          "h-screen md:py-[10vh] flex flex-col justify-start fixed md:sticky top-0 z-[95] transition-transform duration-300",
          isMobileOpen
            ? "translate-x-0 p-6 py-[10vh]"
            : "-translate-x-full md:translate-x-0 md:p-6",
        )}
      >
        <motion.aside
          animate={{ width: isExpanded ? 240 : 64 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative h-full flex flex-col p-1.5 rounded-2xl overflow-hidden z-10 glass-card md:bg-transparent md:border-none md:shadow-none"
        >
          <div className="flex-1 flex flex-col p-1 overflow-hidden relative">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden absolute top-2 right-2 p-1 text-neu-text-muted hover:text-neu-accent z-20"
              type="button"
            >
              <X size={18} />
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-10 rounded-xl flex items-center gap-3 px-2 text-neu-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors overflow-hidden whitespace-nowrap"
            >
              <div className="min-w-[24px] flex justify-center">
                {isExpanded ? (
                  <ChevronLeft size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-bold font-display text-sm"
                  >
                    Collapse
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <div className="w-full h-px bg-black/10 dark:bg-white/10 my-2 shrink-0" />

            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-2 hide-scrollbar">
              {navGroups.map((group, idx) => (
                <div key={idx as number} className="flex flex-col gap-1">
                  {isExpanded && (
                    <span className="px-3 text-[10px] font-bold tracking-wider text-neu-text-muted uppercase mb-1">
                      {group.group}
                    </span>
                  )}
                  {!isExpanded && idx !== 0 && (
                    <div className="w-full h-px bg-black/10 dark:bg-white/10 my-1 shrink-0" />
                  )}
                  {group.items.map((item) => {
                    const isActive = activePath === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        href={item.path}
                        key={item.path}
                        className={cn(
                          "h-10 rounded-xl flex items-center gap-3 px-2 transition-colors overflow-hidden whitespace-nowrap",
                          isActive
                            ? "bg-black/5 dark:bg-white/5 text-neu-accent font-bold"
                            : "text-neu-text hover:bg-black/5 dark:hover:bg-white/5",
                        )}
                      >
                        <div className="min-w-[24px] flex justify-center">
                          <Icon size={18} />
                        </div>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="text-sm"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-auto pt-2 space-y-2 border-t border-black/10 dark:border-white/10 shrink-0">
              {activePath === "/admin/dashboard" && (
                <Link
                  href="/"
                  className="w-full h-10 rounded-xl flex items-center gap-3 px-2 hover:bg-black/5 dark:hover:bg-white/5 text-neu-text transition-colors overflow-hidden whitespace-nowrap"
                >
                  <div className="min-w-[24px] flex justify-center">
                    <ArrowLeft size={18} />
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="font-bold text-sm"
                      >
                        Back to Portfolio
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full h-10 rounded-xl flex items-center gap-3 px-2 hover:bg-red-500/10 text-neu-text-muted hover:text-red-500 transition-colors overflow-hidden whitespace-nowrap"
              >
                <div className="min-w-[24px] flex justify-center">
                  <LogOut size={18} />
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-bold text-sm"
                    >
                      Logout
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </motion.aside>
      </div>
    </>
  );
}
