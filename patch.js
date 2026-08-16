const fs = require('fs');
const file = '/home/awaluddin/workshop/shelf-book-portofolio/src/widgets/project-modal/ui/ProjectModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const components = `const ProjectDetailsPage = ({ selectedProject }: { selectedProject: any }) => (
  <div className="flex flex-col h-full space-y-8">
    <div>
      <h2 className="text-3xl font-display font-black tracking-tight mb-2 text-zinc-900 dark:text-white">{selectedProject.title}</h2>
      <p className="text-sm italic font-mono text-zinc-600 dark:text-zinc-400">{selectedProject.subtitle}</p>
    </div>
    
    <div className="flex flex-wrap items-center gap-3">
      {selectedProject.demoUrl && (
        <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-neu-accent hover:bg-neu-accent/90 text-white rounded-lg font-mono text-[10px] font-bold shadow-md transition-transform active:scale-95">
          <Globe size={14} /> Live Demo
        </a>
      )}
      {selectedProject.github && (
        <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg font-mono text-[10px] font-bold shadow-sm border border-zinc-300 dark:border-zinc-700 transition-transform active:scale-95">
          <Github size={14} /> Source Code
        </a>
      )}
    </div>

    {selectedProject.stats && selectedProject.stats.length > 0 && (
      <div>
        <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-4 flex items-center gap-2">
          <Terminal size={14} /> Project Metrics
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {selectedProject.stats.map((stat: any, idx: number) => (
            <div key={idx} className="p-3 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between items-start text-left">
              <span className="text-lg font-bold font-display text-zinc-900 dark:text-white tracking-tight">{stat.value}</span>
              <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const ProjectTechStackPage = ({ selectedProject, getTechIconAndColor, activeProjects }: { selectedProject: any, getTechIconAndColor: any, activeProjects: any[] }) => (
  <div className="flex flex-col h-full space-y-8">
    {(selectedProject.reasonToBuild || selectedProject.problemSolved) && (
      <div className="flex flex-col gap-6">
        {selectedProject.reasonToBuild && (
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-3 flex items-center gap-2">
              <Lightbulb size={14} className="text-neu-accent" /> Why I Built This
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">{selectedProject.reasonToBuild}</p>
          </div>
        )}
        {selectedProject.problemSolved && (
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-3 flex items-center gap-2">
              <Target size={14} className="text-neu-accent" /> Business Problem Solved
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">{selectedProject.problemSolved}</p>
          </div>
        )}
      </div>
    )}

    <div>
      <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <Code2 size={14} /> Technology Stack
      </h4>
      <div className="flex flex-wrap gap-2">
        {(selectedProject.tags || []).map((tag: string) => {
          const { color, icon } = getTechIconAndColor(tag);
          return (
            <div key={tag} className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-mono font-medium shadow-sm">
              <span className={cn("flex-shrink-0 w-3 h-3", color)}>{icon}</span>
              <span className="text-zinc-700 dark:text-zinc-300">{tag}</span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const ProjectMarkdownPage = ({ content, index, total, copiedCode, setCopiedCode }: { content: any, index: number, total: number, copiedCode: string | null, setCopiedCode: any }) => (
  <div className="w-full h-full flex flex-col">
    <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 shrink-0">
      <FileText size={14} /> System Specifications {total > 1 ? \`(\${index + 1}/\${total})\` : ''}
    </h4>
    {content ? (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar prose prose-slate prose-sm max-w-none font-sans
        prose-headings:font-display prose-headings:font-bold prose-headings:text-zinc-900 dark:prose-headings:text-white
        prose-p:text-zinc-600 dark:prose-p:text-zinc-400 
        prose-li:text-zinc-600 dark:prose-li:text-zinc-400 
        prose-strong:text-zinc-900 dark:prose-strong:text-white
        dark:prose-invert">
        <ReactMarkdown
          components={{
            code({ className, children, ...props }: any) {
              const match = /language-(\\w+)/.exec(className || "");
              if (!match) return <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-pink-500 text-xs font-mono" {...props}>{children}</code>;
              if (match[1] === "mermaid") return <MermaidDiagram chart={String(children).replace(/\\n$/, "")} />;
              return (
                <div className="relative group/code my-4 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-[#0d1117] not-prose">
                  <div className="flex items-center justify-between px-4 py-2 bg-black/5 dark:bg-white/5 border-b border-zinc-200 dark:border-white/10 text-[10px] font-mono text-zinc-500 dark:text-gray-400">
                    <span>{match[1]}</span>
                    <button onClick={() => { navigator.clipboard.writeText(String(children)); setCopiedCode(String(children)); setTimeout(() => setCopiedCode(null), 2000); }} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                      {copiedCode === String(children) ? <Check size={12} className="text-green-500 dark:text-green-400" /> : <Copy size={12} />}
                    </button>
                  </div>
                  <div className="p-4 overflow-x-auto text-xs font-mono text-zinc-700 dark:text-gray-300">
                    {String(children)}
                  </div>
                </div>
              );
            }
          }}
        >{content}</ReactMarkdown>
      </div>
    ) : (
      <p className="text-xs text-zinc-500 italic">No markdown specifications provided.</p>
    )}
  </div>
);

const ProjectArchitecturePage = ({ content, index, total, selectedProject, isDark }: { content: any, index: number, total: number, selectedProject: any, isDark: boolean }) => (
  <div className="w-full h-full flex flex-col">
    <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 shrink-0">
      <Layers size={14} /> System Architecture {total > 1 ? \`(\${index + 1}/\${total})\` : ''}
    </h4>
    <div className="flex-1 min-h-0 bg-white dark:bg-zinc-900/50 rounded-xl p-2 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-inner flex flex-col relative gap-2">
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
        {content?.imageUrl ? (
           <ProjectArchitectureDiagram project={selectedProject} isDark={isDark} imageUrl={content.imageUrl} />
        ) : (
          <p className="text-xs text-zinc-500 italic">No architecture diagram provided.</p>
        )}
      </div>
      {content?.description && (
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg shrink-0 overflow-y-auto max-h-[40%] custom-scrollbar text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
          {content.description}
        </div>
      )}
    </div>
  </div>
);

const ProjectLifecyclePage = ({ selectedProject }: { selectedProject: any }) => (
  <div className="w-full h-full flex flex-col">
    <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 shrink-0">
      <Network size={14} /> Lifecycle Tracker
    </h4>
    <div className="flex-1 min-h-0 bg-white dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-inner overflow-y-auto custom-scrollbar">
       {selectedProject.projectLifecycles?.length > 0 ? (
         <ProjectLifecycleTracker projectId={selectedProject.id} spineColor={selectedProject.spineColor} />
       ) : (
         <p className="text-xs text-zinc-500 italic text-center mt-4">No lifecycle data provided.</p>
       )}
    </div>
  </div>
);

const ProjectSchemaPage = ({ content, index, total }: { content: any, index: number, total: number }) => (
  <div className="w-full h-full flex flex-col">
    <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 shrink-0">
      <Database size={14} /> Database Schema {total > 1 ? \`(\${index + 1}/\${total})\` : ''}
    </h4>
    <div className="flex-1 min-h-0 bg-white dark:bg-zinc-900/50 rounded-xl p-2 border border-zinc-200 dark:border-zinc-800 shadow-inner overflow-hidden flex flex-col relative gap-2">
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-[#0d1117] rounded-lg">
        {content?.imageUrl ? (
          <img src={content.imageUrl} alt="Schema Diagram" className="w-full h-full object-contain" />
        ) : (
          <p className="text-xs text-zinc-500 italic">No schema diagram provided.</p>
        )}
      </div>
      {content?.description && (
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg shrink-0 overflow-y-auto max-h-[40%] custom-scrollbar text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
          {content.description}
        </div>
      )}
    </div>
  </div>
);

const ProjectErdPage = ({ content, index, total }: { content: any, index: number, total: number }) => (
  <div className="w-full h-full flex flex-col">
    <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 shrink-0">
      <Database size={14} /> Entity Relationship Diagram {total > 1 ? \`(\${index + 1}/\${total})\` : ''}
    </h4>
    <div className="flex-1 min-h-0 bg-white dark:bg-zinc-900/50 rounded-xl p-2 border border-zinc-200 dark:border-zinc-800 shadow-inner overflow-hidden flex flex-col relative gap-2">
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-[#0d1117] rounded-lg">
        {content?.imageUrl ? (
          <img src={content.imageUrl} alt="ERD Diagram" className="w-full h-full object-contain" />
        ) : (
          <p className="text-xs text-zinc-500 italic">No ERD diagram provided.</p>
        )}
      </div>
      {content?.description && (
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg shrink-0 overflow-y-auto max-h-[40%] custom-scrollbar text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
          {content.description}
        </div>
      )}
    </div>
  </div>
);

const ProjectRelatedPage = ({ selectedProject, activeProjects, onSelectProject }: { selectedProject: any, activeProjects: any, onSelectProject: any }) => (
  <div className="w-full h-full flex flex-col justify-between">
    <div>
      <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <Sparkles size={14} /> Related Projects
      </h4>
      <div className="grid grid-cols-1 gap-3">
        {getRelatedProjects(selectedProject, activeProjects).slice(0, 4).map((proj) => (
          <div
            key={proj.id}
            onClick={(e) => { e.stopPropagation(); onSelectProject(proj); }}
            className="p-3 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 hover:border-neu-accent/50 cursor-pointer group transition-all flex items-center gap-3 text-left"
          >
            <div className={cn("w-10 h-12 rounded-sm flex-shrink-0 flex items-center justify-center relative shadow-sm",
                !proj.spineColor?.startsWith("#") && !proj.spineColor?.startsWith("rgb") ? proj.spineColor : ""
              )}
              style={{ ...(proj.spineColor?.startsWith("#") || proj.spineColor?.startsWith("rgb") ? { backgroundColor: proj.spineColor } : {}) }}
            ></div>
            <div className="flex-1 min-w-0">
              <span className="text-[8px] font-mono text-neu-accent font-bold uppercase tracking-wider block">{proj.category}</span>
              <h5 className="text-xs font-bold text-zinc-900 dark:text-white truncate mt-0.5 group-hover:text-neu-accent transition-colors">{proj.title}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

`;

const renderInteriorSectionReplacement = `  const renderInteriorSection = (data: any) => {
    if (!selectedProject || !data) return null;
    const { type, content, index, total } = data;

    switch (type) {
      case 'details':
        return <ProjectDetailsPage selectedProject={selectedProject} />;
      case 'tech-stack':
        return <ProjectTechStackPage selectedProject={selectedProject} getTechIconAndColor={getTechIconAndColor} activeProjects={activeProjects} />;
      case 'markdown':
        return <ProjectMarkdownPage content={content} index={index} total={total} copiedCode={copiedCode} setCopiedCode={setCopiedCode} />;
      case 'architecture':
        return <ProjectArchitecturePage content={content} index={index} total={total} selectedProject={selectedProject} isDark={isDark} />;
      case 'lifecycle':
        return <ProjectLifecyclePage selectedProject={selectedProject} />;
      case 'schema':
        return <ProjectSchemaPage content={content} index={index} total={total} />;
      case 'erd':
        return <ProjectErdPage content={content} index={index} total={total} />;
      case 'related':
        return <ProjectRelatedPage selectedProject={selectedProject} activeProjects={activeProjects} onSelectProject={onSelectProject} />;
      default: return null;
    }
  };`;

// Replace `export default function ProjectModal({` with components + export
content = content.replace('export default function ProjectModal({', components + 'export default function ProjectModal({');

// Replace the large renderInteriorSection
const startStr = 'const renderInteriorSection = (data: any) => {';
const startIndex = content.indexOf(startStr);
const endStr = 'const renderSpreadContent = (spread: any) => {';
const endIndex = content.indexOf(endStr);

content = content.substring(0, startIndex) + renderInteriorSectionReplacement + '\n\n' + content.substring(endIndex);

fs.writeFileSync(file, content);
