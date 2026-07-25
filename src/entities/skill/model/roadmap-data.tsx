import React from "react";
import { Code2, Database, BrainCircuit, Globe } from "lucide-react";
export const legendLevels = [
  {
    level: 0,
    darkBg: "bg-zinc-800/60",
    lightBg: "bg-gray-200",
    label: "No contributions (0)",
  },
  {
    level: 1,
    darkBg: "bg-emerald-950",
    lightBg: "bg-indigo-100",
    label: "Low (1-2 contributions)",
  },
  {
    level: 2,
    darkBg: "bg-emerald-800",
    lightBg: "bg-indigo-300",
    label: "Medium (3-4 contributions)",
  },
  {
    level: 3,
    darkBg: "bg-emerald-500",
    lightBg: "bg-indigo-500",
    label: "High (5-7 contributions)",
  },
  {
    level: 4,
    darkBg: "bg-emerald-400",
    lightBg: "bg-indigo-600",
    label: "Very high (8+ contributions)",
  },
];

export const roadmapItems = [
  {
    quarter: "Q3 2026",
    title: "Systems & High-Performance Services",
    tech: "Rust & WebAssembly",
    icon: <Code2 size={20} />,
    description:
      "Transitioning performance-critical modules to memory-safe systems programming to design ultra-low latency WebAssembly edge services.",
    status: "Plan Formulated",
    depth: "Intermediate Focus",
    color: "from-purple-500 to-indigo-600",
    darkColor: "from-emerald-500 to-teal-500",
    topics: [
      "Ownership & Borrow Checker",
      "Tokio Async Runtime",
      "WASM Edge Handlers",
      "Zero-cost Abstractions",
    ],
    projects: [
      "WASM-based HTTP Request Filter",
      "High-performance API Proxy in Rust",
    ],
  },
  {
    quarter: "Q4 2026",
    title: "Advanced Streaming & Event Architecture",
    tech: "Apache Kafka & Event Sourcing",
    icon: <Database size={20} />,
    description:
      "Building robust, multi-region distributed streaming architectures with strict event ordering, transaction support, and message guarantees.",
    status: "Scheduled",
    depth: "Advanced Practice",
    color: "from-blue-500 to-cyan-500",
    darkColor: "from-emerald-400 to-emerald-600",
    topics: [
      "Partitioning & Consumer Groups",
      "Kafka Streams API",
      "Schema Registry & Avro",
      "Idempotent Producers",
    ],
    projects: [
      "Real-time Event Logging Pipeline",
      "Transactional Event-Sourced Ledger",
    ],
  },
  {
    quarter: "Q1 2027",
    title: "Agentic Workflows & Cognitive Systems",
    tech: "LangGraph & Stateful Agents",
    icon: <BrainCircuit size={20} />,
    description:
      "Evolving LLM integrations from standard RAG pipelines into autonomous stateful multi-agent systems that learn and adapt with memory.",
    status: "Research Phase",
    depth: "Architect Level",
    color: "from-pink-500 to-rose-500",
    darkColor: "from-green-400 to-emerald-500",
    topics: [
      "Stateful Multi-Agent Graphs",
      "Human-in-the-loop Workflows",
      "Semantic Caching & Memory",
      "Self-Correcting RAG",
    ],
    projects: [
      "Autonomous PR Reviewer Agent",
      "Self-Improving Code Interpreter Engine",
    ],
  },
  {
    quarter: "Q2 2027",
    title: "Edge-Native WebAssembly Serverless",
    tech: "Wasmtime & Spin Runtime",
    icon: <Globe size={20} />,
    description:
      "Leveraging WebAssembly System Interface (WASI) and modular compilation to deploy sandboxed, lightning-fast edge-native serverless functions.",
    status: "Exploration Phase",
    depth: "Intermediate Focus",
    color: "from-amber-500 to-orange-500",
    darkColor: "from-teal-400 to-emerald-400",
    topics: [
      "WASI Preview 2",
      "Component Model Architecture",
      "Spin Serverless Framework",
      "Secure Sandbox Environments",
    ],
    projects: [
      "Edge-Deployed GeoIP Middleware",
      "Instant-boot Sandbox Function Orchestrator",
    ],
  },
];
