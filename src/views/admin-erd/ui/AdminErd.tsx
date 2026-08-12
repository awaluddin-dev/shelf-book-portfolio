"use client";

import React from "react";
import { AdminImageNodesManager } from "@/widgets/admin-image-nodes-manager/ui/AdminImageNodesManager";

export default function AdminErd() {
  return (
    <AdminImageNodesManager
      title="Entity Relationship Diagram Nodes"
      apiEndpoint="/api/erd"
      imagePlaceholder="Image URL (e.g. /assets/erd1.png)"
      imageAlt="ERD Preview"
    />
  );
}
