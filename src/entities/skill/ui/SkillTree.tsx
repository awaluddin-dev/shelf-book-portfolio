import { memo, useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Network } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface SkillNode {
  id: string;
  title: string;
  category: string;
  categoryId?: string;
  proficiencySkillId?: string;
  level: string;
  x: number;
  y: number;
  details: string;
  connections: string[];
}

interface SkillNodeProps {
  node: SkillNode;
  active: boolean;
  anyActive: boolean;
  connectedToActive: boolean;
  isDark: boolean;
  isMobile: boolean;
  coords: { x: number; y: number };
  colors: { bg: string; text: string; stroke: string; gradient: string };
  shortTitle: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const SkillTreeNode = memo(function SkillTreeNode({
  node,
  active,
  anyActive,
  connectedToActive,
  isDark,
  isMobile,
  coords,
  colors,
  shortTitle,
  onMouseEnter,
  onMouseLeave,
}: SkillNodeProps) {
  const catLower = (node.category || "").toLowerCase();
  let fillGradient = "url(#ai-grad)";
  if (catLower.includes("backend")) fillGradient = "url(#backend-grad)";
  else if (catLower.includes("infra") || catLower.includes("data"))
    fillGradient = "url(#infra-grad)";
  let opacityLabel = "opacity-90";
  if (anyActive && !connectedToActive && !active) {
    opacityLabel = "opacity-30";
  } else if (!anyActive && connectedToActive) {
    opacityLabel = "fill-current opacity-90";
  }

  return (
    <g
      className="cursor-pointer group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Subtle ambient pulse ring for unhovered active look */}
      <circle
        cx={coords.x}
        cy={coords.y}
        r={active ? 20 : 12}
        className={cn(
          "transition-all duration-300 fill-none",
          active
            ? "stroke-2 opacity-100"
            : "stroke-1 opacity-0 group-hover:opacity-50",
        )}
        stroke={colors.stroke}
      />

      {/* Node fill circle */}
      <circle
        cx={coords.x}
        cy={coords.y}
        r={active ? 12 : 7}
        fill={fillGradient}
        className={cn(
          "transition-all duration-300 shadow-lg",
          anyActive && !connectedToActive ? "opacity-40" : "opacity-100",
        )}
      />

      {/* Interactive Larger Invisible Circle for generous hover target */}
      <circle cx={coords.x} cy={coords.y} r={24} fill="transparent" />

      {/* Floating Node Label */}
      <text
        x={coords.x}
        y={coords.y - (isMobile ? 14 : 16)}
        textAnchor="middle"
        className={cn(
          "font-mono font-bold tracking-tight select-none pointer-events-none transition-all duration-300",
          isMobile ? "text-[8px]" : "text-[10px]",
          active ? "fill-current " + colors.text : opacityLabel,
        )}
        fill={isDark ? "#EEEEEE" : "#112D4E"}
      >
        {shortTitle}
      </text>
    </g>
  );
});

export default function SkillTree({
  isDark,
  isLoading,
  externalHoveredNodeId,
  externalHoveredCategory,
  activeProficiency,
}: {
  isDark: boolean;
  isLoading?: boolean;
  externalHoveredNodeId?: string | null;
  externalHoveredCategory?: string | null;
  activeProficiency?: any[];
}) {
  const [nodes, setNodes] = useState<SkillNode[]>([]);

  const parseConnections = (conns: any) => {
    if (!conns) return [];
    if (typeof conns !== "string") return conns;
    try {
      return JSON.parse(conns);
    } catch {
      return conns
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
  };

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        let skillsArray = [];
        if (data.data?.skills) {
          skillsArray = data.data.skills;
        } else if (data.skills) {
          skillsArray = data.skills;
        } else if (Array.isArray(data.data)) {
          skillsArray = data.data;
        } else if (Array.isArray(data)) {
          skillsArray = data;
        }
        const parsed = (skillsArray || []).map((n: any) => ({
          ...n,
          connections: parseConnections(n.connections),
        }));
        if (parsed && parsed.length > 0) {
          setNodes(parsed);
        }
      })
      .catch(console.error);
  }, []);

  const [hoveredNode, setHoveredNode] = useState<SkillNode | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getBezierPath = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      if (isMobile) {
        const dy = (y2 - y1) * 0.5;
        return `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`;
      } else {
        const dx = (x2 - x1) * 0.5;
        return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
      }
    },
    [isMobile],
  );

  const getNodeCoords = useCallback(
    (node: SkillNode) => {
      if (!isMobile) {
        return { x: node.x, y: node.y };
      }
      switch (node.id) {
        case "nodejs":
          return { x: 75, y: 60 };
        case "go":
          return { x: 245, y: 60 };
        case "typescript":
          return { x: 75, y: 140 };
        case "dist-systems":
          return { x: 245, y: 140 };
        case "nestjs":
          return { x: 75, y: 220 };
        case "rest-api":
          return { x: 245, y: 220 };
        case "postgres":
          return { x: 75, y: 300 };
        case "docker":
          return { x: 245, y: 300 };
        case "redis":
          return { x: 75, y: 380 };
        case "k8s":
          return { x: 245, y: 380 };
        case "bullmq":
          return { x: 75, y: 460 };
        case "argocd":
          return { x: 245, y: 460 };
        case "azure-servicebus":
          return { x: 75, y: 540 };
        case "azure-apim":
          return { x: 245, y: 540 };
        case "python":
          return { x: 75, y: 620 };
        case "sap-integration":
          return { x: 245, y: 620 };
        case "langchain":
          return { x: 75, y: 700 };
        case "mekari-talenta":
          return { x: 245, y: 700 };
        case "langgraph":
          return { x: 75, y: 780 };
        case "llm-router":
          return { x: 245, y: 780 };
        case "claude-api":
          return { x: 75, y: 860 };
        case "vectordb":
          return { x: 245, y: 860 };
        default:
          return { x: node.x, y: node.y };
      }
    },
    [isMobile],
  );

  const getShortTitle = (node: SkillNode): string => {
    const labels: Record<string, string> = {
      nodejs: "Node.js",
      typescript: "TypeScript",
      nestjs: "NestJS",
      go: "Go",
      "dist-systems": "Dist. Systems",
      "rest-api": "REST API",
      postgres: "PostgreSQL",
      redis: "Redis",
      bullmq: "BullMQ",
      docker: "Docker",
      k8s: "Kubernetes",
      argocd: "ArgoCD",
      "azure-servicebus": "Azure Svc Bus",
      "azure-apim": "Azure APIM",
      python: "Python",
      langchain: "LangChain",
      "sap-integration": "SAP",
      langgraph: "LangGraph",
      "llm-router": "LLM Router",
      "mekari-talenta": "Mekari",
      "claude-api": "Claude / Gemini",
      vectordb: "pgvector",
    };
    return labels[node.id] ?? node.title.split(" ")[0];
  };

  const getEffectiveHoveredNode = () => {
    if (hoveredNode) return hoveredNode;
    if (externalHoveredNodeId) {
      // Find the node that matches the external proficiencySkillId relation
      const matched = nodes.find(
        (n) => n.proficiencySkillId === externalHoveredNodeId,
      );
      if (matched) return matched;
    }
    return null;
  };

  const isConnected = (sourceId: string, targetId: string) => {
    const effectiveNode = getEffectiveHoveredNode();
    if (!effectiveNode && !externalHoveredCategory) return false;

    // If an external category is hovered, show connections between nodes in that category
    if (externalHoveredCategory && !effectiveNode) {
      const sourceNode = nodes.find((n) => n.id === sourceId);
      const targetNode = nodes.find((n) => n.id === targetId);
      if (
        sourceNode?.categoryId === externalHoveredCategory &&
        targetNode?.categoryId === externalHoveredCategory
      ) {
        return true;
      }
      return false;
    }

    if (
      effectiveNode?.id === sourceId &&
      effectiveNode.connections.includes(targetId)
    )
      return true;

    const sourceNode = nodes.find((n) => n.id === sourceId);
    if (
      sourceNode &&
      sourceNode.connections.includes(targetId) &&
      (effectiveNode?.id === targetId || effectiveNode?.id === sourceId)
    ) {
      return true;
    }
    return false;
  };

  const getCategoryColor = useCallback((category: string) => {
    const catLower = (category || "").toLowerCase();
    if (catLower.includes("backend")) {
      return {
        bg: "bg-[rgba(251,191,36,0.1)] border-[rgba(251,191,36,0.3)] dark:border-[rgba(251,191,36,0.4)]",
        text: "text-[#fbbf24]",
        stroke: "#fbbf24",
        gradient: "from-[#fbbf24] to-[#d97706]",
      };
    } else if (catLower.includes("infra") || catLower.includes("data")) {
      return {
        bg: "bg-[rgba(244,63,94,0.1)] border-[rgba(244,63,94,0.3)] dark:border-[rgba(244,63,94,0.4)]",
        text: "text-[#f43f5e]",
        stroke: "#f43f5e",
        gradient: "from-[#f43f5e] to-[#be123c]",
      };
    } else {
      return {
        bg: "bg-[rgba(139,92,246,0.1)] border-[rgba(139,92,246,0.3)] dark:border-[rgba(139,92,246,0.4)]",
        text: "text-[#8b5cf6]",
        stroke: "#8b5cf6",
        gradient: "from-[#8b5cf6] to-[#6d28d9]",
      };
    }
  }, []);

  const handleNodeMouseEnter = useCallback((node: SkillNode) => {
    setHoveredNode(node);
  }, []);

  const handleNodeMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  // Pre-calculate and memoize connection paths to optimize rendering
  const connectionPaths = useMemo(() => {
    const buildPath = (node: SkillNode, connId: string) => {
      const target = nodes.find((n) => n.id === connId);
      if (!target) return null;
      const targetCoords = getNodeCoords(target);
      const coords = getNodeCoords(node);
      const path = getBezierPath(
        coords.x,
        coords.y,
        targetCoords.x,
        targetCoords.y,
      );
      return {
        id: `${node.id}-${connId}`,
        sourceId: node.id,
        targetId: connId,
        colors: getCategoryColor(node.category),
        path,
      };
    };

    return nodes.flatMap((node) =>
      node.connections
        .map((connId) => buildPath(node, connId))
        .filter((item): item is NonNullable<typeof item> => item !== null),
    );
  }, [nodes, getBezierPath, getCategoryColor, getNodeCoords]);

  if (isLoading) {
    return (
      <div className="p-8 rounded-3xl glass-card relative overflow-hidden border border-white/5 animate-pulse">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-300/30 dark:border-gray-700/30 pb-6 mb-8">
          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-300/30 dark:bg-zinc-700/40 rounded"></div>
            <div className="h-7 w-64 bg-gray-300/40 dark:bg-zinc-700/50 rounded"></div>
            <div className="h-3 w-80 bg-gray-300/20 dark:bg-zinc-700/30 rounded mt-2"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-5 w-20 bg-gray-300/30 dark:bg-zinc-700/40 rounded"></div>
            <div className="h-5 w-20 bg-gray-300/30 dark:bg-zinc-700/40 rounded"></div>
            <div className="h-5 w-20 bg-gray-300/30 dark:bg-zinc-700/40 rounded"></div>
          </div>
        </div>
        <div className="flex justify-center items-center py-10">
          <div className="w-full max-w-4xl h-[300px] rounded-2xl glass-card-inset flex flex-col justify-between p-6 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gray-300/20 dark:bg-zinc-700/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gray-300/20 dark:bg-zinc-700/20 rounded-full blur-3xl"></div>
            <svg
              className="absolute inset-0 w-full h-full opacity-30"
              viewBox="0 0 1000 300"
            >
              <path
                d="M 100 150 C 250 150, 250 100, 400 100"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="text-gray-300 dark:text-zinc-700"
              />
              <path
                d="M 400 100 C 550 100, 550 200, 700 200"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="text-gray-300 dark:text-zinc-700"
              />
              <path
                d="M 100 150 C 250 150, 250 200, 400 200"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="text-gray-300 dark:text-zinc-700"
              />
            </svg>
            <div className="flex justify-between items-center relative z-10 w-full h-full px-12">
              <div className="flex flex-col gap-12">
                <div className="w-10 h-10 rounded-full bg-gray-300/40 dark:bg-zinc-700/50"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300/40 dark:bg-zinc-700/50"></div>
              </div>
              <div className="flex flex-col gap-8">
                <div className="w-10 h-10 rounded-full bg-gray-300/40 dark:bg-zinc-700/50"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300/40 dark:bg-zinc-700/50"></div>
              </div>
              <div className="flex flex-col gap-12">
                <div className="w-10 h-10 rounded-full bg-gray-300/40 dark:bg-zinc-700/50"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300/40 dark:bg-zinc-700/50"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 h-20 w-full bg-gray-300/20 dark:bg-zinc-700/25 rounded-2xl shadow-neu-inset"></div>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-3xl glass-card relative overflow-hidden border border-white/5">
      {/* Background decoration elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-neu-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-neu-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10">
        {/* Responsive SVG Container wrapping the interactive map */}
        <div className="relative w-full select-none py-4 flex justify-center">
          <div
            className={cn(
              "relative",
              isMobile ? "w-full max-w-[320px] h-[940px]" : "w-full h-[420px]",
            )}
          >
            <svg
              viewBox={isMobile ? "0 0 320 940" : "0 0 1260 400"}
              className="w-full h-full absolute inset-0 z-0 overflow-visible"
            >
              <defs>
                <linearGradient
                  id="backend-grad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop
                    offset="100%"
                    stopColor={isDark ? "#b45309" : "#fcd34d"}
                  />
                </linearGradient>
                <linearGradient
                  id="infra-grad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop
                    offset="100%"
                    stopColor={isDark ? "#be123c" : "#fda4af"}
                  />
                </linearGradient>
                <linearGradient
                  id="ai-grad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop
                    offset="100%"
                    stopColor={isDark ? "#6d28d9" : "#c4b5fd"}
                  />
                </linearGradient>
              </defs>

              {/* Render all curved connection paths */}
              {connectionPaths.map((conn) => {
                const active = isConnected(conn.sourceId, conn.targetId);
                return (
                  <g key={conn.id}>
                    {/* Shadow / Base track path */}
                    <path
                      d={conn.path}
                      fill="none"
                      stroke={isDark ? "#393E46" : "#DBE2EF"}
                      strokeWidth={3}
                      className="transition-colors duration-300"
                    />
                    {/* Glowing active path overlay */}
                    <path
                      d={conn.path}
                      fill="none"
                      stroke={conn.colors.stroke}
                      strokeWidth={active ? 4 : 1.5}
                      className={cn(
                        "transition-all duration-300",
                        active ? "opacity-100" : "opacity-30 dark:opacity-40",
                      )}
                    />
                  </g>
                );
              })}

              {/* Render all interactive nodes */}
              {nodes.map((node) => {
                const effectiveNode = getEffectiveHoveredNode();

                // A node is active if it's the effective hovered node, OR if it belongs to the external hovered category (and no specific node is hovered)
                let active = effectiveNode?.id === node.id;
                if (!effectiveNode && externalHoveredCategory) {
                  active = node.categoryId === externalHoveredCategory;
                }

                const anyActive =
                  effectiveNode !== null || externalHoveredCategory !== null;

                let connectedToActive = false;
                if (effectiveNode) {
                  connectedToActive =
                    effectiveNode.connections.includes(node.id) ||
                    node.connections.includes(effectiveNode.id) ||
                    effectiveNode.id === node.id;
                } else if (externalHoveredCategory) {
                  connectedToActive =
                    node.categoryId === externalHoveredCategory;
                }

                const colors = getCategoryColor(node.category);
                const coords = getNodeCoords(node);
                const shortTitle = getShortTitle(node);

                return (
                  <SkillTreeNode
                    key={node.id}
                    node={node}
                    active={active}
                    anyActive={anyActive}
                    connectedToActive={connectedToActive}
                    isDark={isDark}
                    isMobile={isMobile}
                    coords={coords}
                    colors={colors}
                    shortTitle={shortTitle}
                    onMouseEnter={() => handleNodeMouseEnter(node)}
                    onMouseLeave={handleNodeMouseLeave}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Dynamic Proficiency Details card below tree */}
        <div className="mt-6 p-5 rounded-2xl glass-card-inset relative min-h-[110px] flex flex-col justify-center border border-white/5">
          <AnimatePresence mode="wait">
            {getEffectiveHoveredNode() ? (
              <motion.div
                key={getEffectiveHoveredNode()?.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center animate-fade-in"
              >
                <div className="md:col-span-1 border-r border-gray-300/30 dark:border-gray-700/30 pr-4">
                  <span
                    className={cn(
                      "text-[10px] font-mono font-bold uppercase tracking-wider block mb-1",
                      getCategoryColor(getEffectiveHoveredNode()!.category)
                        .text,
                    )}
                  >
                    {getEffectiveHoveredNode()!.category}
                  </span>
                  <h4 className="text-lg font-bold text-neu-text tracking-tight leading-tight mb-1">
                    {getEffectiveHoveredNode()!.title}
                  </h4>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 glass-card rounded-xl text-[10px] font-mono font-bold text-neu-accent mt-1">
                    Proficiency: {getEffectiveHoveredNode()!.level}
                  </div>
                </div>
                <div className="md:col-span-3 pl-2">
                  <span className="text-[10px] font-mono text-neu-accent font-bold uppercase tracking-widest block mb-1">
                    TECHNICAL APPLICATION & DEPLOYED CONCEPTS
                  </span>
                  <p className="text-sm text-neu-text-muted leading-relaxed font-sans font-light">
                    {getEffectiveHoveredNode()!.details}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4"
              >
                <p className="text-xs font-mono text-neu-text-muted italic flex items-center justify-center gap-2">
                  <span>
                    {externalHoveredCategory
                      ? `✦ Highlighting ${activeProficiency?.find((p) => p.id === externalHoveredCategory)?.title || "Selected"} category infrastructure.`
                      : `✦ Hover over any skill node in the progressive blueprint to reveal technical proficiencies and infrastructure deployments.`}
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
