"use client";

import React from "react";
import { AdminCrudTable } from "@/widgets/admin-crud-table/ui/AdminCrudTable";
import { Plus, X } from "lucide-react";

export default function AdminProficiency() {
  return (
    <AdminCrudTable
      title="Proficiency Pillars (v2)"
      itemName="Pillar"
      apiEndpoint="/api/v2/proficiency"
      dataExtractor={(data) => {
        if (data.data?.pillars) return data.data.pillars;
        if (data.pillars) return data.pillars;
        if (Array.isArray(data.data)) return data.data;
        if (Array.isArray(data)) return data;
        return [];
      }}
      defaultFormData={{
        pillarNumber: "01",
        title: "",
        description: "",
        icon: "Server",
        skills: [],
        order: 1,
      }}
      columns={[
        {
          header: "Pillar",
          render: (item: any) => (
            <div>
              <span className="text-[10px] font-mono font-bold text-brand uppercase mr-2">
                [{item.pillarNumber}]
              </span>
              <span className="font-bold text-neu-text">{item.title}</span>
              <div className="text-xs text-neu-text-muted mt-0.5 line-clamp-1">
                {item.description}
              </div>
            </div>
          ),
        },
        {
          header: "Skills",
          render: (item: any) => (
            <div className="text-xs text-neu-text-muted">
              {item.skills?.length || 0} skills ({item.icon})
            </div>
          ),
        },
      ]}
      renderForm={(formData, setFormData) => {
        const handleAddSkill = () => {
          setFormData({
            ...formData,
            skills: [
              ...(formData.skills || []),
              {
                name: "",
                status: "PROD",
              },
            ],
          });
        };

        const handleUpdateSkill = (
          index: number,
          field: string,
          value: string,
        ) => {
          const newSkills = [...formData.skills];
          newSkills[index] = { ...newSkills[index], [field]: value };
          setFormData({ ...formData, skills: newSkills });
        };

        const handleRemoveSkill = (index: number) => {
          const newSkills = [...formData.skills];
          newSkills.splice(index, 1);
          setFormData({ ...formData, skills: newSkills });
        };

        return (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-neu-text-muted">
                  Pillar Number
                </span>
                <input
                  required
                  value={formData.pillarNumber || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, pillarNumber: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none font-mono"
                  placeholder="01"
                />
              </div>
              <div className="space-y-1 col-span-2">
                <span className="text-xs font-mono text-neu-text-muted">
                  Pillar Title
                </span>
                <input
                  required
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none"
                  placeholder="Core Backend & Distributed Systems"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-neu-text-muted">
                  Icon
                </span>
                <select
                  value={formData.icon || "Server"}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none"
                >
                  <option value="Server">Server</option>
                  <option value="BrainCircuit">BrainCircuit (AI)</option>
                  <option value="Database">Database</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Cpu">Cpu</option>
                  <option value="BriefcaseBusiness">BriefcaseBusiness</option>
                </select>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono text-neu-text-muted">
                  Display Order
                </span>
                <input
                  type="number"
                  value={formData.order || 1}
                  onChange={(e) =>
                    setFormData({ ...formData, order: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-neu-text-muted">
                Description
              </span>
              <textarea
                required
                rows={2}
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none"
                placeholder="High-concurrency services, event-driven orchestration, idempotency, and IPC."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neu-text-muted">
                  Skills Matrix ({formData.skills?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="text-xs font-bold text-neu-accent hover:underline flex items-center gap-1"
                  name="Add Skill"
                >
                  <Plus size={14} /> Add Skill
                </button>
              </div>

              <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-2 pb-2">
                {(formData.skills || []).map((skill: any, index: number) => (
                  <div
                    key={index as number}
                    className="p-3 rounded-xl glass-card-inset border border-white/5 relative group"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X size={12} />
                    </button>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1 col-span-2">
                        <span className="text-[10px] font-mono text-neu-text-muted">
                          Skill Name
                        </span>
                        <input
                          required
                          value={skill.name}
                          onChange={(e) =>
                            handleUpdateSkill(index, "name", e.target.value)
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-sm outline-none border border-transparent focus:border-neu-accent/50"
                          placeholder="e.g. Go (Golang)"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-neu-text-muted">
                          Status
                        </span>
                        <select
                          value={skill.status || "PROD"}
                          onChange={(e) =>
                            handleUpdateSkill(index, "status", e.target.value)
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-sm outline-none border border-transparent focus:border-neu-accent/50 font-mono"
                        >
                          <option value="PROD">PROD</option>
                          <option value="R&D">R&D</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                {(!formData.skills || formData.skills.length === 0) && (
                  <div className="text-center p-4 border border-dashed border-white/10 rounded-xl text-xs text-neu-text-muted">
                    No skills added yet.
                  </div>
                )}
              </div>
            </div>
          </>
        );
      }}
    />
  );
}
